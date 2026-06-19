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
  Chart03Icon,
  Clock01Icon,
  CreditCardNotFoundIcon,
  Delete02Icon,
  Edit02Icon,
  Loading03Icon,
  MoreVerticalIcon,
  PlusSignIcon,
  Share08Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { inferRouterOutputs } from "@trpc/server";
import { DashboardCardSearch } from "./dashboard-card-search";

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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <DashboardCardSearch className="flex md:hidden" />
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
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total cards" value={String(cards.length)} />
        <Stat label="Published" value={String(publishedCount)} />
        <Stat label="Total views" value={totalViews.toLocaleString()} />
      </div>

      <div className="mt-8">
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card) => (
                <CardTile key={card.id} card={card} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
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
      <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-black/5">
        <Link href={builderHref} className="block">
          <div
            className={cn(
              "relative flex h-44 items-center justify-center overflow-hidden",
              styles.frontSurface,
            )}
          >
            <BusinessCard
              data={card.cardData}
              theme={theme}
              displayMode="front"
              className="pointer-events-none shadow-none ring-0"
            />

            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/30 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <p className="text-sm font-semibold text-white">{title}</p>
              <div className="mt-1.5 space-y-1 space-x-2 text-xs text-white/80">
                <span>{card.cardData.title || theme.name}</span>
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Clock01Icon} size={12} />
                  Updated{" "}
                  {formatDistanceToNow(card.updatedAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-between gap-2 p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <HugeiconsIcon icon={ViewIcon} size={14} />
              {card.viewCount.toLocaleString()} views
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={card.published ? "default" : "secondary"}>
              {card.published ? "published" : "draft"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
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
      </div>

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
