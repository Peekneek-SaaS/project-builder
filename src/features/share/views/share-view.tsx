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
import { CardPreviewScaler } from "@/features/builder/components/card-preview-scaler";
import { CardExportSurface } from "@/features/share/components/card-export-surface";
import { ShareProfileEditor } from "@/features/share/components/share-profile-editor";
import { getCardBuilderLabel, type CardDisplayMode } from "@/lib/card-data";
import { ShareQrCode } from "@/features/share/components/share-qr-code";
import { downloadCard, type CardDownloadFormat } from "@/lib/card-export";
import {
  buildEmbedIframeCode,
  EMBED_CODE_FORMAT_LABELS,
  type EmbedCodeFormat,
  getPublicCardUrl,
  getTrackableShareUrl,
} from "@/lib/card-slug";
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
  PrinterIcon,
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
  const cardExportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [downloading, setDownloading] = useState<CardDownloadFormat | null>(
    null,
  );
  const [exportFront, setExportFront] = useState(true);
  const [exportBack, setExportBack] = useState(true);
  const [exportRoundedCorners, setExportRoundedCorners] = useState(false);
  const [exportSidesInitialized, setExportSidesInitialized] = useState(false);
  const [embedFormat, setEmbedFormat] = useState<EmbedCodeFormat>("html");

  const {
    data: card,
    isLoading,
    isError,
  } = useQuery(trpc.card.getById.queryOptions({ id: cardId }));

  const { data: allCards = [] } = useQuery(trpc.card.list.queryOptions());
  const { data: billing } = useQuery(trpc.billing.getPlan.queryOptions());

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
    setCopiedIframe(false);
  }, [embedFormat]);

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
        .filter((item) => card && item.cardSetId === card.cardSetId)
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
  const cardTitle = getCardBuilderLabel(card.cardData);
  const cardUrl = card.slug ? getTrackableShareUrl(card.slug) : "";
  const publicCardUrl = card.slug ? getPublicCardUrl(card.slug) : "";
  const embedCode = card.slug
    ? buildEmbedIframeCode(card.slug, cardTitle, embedFormat)
    : "";

  const bundleIndex = cardSetCards.findIndex((item) => item.id === card.id);
  const prevCard = bundleIndex > 0 ? cardSetCards[bundleIndex - 1] : null;
  const nextCard =
    bundleIndex >= 0 && bundleIndex < cardSetCards.length - 1
      ? cardSetCards[bundleIndex + 1]
      : null;
  const isBundle = cardSetCards.length > 1;

  const editHref = `/builder/${card.resumeId}?cards=${card.id}`;
  const downloadName = cardTitle;

  async function handleDownload(format: CardDownloadFormat) {
    const element = cardExportRef.current;
    if (!element) {
      toast.error("Card export is not ready yet. Please wait a moment.");
      return;
    }

    if (!exportFront && !exportBack) {
      toast.error("Select at least one side to download.");
      return;
    }

    try {
      setDownloading(format);
      toast.message("Preparing high-quality export…");
      await downloadCard(
        element,
        format,
        downloadName,
        {
          front: exportFront,
          back: exportBack,
        },
        {
          orientation: theme.orientation,
        },
      );
      toast.success(
        format === "pdf"
          ? "Print-ready PDF downloaded"
          : `Downloaded ${format.toUpperCase()}`,
      );
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

  function copyIframe() {
    if (!embedCode) {
      toast.error("Publish the card first to get embed code.");
      return;
    }

    void navigator.clipboard?.writeText(embedCode);
    setCopiedIframe(true);
    toast.success("Embed code copied to clipboard");
    setTimeout(() => setCopiedIframe(false), 1800);
  }

  return (
    <div className="mx-auto px-4 py-8 sm:px-6">
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
            {cardTitle} · {theme.name} theme
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-1.5 p-5" asChild>
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

      <div className="mt-6">
        {isBundle ? (
          <div className="mb-4 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!prevCard}
              aria-label="Previous card in bundle"
              onClick={() => prevCard && router.push(`/share/${prevCard.id}`)}
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
              onClick={() => nextCard && router.push(`/share/${nextCard.id}`)}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </div>
        ) : null}
        <CardPreviewScaler
          className="min-w-0 max-w-full rounded-xl border border-border"
          minHeightClass="min-h-[min(340px,42vh)] lg:min-h-[min(480px,55vh)]"
        >
          <BusinessCard
            data={card.cardData}
            theme={theme}
            displayMode="pair"
            showSideLabels={false}
            className="flex-col md:flex-row items-center justify-center gap-8 md:gap-12"
          />
        </CardPreviewScaler>
      </div>

      <ShareProfileEditor cardId={card.id} cardData={card.cardData} />

      <section className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Print &amp; download
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Export at full resolution for home or professional printing. PDFs
              are sized to standard business cards (3.5&quot; × 2&quot;) with
              one side per page.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sides
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
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Corner
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={exportRoundedCorners}
              onCheckedChange={(checked) =>
                setExportRoundedCorners(checked === true)
              }
            />
            Rounded
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            className="gap-2"
            disabled={downloading !== null || (!exportFront && !exportBack)}
            onClick={() => void handleDownload("pdf")}
          >
            {downloading === "pdf" ? (
              <HugeiconsIcon
                icon={Loading03Icon}
                size={16}
                className="animate-spin"
              />
            ) : (
              <HugeiconsIcon icon={PrinterIcon} size={16} />
            )}
            {downloading === "pdf"
              ? "Preparing PDF…"
              : "Download print-ready PDF"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-1.5"
                disabled={downloading !== null || (!exportFront && !exportBack)}
              >
                {downloading && downloading !== "pdf" ? (
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <HugeiconsIcon icon={Download01Icon} size={14} />
                )}
                {downloading && downloading !== "pdf"
                  ? `Downloading ${downloading.toUpperCase()}…`
                  : "More formats"}
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => void handleDownload("png")}>
                PNG — high-resolution image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void handleDownload("svg")}>
                SVG — editable vector file
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">At home:</span> print
            the PDF at <strong>100% scale</strong> (not &ldquo;fit to
            page&rdquo;) on cardstock.
          </li>
          <li>
            <span className="font-medium text-foreground">Double-sided:</span>{" "}
            print all pages, reload the stack, then print again — or use duplex
            / long-edge flip if your printer supports it.
          </li>
          <li>
            <span className="font-medium text-foreground">Corners:</span> leave{" "}
            <strong>rounded corners</strong> unchecked for square edges (best
            for printing); check it to match the on-screen preview.
          </li>
          <li>
            <span className="font-medium text-foreground">Print shop:</span>{" "}
            send the PDF or PNG; files are exported at 6× resolution (~300 DPI).
          </li>
        </ul>
      </section>

      <CardExportSurface
        ref={cardExportRef}
        data={card.cardData}
        theme={theme}
        roundedCorners={exportRoundedCorners}
      />

      <Tabs defaultValue="link" className="mt-8">
        <TabsList>
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
          <TabsTrigger value="iframe">iFrame</TabsTrigger>
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
                    <a href={publicCardUrl} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Copied links include tracking so shared visits appear as{" "}
              <strong>Shared link</strong> in Analytics.
            </p>
            {!card.published ? (
              <p className="mt-2 text-sm text-muted-foreground">
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

        <TabsContent value="qr" className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold">QR code</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Each card has a permanent QR link. Publish first, then download or
              scan — the encoded URL stays the same.
            </p>
            {card.qrCodeId ? (
              <div className="mt-6">
                <ShareQrCode
                  qrCodeId={card.qrCodeId}
                  downloadName={downloadName}
                  published={card.published}
                  publishPending={setPublished.isPending}
                  onPublish={() => {
                    if (!card.published && !setPublished.isPending) {
                      setPublished.mutate({ id: card.id, published: true });
                    }
                  }}
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                Loading QR code…
              </p>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Scans are tracked as <strong>QR scan</strong> in Analytics.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="iframe" className="mt-6 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <Label htmlFor="embed-code">Embed on your website</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste this code into your site. The card stays live — edits you
              make here appear automatically (refreshes every 15 seconds).
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(EMBED_CODE_FORMAT_LABELS) as EmbedCodeFormat[]).map(
                (format) => (
                  <Button
                    key={format}
                    type="button"
                    size="sm"
                    variant={embedFormat === format ? "default" : "outline"}
                    onClick={() => setEmbedFormat(format)}
                  >
                    {EMBED_CODE_FORMAT_LABELS[format]}
                  </Button>
                ),
              )}
            </div>
            <textarea
              id="embed-code"
              readOnly
              rows={8}
              value={embedCode || "Publish your card to generate embed code."}
              className="mt-4 w-full resize-none rounded-lg border border-input bg-muted/30 px-3 py-2 font-mono text-xs leading-relaxed"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={copyIframe} disabled={!embedCode}>
                {copiedIframe ? (
                  <HugeiconsIcon icon={CheckIcon} size={16} />
                ) : (
                  <HugeiconsIcon icon={Copy01Icon} size={16} />
                )}
                {copiedIframe ? "Copied" : "Copy embed code"}
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {embedFormat === "html" ? (
                <>
                  Plain HTML uses a <code className="text-[11px]">style</code>{" "}
                  string on the iframe.
                </>
              ) : embedFormat === "react" ? (
                <>
                  In React / Next.js, use{" "}
                  <code className="text-[11px]">
                    style=&#123;&#123; ... &#125;&#125;
                  </code>{" "}
                  (an object, not a string).
                </>
              ) : (
                <>
                  Vue templates can use a string style attribute on the iframe.
                </>
              )}{" "}
              {billing?.isPro
                ? "Pro plan: no Kardably branding in the embed."
                : 'Free plan: a small "Powered by Kardably" badge appears below the card.'}{" "}
              Embed views appear as <strong>Website embed</strong> in Analytics.
            </p>
            {!card.published ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Turn on publishing above to enable embedding.
              </p>
            ) : null}
          </div>

          {embedCode ? (
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
              <p className="mb-4 text-sm font-medium">Preview</p>
              <div className="overflow-hidden rounded-lg border border-border bg-muted/20 p-2 sm:p-4">
                <iframe
                  src={card.slug ? `/embed/${card.slug}` : undefined}
                  title={`${cardTitle} embed preview`}
                  className="mx-auto w-full max-w-[960px] rounded-lg border-0 bg-background"
                  height={560}
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
