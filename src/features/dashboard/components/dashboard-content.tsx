"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteCardDialog } from "@/features/dashboard/components/delete-card-dialog";
import { BusinessCard } from "@/features/builder/components/business-card";
import { filterCardsByQuery } from "@/lib/card-search";
import { getThemeStyleClasses } from "@/lib/card-theme-utils";
import { getTheme } from "@/lib/card-themes";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useDashboardSearch } from "@/features/dashboard/context/dashboard-search-context";
import type { AppRouter } from "@/trpc/routers/_app";
import {
  BubblesIcon,
  Chart03Icon,
  ClipboardIcon,
  Clock01Icon,
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
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { inferRouterOutputs } from "@trpc/server";
import { DashboardCardSearch } from "./dashboard-card-search";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
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

  const publishedCount = cards.filter((card) => card.published).length;
  const totalViews = cards.reduce((sum, card) => sum + card.viewCount, 0);

  return (
    <div className="mx-auto min-w-0 max-w-6xl overflow-x-hidden px-4 py-8 sm:px-6">
      <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage, edit, and share your business cards.
          </p>
        </div>
        <Button asChild>
          <Link href="/create" className="flex items-center gap-2">
            <HugeiconsIcon icon={PlusSignIcon} />
            Create new card
          </Link>
        </Button>
      </FadeIn>

      <Stagger className="mt-6 grid gap-4 sm:grid-cols-3">
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
              <p className="mt-1 text-sm text-muted-foreground">
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
            <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {filteredCards.map((card) => (
                <StaggerItem key={card.id}>
                  <CardTile card={card} />
                </StaggerItem>
              ))}
            </Stagger>
          </>
        )}
      </div>
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
          className="pointer-events-none absolute -bottom-6 -right-6 size-23 -rotate-12 text-primary/14 sm:size-24"
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
          icon={UserCircleIcon}
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-6 size-23 text-amber-500/14 sm:size-24"
        />
      );
  }
}

function CardTile({ card }: { card: DashboardCard }) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const theme = getTheme(card.themeId);
  const styles = getThemeStyleClasses(theme.id);
  const builderHref = `/builder/${card.resumeId}?cards=${card.id}`;
  const title = card.cardData.name || theme.name;

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
        className="group relative min-w-0 w-full overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-black/5"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link href={builderHref} className="block">
          <div
            className={cn(
              "relative flex h-28 items-center justify-center overflow-hidden sm:h-36 md:h-44",
              styles.frontSurface,
            )}
          >
            <BusinessCard
              data={card.cardData}
              theme={theme}
              displayMode="front"
              compact
              className="pointer-events-none shadow-none ring-0"
            />

            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/30 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {/* <p className="text-sm font-semibold text-white">{title}</p> */}
              <div className="space-y-1 space-x-2 text-xs text-white/80">
                {/* <span>{card.cardData.title || theme.name}</span> */}
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Clock01Icon} size={12} />
                  Updated{" "}
                  {formatDistanceToNow(card.updatedAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex flex-col gap-2 p-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <HugeiconsIcon icon={ViewIcon} size={14} />
              {card.viewCount.toLocaleString("en-US")} views
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
            <Badge
              className={cn(
                "max-w-22 truncate px-1.5 text-[10px] sm:max-w-none sm:px-2 sm:text-xs",
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
