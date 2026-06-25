"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft01Icon,
  Delete02Icon,
  Edit02Icon,
  Loading03Icon,
  Share01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { BusinessCard } from "@/features/builder/components/business-card";
import { CardPreviewScaler } from "@/features/builder/components/card-preview-scaler";
import {
  EditCardDrawer,
  EditCardPanel,
} from "@/features/builder/components/edit-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildThemePreviewData,
  cloneCardData,
  getCardBuilderLabel,
  type BuilderCard,
  type CardData,
  type CardDisplayMode,
} from "@/lib/card-data";
import { cardThemes, getDefaultThemeId, getTheme } from "@/lib/card-themes";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import Logo from "../../../../public/Logo/Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { DeleteCardDialog } from "@/features/dashboard/components/delete-card-dialog";

const SAVE_DEBOUNCE_MS = 500;

export default function BuilderView() {
  const router = useRouter();
  const params = useParams<{ resumeId: string }>();
  const searchParams = useSearchParams();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const resumeId = params.resumeId;
  const cardIds = searchParams.get("cards")?.split(",").filter(Boolean) ?? [];
  const activeCardId = searchParams.get("active");

  const {
    data: resume,
    isLoading: resumeLoading,
    isError: resumeError,
  } = useQuery(trpc.resume.getById.queryOptions({ id: resumeId }));

  const {
    data: dbCards,
    isLoading: cardsLoading,
    isError: cardsError,
  } = useQuery({
    ...trpc.card.listByIds.queryOptions({ ids: cardIds }),
    enabled: cardIds.length > 0,
  });

  const [cards, setCards] = useState<BuilderCard[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileEditOpen, setMobileEditOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<BuilderCard | null>(null);
  const saveTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const updateCardMutation = useMutation(trpc.card.update.mutationOptions());
  const publishMutation = useMutation(
    trpc.card.publish.mutationOptions({
      onSuccess: (card, variables) => {
        toast.success(
          variables.publishSet ? "All cards published!" : "Card published!",
        );
        void queryClient.invalidateQueries(trpc.card.list.queryFilter());
        router.push(`/share/${card.id}`);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to publish card.");
      },
    }),
  );
  const removeCardMutation = useMutation(
    trpc.card.moveToTrash.mutationOptions(),
  );

  useEffect(() => {
    if (!dbCards || initialized) return;

    setCards(
      dbCards.map((card) => ({
        id: card.id,
        themeId: card.themeId,
        data: cloneCardData(card.cardData),
        displayMode: card.displayMode,
      })),
    );

    let index = 0;
    if (activeCardId) {
      const found = dbCards.findIndex((card) => card.id === activeCardId);
      if (found >= 0) index = found;
    }
    setActiveIndex(index);
    setInitialized(true);
  }, [dbCards, initialized, activeCardId]);

  useEffect(() => {
    return () => {
      for (const timer of saveTimersRef.current.values()) {
        clearTimeout(timer);
      }
    };
  }, []);

  const activeCard = cards[activeIndex];
  const activeTheme = activeCard
    ? getTheme(activeCard.themeId)
    : getTheme(getDefaultThemeId());
  const isMulti = cards.length > 1;
  const displayMode = activeCard?.displayMode ?? "pair";

  function scheduleSave(card: BuilderCard) {
    const existing = saveTimersRef.current.get(card.id);
    if (existing) clearTimeout(existing);

    saveTimersRef.current.set(
      card.id,
      setTimeout(() => {
        updateCardMutation.mutate({
          id: card.id,
          themeId: card.themeId,
          cardData: card.data,
          displayMode: card.displayMode,
        });
      }, SAVE_DEBOUNCE_MS),
    );
  }

  function updateActiveCard(data: CardData) {
    setCards((prev) => {
      const next = prev.map((card, index) =>
        index === activeIndex ? { ...card, data } : card,
      );
      const updated = next[activeIndex];
      if (updated) scheduleSave(updated);
      return next;
    });
  }

  function setDisplayMode(mode: CardDisplayMode) {
    setCards((prev) => {
      const next = prev.map((card, index) =>
        index === activeIndex ? { ...card, displayMode: mode } : card,
      );
      const updated = next[activeIndex];
      if (updated) scheduleSave(updated);
      return next;
    });
  }

  function handlePublish() {
    if (!activeCard) return;
    publishMutation.mutate({
      id: activeCard.id,
      publishSet: cards.length > 1,
    });
  }

  function selectCard(index: number) {
    setActiveIndex(index);
    const card = cards[index];
    if (!card) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("active", card.id);
    router.replace(`/builder/${resumeId}?${params.toString()}`, {
      scroll: false,
    });
  }

  function confirmRemoveCard() {
    if (!removeTarget) return;

    const removedId = removeTarget.id;
    const removeIndex = cards.findIndex((card) => card.id === removedId);
    const nextCards = cards.filter((card) => card.id !== removedId);

    removeCardMutation.mutate(
      { id: removedId },
      {
        onSuccess: () => {
          const pendingSave = saveTimersRef.current.get(removedId);
          if (pendingSave) {
            clearTimeout(pendingSave);
            saveTimersRef.current.delete(removedId);
          }

          setCards(nextCards);

          let nextIndex = activeIndex;
          if (removeIndex >= 0) {
            if (removeIndex < activeIndex) {
              nextIndex = activeIndex - 1;
            } else if (removeIndex === activeIndex) {
              nextIndex = Math.min(activeIndex, nextCards.length - 1);
            }
          }
          nextIndex = Math.max(0, nextIndex);
          setActiveIndex(nextIndex);

          const params = new URLSearchParams(searchParams.toString());
          params.set("cards", nextCards.map((card) => card.id).join(","));
          const nextActive = nextCards[nextIndex];
          if (nextActive) {
            params.set("active", nextActive.id);
          } else {
            params.delete("active");
          }
          router.replace(`/builder/${resumeId}?${params.toString()}`, {
            scroll: false,
          });

          toast.success("Card removed.");
          setRemoveTarget(null);
          void queryClient.invalidateQueries(trpc.card.list.queryFilter());
          void queryClient.invalidateQueries(trpc.card.listTrash.queryFilter());
        },
        onError: (error) => {
          toast.error(error.message || "Failed to remove card.");
        },
      },
    );
  }

  const isLoading = resumeLoading || cardsLoading || (dbCards && !initialized);
  const isError =
    resumeError || cardsError || cardIds.length === 0 || !resume || !activeCard;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
          Loading your card
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-sm text-muted-foreground">
          {cardIds.length === 0
            ? "No saved cards found for this session."
            : "Card not found or you don't have access."}
        </p>
        <Button asChild>
          <Link href="/create">Create a new card</Link>
        </Button>
      </div>
    );
  }

  const fallbackPreview = buildThemePreviewData(resume.extractedData);

  function withPreviewFallback(data: CardData): CardData {
    return {
      ...fallbackPreview,
      ...data,
      name: data.name || fallbackPreview.name,
      title: data.title || fallbackPreview.title,
      company: data.company || fallbackPreview.company,
      email: data.email || fallbackPreview.email,
      phone: data.phone || fallbackPreview.phone,
      location: data.location || fallbackPreview.location,
      website: data.website || fallbackPreview.website,
      tagline: data.tagline || fallbackPreview.tagline,
      logoUrl: data.logoUrl || fallbackPreview.logoUrl,
      bio: "",
      skills: [],
      links: [],
      fieldSettings: data.fieldSettings,
    };
  }

  const displayData = withPreviewFallback(activeCard.data);

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-background">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 overflow-x-hidden border-b border-border bg-background/95 px-3 backdrop-blur-md sm:gap-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="Back to dashboard"
          >
            <Link href="/dashboard">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            </Link>
          </Button>
          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <Logo href="/dashboard" />
            <span className="text-muted-foreground">/</span>
            <EditableCardName
              key={activeCard.id}
              name={getCardBuilderLabel(activeCard.data)}
              onSave={(label) =>
                updateActiveCard({ ...activeCard.data, builderLabel: label })
              }
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {updateCardMutation.isPending ? (
            <span className="hidden text-xs text-muted-foreground sm:flex items-center gap-1">
              <HugeiconsIcon
                icon={Loading03Icon}
                className="animate-spin"
                size={18}
              />
              Saving
            </span>
          ) : null}
          <EditCardDrawer
            data={activeCard.data}
            setData={updateActiveCard}
            themeId={activeCard.themeId}
            open={mobileEditOpen}
            setOpen={setMobileEditOpen}
            trigger={
              <Button variant="outline" size="icon-sm" className="lg:hidden">
                <HugeiconsIcon icon={Edit02Icon} size={16} />
                <span className="sr-only">Edit details</span>
              </Button>
            }
          />
          <Button
            className="gap-1.5 px-2.5 sm:gap-2 sm:px-4"
            size="sm"
            disabled={publishMutation.isPending}
            onClick={handlePublish}
          >
            <HugeiconsIcon icon={Share01Icon} size={16} />
            <span className="hidden sm:inline">
              {publishMutation.isPending
                ? "Publishing…"
                : isMulti
                  ? "Publish all & share"
                  : "Publish & share"}
            </span>
            <span className="sm:hidden">
              {publishMutation.isPending ? "…" : "Publish"}
            </span>
          </Button>
          <ModeToggle />
          <UserButton />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1600px] min-w-0 flex-1 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div
          className={cn(
            "grid min-w-0 gap-4 sm:gap-6 lg:gap-10",
            isMulti
              ? "lg:grid-cols-[minmax(0,172px)_minmax(0,1fr)_minmax(360px,420px)] xl:grid-cols-[minmax(0,180px)_minmax(0,1fr)_minmax(380px,440px)]"
              : "lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:grid-cols-[minmax(0,1fr)_minmax(380px,440px)]",
          )}
        >
          {isMulti ? (
            <aside className="order-2 lg:order-1 lg:min-w-0">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Your cards
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0 lg:max-h-[calc(100vh-9rem)]">
                {cards.map((card, index) => {
                  const theme = getTheme(card.themeId);
                  const selected = index === activeIndex;
                  const thumbData = withPreviewFallback(card.data);
                  const cardLabel = getCardBuilderLabel(card.data);

                  return (
                    <div
                      key={card.id}
                      className={cn(
                        "relative shrink-0 rounded-xl border-2 transition-all lg:w-full",
                        selected
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                          : "border-border bg-card hover:border-primary/30",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => selectCard(index)}
                        className="flex w-full flex-col gap-2 rounded-[10px] p-2.5 text-left"
                      >
                        <span
                          className={cn(
                            "absolute left-2 top-2 z-10 flex size-5 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums",
                            selected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </span>
                        <div className="overflow-hidden rounded-lg ">
                          <BusinessCard
                            data={{
                              ...thumbData,
                              bio: "",
                              skills: [],
                              links: [],
                            }}
                            theme={theme}
                            compact
                            displayMode="front"
                            className="pointer-events-none shadow-none ring-0"
                          />
                        </div>
                        {/* <span className="truncate px-0.5 text-center text-[11px] font-medium text-muted-foreground">
                          {cardLabel}
                        </span> */}
                      </button>
                      {cards.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${cardLabel}`}
                          className="absolute right-1.5 top-1.5 z-20 size-6 bg-destructive shadow-sm hover:bg-destructive"
                          onClick={() => setRemoveTarget(card)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={10} />
                        </Button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </aside>
          ) : null}

          <section
            className={cn(
              "order-1 flex min-w-0 max-w-full flex-1 flex-col",
              isMulti && "lg:order-2",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon icon={ViewIcon} size={16} />
                Live preview
                {isMulti ? (
                  <span className="text-xs">
                    · Card {activeIndex + 1} of {cards.length}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {isMulti && cards.length > 1 ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => setRemoveTarget(activeCard)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} />
                    Remove card
                  </Button>
                ) : null}
                {(
                  [
                    ["pair", "Both"],
                    ["front", "Front"],
                    ["back", "Back"],
                  ] as const
                ).map(([mode, label]) => (
                  <Button
                    key={mode}
                    type="button"
                    size="sm"
                    variant={displayMode === mode ? "default" : "outline"}
                    className="min-w-14 text-xs"
                    onClick={() => setDisplayMode(mode)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <CardPreviewScaler
              key={displayMode}
              variant={displayMode === "pair" ? "default" : "single"}
              minHeightClass="min-h-[min(340px,42vh)] lg:min-h-[calc(100vh-11rem)]"
              className="mt-4 min-w-0 max-w-full flex-1 rounded-xl border border-border bg-muted/30 sm:mt-5 sm:rounded-2xl"
            >
              <BusinessCard
                data={displayData}
                theme={activeTheme}
                displayMode={displayMode}
                showSideLabels={false}
                className={
                  displayMode === "pair"
                    ? "flex-col items-center justify-center gap-8 md:gap-12"
                    : undefined
                }
              />
            </CardPreviewScaler>
          </section>

          <aside className="order-3 hidden min-w-0 lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-sm xl:p-6">
              <div className="mb-5">
                <h2 className="text-sm font-semibold">Edit details</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Changes save automatically as you edit.
                </p>
              </div>
              <EditCardPanel
                data={activeCard.data}
                setData={updateActiveCard}
                themeId={activeCard.themeId}
              />
            </div>
          </aside>
        </div>
      </div>

      <DeleteCardDialog
        open={removeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        title="Remove this card?"
        description={
          removeTarget
            ? `The card will be moved to trash. You can recover it within 30 days.`
            : ""
        }
        confirmLabel="Remove"
        loading={removeCardMutation.isPending}
        onConfirm={confirmRemoveCard}
      />
      {/* "${getCardBuilderLabel(removeTarget.data) || getTheme(removeTarget.themeId).name}" */}
    </div>
  );
}

function EditableCardName({
  name,
  onSave,
}: {
  name: string;
  onSave: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(name);
  }, [name, editing]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function commit() {
    const next = draft.trim();
    if (next !== name.trim()) {
      onSave(next);
    }
    setEditing(false);
  }

  function cancel() {
    setDraft(name);
    setEditing(false);
  }

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            cancel();
          }
        }}
        className="h-7 max-w-[200px] min-w-[120px] px-2 text-sm font-medium cursor-text"
        aria-label="Card name"
      />
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="max-w-[200px] truncate text-left text-sm font-medium hover:text-primary cursor-text"
      title="Double-click to rename"
      onDoubleClick={() => setEditing(true)}
    >
      {name.trim() || "Design"}
    </Button>
  );
}
