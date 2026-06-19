"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessCard } from "@/features/builder/components/business-card";
import type { CardDisplayMode } from "@/lib/card-data";
import { downloadCard, type CardDownloadFormat } from "@/lib/card-export";
import { getPublicCardUrl } from "@/lib/card-slug";
import { getTheme } from "@/lib/card-themes";
import { useTRPC } from "@/trpc/client";
import {
  ArrowLeft01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  CheckIcon,
  Copy01Icon,
  Download01Icon,
  Edit02Icon,
  Loading03Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function defaultExportSides(displayMode: CardDisplayMode) {
  return {
    front: displayMode === "pair" || displayMode === "front",
    back: displayMode === "pair" || displayMode === "back",
  };
}

export function ShareView({ cardId }: { cardId: string }) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<CardDownloadFormat | null>(
    null,
  );
  const [exportFront, setExportFront] = useState(true);
  const [exportBack, setExportBack] = useState(true);
  const [exportSidesInitialized, setExportSidesInitialized] = useState(false);

  const {
    data: card,
    isLoading,
    isError,
  } = useQuery(trpc.card.getById.queryOptions({ id: cardId }));

  const { data: allCards = [] } = useQuery(trpc.card.list.queryOptions());

  const setPublished = useMutation(
    trpc.card.setPublished.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(
          trpc.card.getById.queryFilter({ id: cardId }),
        );
        void queryClient.invalidateQueries(trpc.card.list.queryFilter());
      },
    }),
  );

  useEffect(() => {
    setExportSidesInitialized(false);
  }, [cardId]);

  useEffect(() => {
    if (!card || exportSidesInitialized) return;
    const defaults = defaultExportSides(card.displayMode);
    setExportFront(defaults.front);
    setExportBack(defaults.back);
    setExportSidesInitialized(true);
  }, [card, exportSidesInitialized]);

  const cardSetCards = useMemo(
    () =>
      allCards
        .filter(
          (item) => card && item.cardSetId === card.cardSetId,
        )
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    [allCards, card],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-1">
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
        <p className="text-sm text-muted-foreground">Loading share settings</p>
      </div>
    );
  }

  if (isError || !card) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">Card not found.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  const theme = getTheme(card.themeId);
  const cardUrl = card.slug ? getPublicCardUrl(card.slug) : "";

  const bundleIndex = cardSetCards.findIndex((item) => item.id === card.id);
  const prevCard = bundleIndex > 0 ? cardSetCards[bundleIndex - 1] : null;
  const nextCard =
    bundleIndex >= 0 && bundleIndex < cardSetCards.length - 1
      ? cardSetCards[bundleIndex + 1]
      : null;
  const isBundle = cardSetCards.length > 1;

  const editHref = `/builder/${card.resumeId}?cards=${card.id}`;
  const downloadName = card.cardData.name || theme.name;

  async function handleDownload(format: CardDownloadFormat) {
    const element = cardPreviewRef.current;
    if (!element) {
      toast.error("Card preview is not ready yet.");
      return;
    }

    if (!exportFront && !exportBack) {
      toast.error("Select at least one side to download.");
      return;
    }

    try {
      setDownloading(format);
      await downloadCard(element, format, downloadName, {
        front: exportFront,
        back: exportBack,
      });
      toast.success(`Downloaded ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to download card.",
      );
    } finally {
      setDownloading(null);
    }
  }

  function copy() {
    if (!cardUrl) {
      toast.error("Publish the card first to get a share link.");
      return;
    }

    void navigator.clipboard?.writeText(cardUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Button asChild variant="ghost">
          <Link href="/dashboard">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            Back to dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Share your card
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {card.cardData.name || theme.name} · {theme.name} theme
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-1.5" asChild>
            <Link href={editHref}>
              <HugeiconsIcon icon={Edit02Icon} size={14} />
              Edit
            </Link>
          </Button>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
            <span className="flex items-center gap-2 text-sm">
              <span
                className={
                  "size-2.5 rounded-full " +
                  (card.published ? "bg-emerald-500" : "bg-red-500")
                }
              />
              {card.published ? "Published" : "Unpublished"}
            </span>
            <Switch
              checked={card.published}
              disabled={setPublished.isPending}
              onCheckedChange={(published) =>
                setPublished.mutate({ id: card.id, published })
              }
              aria-label="Toggle published"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Download sides
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={exportFront}
            onCheckedChange={(checked) => setExportFront(checked === true)}
          />
          Front
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={exportBack}
            onCheckedChange={(checked) => setExportBack(checked === true)}
          />
          Back
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-1.5"
              disabled={downloading !== null || (!exportFront && !exportBack)}
            >
              {downloading ? (
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <HugeiconsIcon icon={Download01Icon} size={14} />
              )}
              {downloading
                ? `Downloading ${downloading.toUpperCase()}…`
                : "Download"}
              <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => void handleDownload("png")}>
              Download as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void handleDownload("pdf")}>
              Download as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void handleDownload("svg")}>
              Download as SVG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="text-xs text-muted-foreground">
          Transparent background · 4× quality · PDF uses separate pages
        </p>
      </div>

      <div ref={cardPreviewRef} className="mt-6">
        {isBundle ? (
          <div className="mb-4 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!prevCard}
              aria-label="Previous card in bundle"
              onClick={() =>
                prevCard && router.push(`/share/${prevCard.id}`)
              }
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            </Button>
            <p className="min-w-28 text-center text-sm text-muted-foreground">
              Card {bundleIndex + 1} of {cardSetCards.length}
            </p>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!nextCard}
              aria-label="Next card in bundle"
              onClick={() =>
                nextCard && router.push(`/share/${nextCard.id}`)
              }
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </div>
        ) : null}
        <div className="flex justify-center p-6">
          <BusinessCard
            data={card.cardData}
            theme={theme}
            displayMode="pair"
            className="md:flex-row flex-col"
          />
        </div>
      </div>

      <Tabs defaultValue="link" className="mt-8">
        <TabsList>
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="link" className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <Label htmlFor="card-url">Your card link</Label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Input
                id="card-url"
                readOnly
                value={cardUrl || "Publish to generate a link"}
                className="font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={copy}
                  disabled={!cardUrl}
                  className="flex-1 sm:flex-none"
                >
                  {copied ? (
                    <HugeiconsIcon icon={CheckIcon} size={16} />
                  ) : (
                    <HugeiconsIcon icon={Copy01Icon} size={16} />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
                {cardUrl ? (
                  <Button variant="outline" asChild>
                    <a href={cardUrl} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            {!card.published ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Turn on publishing above to generate your public link.
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={ViewIcon} />
              </span>
              <div>
                <p className="text-sm font-medium">
                  {card.viewCount.toLocaleString()} views
                </p>
                <p className="text-xs text-muted-foreground">
                  Public page visits
                </p>
              </div>
            </div>
            {card.slug ? <Badge variant="secondary">/{card.slug}</Badge> : null}
          </div>
        </TabsContent>

        <TabsContent value="qr" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm font-medium">QR code coming soon</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use your share link in the meantime.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
