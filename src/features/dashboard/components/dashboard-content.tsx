"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteCardDialog } from "@/features/dashboard/components/delete-card-dialog";
import { ThemePickerCardPreview } from "@/features/builder/components/theme-picker";
import { getCardBuilderLabel, type CardDisplayMode } from "@/lib/card-data";
import { filterCardsByQuery } from "@/lib/card-search";
import { getTheme } from "@/lib/card-themes";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useDashboardSearch } from "@/features/dashboard/context/dashboard-search-context";
import type { AppRouter } from "@/trpc/routers/_app";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BubblesIcon,
  Cancel01Icon,
  Chart03Icon,
  ClipboardIcon,
  CreditCardNotFoundIcon,
  Delete02Icon,
  Edit02Icon,
  Home02Icon,
  Loading03Icon,
  MoreVerticalIcon,
  PlusSignIcon,
  RocketIcon,
  Share08Icon,
  StarIcon,
  UserCircleIcon,
  UserGroupIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { inferRouterOutputs } from "@trpc/server";
import { DashboardCardSearch } from "./dashboard-card-search";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { motion } from "motion/react";

type DashboardCard = inferRouterOutputs<AppRouter>["card"]["list"][number];

const DashboardContent = () => {
  const trpc = useTRPC();
  const { debouncedQuery, query, isDebouncing } = useDashboardSearch();
  const { data: cards = [], isLoading } = useQuery(
    trpc.card.list.queryOptions(),
  );

  const filteredCards = filterCardsByQuery(cards, debouncedQuery);
  const isFiltering = debouncedQuery.trim().length > 0;

  const {
    visibleItems: visibleCards,
    hasMore,
    isLoadingMore,
    sentinelRef,
  } = useInfiniteScroll(filteredCards, { resetKey: debouncedQuery });

  const publishedCount = cards.filter((card) => card.published).length;
  const totalViews = cards.reduce((sum, card) => sum + card.viewCount, 0);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const selectedCount = selectedIds.size;

  const moveManyToTrash = useMutation(
    trpc.card.moveManyToTrash.mutationOptions({
      onSuccess: (result) => {
        toast.success(
          `${result.count} card${result.count === 1 ? "" : "s"} moved to trash.`,
        );
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
        void queryClient.invalidateQueries(trpc.card.list.queryFilter());
        void queryClient.invalidateQueries(trpc.card.listTrash.queryFilter());
      },
      onError: (error) => {
        toast.error(error.message || "Failed to move cards to trash.");
      },
    }),
  );

  useEffect(() => {
    setSelectedIds((previous) => {
      const validIds = new Set(cards.map((card) => card.id));
      const next = new Set([...previous].filter((id) => validIds.has(id)));
      return next.size === previous.size ? previous : next;
    });
  }, [cards]);

  function toggleCardSelection(cardId: string, checked: boolean) {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(cardId);
      } else {
        next.delete(cardId);
      }
      return next;
    });
  }

  return (
    <div className="mx-auto min-w-0  overflow-x-hidden px-4 py-8 sm:px-6">
      <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage, edit, and share your business cards
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedCount > 0 ? (
            <>
              <Button
                variant="link"
                onClick={() => setSelectedIds(new Set())}
                className="text-red-500"
              >
                Clear
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => setBulkDeleteOpen(true)}
              >
                <HugeiconsIcon icon={Delete02Icon} />
                Move {selectedCount} card{selectedCount === 1 ? "" : "s"} to
                trash
              </Button>
            </>
          ) : null}
          <Button asChild>
            <Link href="/create" className="flex items-center gap-2">
              <HugeiconsIcon icon={PlusSignIcon} />
              Create new card
            </Link>
          </Button>
        </div>
      </FadeIn>

      <Stagger className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3">
        <StaggerItem>
          <Stat
            label="Total cards"
            value={String(cards.length)}
            variant="cards"
          />
        </StaggerItem>
        <StaggerItem>
          <Stat
            label="Published"
            value={String(publishedCount)}
            variant="published"
          />
        </StaggerItem>
        <StaggerItem>
          <Stat
            label="Total views"
            value={totalViews.toLocaleString("en-US")}
            variant="views"
          />
        </StaggerItem>
      </Stagger>

      <div className="py-4">
        <DashboardCardSearch className="flex md:hidden" />
      </div>

      <div className="">
        {isLoading ? (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
            Loading cards
          </p>
        ) : cards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 flex flex-col gap-4 items-center">
            <HugeiconsIcon icon={CreditCardNotFoundIcon} size="40" />
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium">No cards yet</p>
              <p className="mt-1 text-sm text-muted-foreground text-center">
                Upload a resume and pick a theme to create your first card.
              </p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/create">Create your first card</Link>
            </Button>
          </div>
        ) : isDebouncing && query.trim() ? (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
            Searching cards
          </p>
        ) : isFiltering && filteredCards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm font-medium">No matching cards</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Nothing matches &ldquo;{debouncedQuery}&rdquo;. Try a different
              name or theme.
            </p>
          </div>
        ) : (
          <>
            {isFiltering ? (
              <p className="mb-4 text-sm text-muted-foreground">
                {filteredCards.length} result{" "}
                {filteredCards.length === 1 ? "" : "s"} for &ldquo;
                {debouncedQuery}&rdquo;
              </p>
            ) : null}
            <div className="grid  gap-3 grid-cols-1 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {visibleCards.map((card) => (
                <CardTile
                  key={card.id}
                  card={card}
                  selected={selectedIds.has(card.id)}
                  onSelectedChange={(checked) =>
                    toggleCardSelection(card.id, checked)
                  }
                />
              ))}
            </div>
            {hasMore ? (
              <div
                ref={sentinelRef}
                className="mt-6 flex min-h-12 items-center justify-center py-4"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="animate-spin text-muted-foreground"
                    />
                    <p className="text-sm text-muted-foreground">
                      Loading more cards
                    </p>
                  </div>
                ) : null}
              </div>
            ) : filteredCards.length > 10 ? (
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Showing all {filteredCards.length} cards
              </p>
            ) : null}
          </>
        )}
      </div>

      <DeleteCardDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Move selected cards to trash?"
        description={`${selectedCount} card${selectedCount === 1 ? "" : "s"} will be moved to trash. You can recover them within 30 days before they're permanently deleted.`}
        confirmLabel={`Move ${selectedCount} to trash`}
        loading={moveManyToTrash.isPending}
        onConfirm={() => moveManyToTrash.mutate({ ids: [...selectedIds] })}
      />
    </div>
  );
};

export default DashboardContent;

type StatVariant = "cards" | "published" | "views";

function Stat({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: StatVariant;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      <div className="relative z-10">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      </div>
      <StatDecoration variant={variant} />
    </div>
  );
}

function StatDecoration({ variant }: { variant: StatVariant }) {
  switch (variant) {
    case "cards":
      return (
        <HugeiconsIcon
          icon={ClipboardIcon}
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-6 size-23 -rotate-12 text-indigo-500/14 sm:size-24"
        />
      );
    case "published":
      return (
        <>
          <HugeiconsIcon
            icon={StarIcon}
            aria-hidden
            className="pointer-events-none absolute -bottom-6 -right-6 size-23 text-emerald-500/14 sm:size-24"
          />
        </>
      );
    case "views":
      return (
        <HugeiconsIcon
          icon={UserGroupIcon}
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-6 size-23 text-amber-500/14 sm:size-24"
        />
      );
  }
}

function CardTile({
  card,
  selected,
  onSelectedChange,
}: {
  card: DashboardCard;
  selected: boolean;
  onSelectedChange: (checked: boolean) => void;
}) {
  // const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [side, setSide] = useState<CardDisplayMode>("front");

  const theme = getTheme(card.themeId);
  const builderHref = `/builder/${card.resumeId}?cards=${card.id}`;
  const shareHref = `/share/${card.id}`;
  const title = getCardBuilderLabel(card.cardData);

  function showSide(next: CardDisplayMode, event: MouseEvent) {
    event.stopPropagation();
    setSide(next);
  }

  const moveToTrash = useMutation(
    trpc.card.moveToTrash.mutationOptions({
      onSuccess: () => {
        toast.success("Card moved to trash.");
        setDeleteOpen(false);
        void queryClient.invalidateQueries(trpc.card.list.queryFilter());
        void queryClient.invalidateQueries(trpc.card.listTrash.queryFilter());
        // router.push("/trash");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete card.");
      },
    }),
  );

  return (
    <>
      <motion.div
        className="group relative min-w-0 w-full overflow-hidden rounded-xl border border-border bg-card transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-md hover:shadow-primary/10"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative bg-muted/15 pb-11 pt-1 sm:pt-0">
          <Link href={shareHref}>
            <ThemePickerCardPreview
              theme={theme}
              previewData={card.cardData}
              side={side}
            />
          </Link>

          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
            <button
              type="button"
              aria-label={`Show front of ${title}`}
              aria-pressed={side === "front"}
              onClick={(event) => showSide("front", event)}
              className={cn(
                "grid size-7 place-items-center rounded-full border bg-background/95 shadow-sm backdrop-blur-sm transition-colors",
                side === "front"
                  ? "border-primary/40 text-primary"
                  : "border-border/80 text-muted-foreground hover:text-foreground",
              )}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            </button>
            <button
              type="button"
              aria-label={`Show back of ${title}`}
              aria-pressed={side === "back"}
              onClick={(event) => showSide("back", event)}
              className={cn(
                "grid size-7 place-items-center rounded-full border bg-background/95 shadow-sm backdrop-blur-sm transition-colors",
                side === "back"
                  ? "border-primary/40 text-primary"
                  : "border-border/80 text-muted-foreground hover:text-foreground",
              )}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </button>
          </div>

          {/* <div className="absolute top-2 right-2 z-10">
            <Checkbox
              checked={selected}
              onCheckedChange={(value) => onSelectedChange(value === true)}
              aria-label={`Select ${title}`}
              className="border-primary bg-background/90 backdrop-blur-sm"
            />
          </div> */}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="min-w-0">
            <span className="flex items-center gap-2">
              {/* <Link
              href={shareHref}
              className="block truncate text-sm font-semibold hover:text-primary"
              > */}
              <Checkbox
                checked={selected}
                onCheckedChange={(value) => onSelectedChange(value === true)}
                aria-label={`Select ${title}`}
                className="border-border"
              />
              {title}
              {/* </Link> */}
            </span>

            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <HugeiconsIcon icon={ViewIcon} size={13} className="shrink-0" />
              {card.viewCount.toLocaleString("en-US")} views
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <Badge
              className={cn(
                "px-1.5 text-[10px] sm:text-xs",
                card.published
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
              )}
            >
              {card.published ? "Published" : "Draft"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 shrink-0">
                  <HugeiconsIcon icon={MoreVerticalIcon} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={builderHref}>
                    <HugeiconsIcon icon={Edit02Icon} />
                    Edit
                  </Link>
                </DropdownMenuItem>
                {card.published ? (
                  <DropdownMenuItem asChild>
                    <Link href={`/share/${card.id}`}>
                      <HugeiconsIcon icon={Share08Icon} />
                      Share
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem asChild>
                  <Link href={`/analytics/${card.id}`}>
                    <HugeiconsIcon icon={Chart03Icon} />
                    Analytics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setDeleteOpen(true)}
                  variant="destructive"
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      <DeleteCardDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Are you sure?"
        description={`"${title}" will be moved to trash. You can recover it within 30 days before it's permanently deleted.`}
        confirmLabel="Delete"
        loading={moveToTrash.isPending}
        onConfirm={() => moveToTrash.mutate({ id: card.id })}
      />
    </>
  );
}
