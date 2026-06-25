"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteCardDialog } from "@/features/dashboard/components/delete-card-dialog";
import { BusinessCard } from "@/features/builder/components/business-card";
import { CardPreviewScaler } from "@/features/builder/components/card-preview-scaler";
import { getCardBuilderLabel } from "@/lib/card-data";
import { getThemeStyleClasses } from "@/lib/card-theme-utils";
import {
  TRASH_RETENTION_DAYS,
  getTrashDaysRemaining,
  toDate,
} from "@/lib/card-trash";
import { getTheme } from "@/lib/card-themes";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import {
  ArrowLeft01Icon,
  ArrowMoveUpLeftIcon,
  DashboardSquare01Icon,
  Delete01Icon,
  Delete02Icon,
  Delete04Icon,
  Home02Icon,
  Loading03Icon,
  RestoreBinIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { inferRouterOutputs } from "@trpc/server";
import { FadeIn } from "@/components/motion";

type TrashedCard = inferRouterOutputs<AppRouter>["card"]["listTrash"][number];

export function TrashContent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [emptyTrashOpen, setEmptyTrashOpen] = useState(false);
  const { data: cards = [], isLoading } = useQuery(
    trpc.card.listTrash.queryOptions(),
  );

  const emptyTrash = useMutation(
    trpc.card.emptyTrash.mutationOptions({
      onSuccess: (result) => {
        toast.success(
          result.count === 0
            ? "Trash is already empty."
            : `${result.count} card${result.count === 1 ? "" : "s"} permanently deleted.`,
        );
        setEmptyTrashOpen(false);
        void queryClient.invalidateQueries(trpc.card.listTrash.queryFilter());
      },
      onError: (error) => {
        toast.error(error.message || "Failed to empty trash.");
      },
    }),
  );

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

      <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trash</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Deleted cards are kept for {TRASH_RETENTION_DAYS} days, then removed
            permanently.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {cards.length > 0 ? (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={emptyTrash.isPending}
              onClick={() => setEmptyTrashOpen(true)}
            >
              <HugeiconsIcon icon={Delete01Icon} />
              Empty trash
            </Button>
          ) : null}
        </div>
      </FadeIn>

      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight"></h1>
          <p className="mt-1 text-sm text-muted-foreground"></p>
        </div>

        <Button>Empty</Button>
      </div> */}

      <div className="mt-8">
        {isLoading ? (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <HugeiconsIcon
              icon={Loading03Icon}
              size={18}
              className="animate-spin"
            />
            Loading trash
          </p>
        ) : cards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 flex flex-col items-center gap-4">
            <HugeiconsIcon icon={Delete04Icon} />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-center">Trash is empty</p>
              <p className="mt-1 text-sm text-muted-foreground ">
                Cards you delete will appear here until they expire.
              </p>
            </div>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/dashboard">
                <HugeiconsIcon icon={Home02Icon} />
                Go to dashboard
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {cards.map((card) => (
              <TrashCardTile key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>

      <DeleteCardDialog
        open={emptyTrashOpen}
        onOpenChange={setEmptyTrashOpen}
        title="Empty trash?"
        description={`All ${cards.length} card${cards.length === 1 ? "" : "s"} in trash will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Empty trash"
        loading={emptyTrash.isPending}
        onConfirm={() => emptyTrash.mutate()}
      />
    </div>
  );
}

function TrashCardTile({ card }: { card: TrashedCard }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const theme = getTheme(card.themeId);
  const styles = getThemeStyleClasses(theme.id);
  const title = getCardBuilderLabel(card.cardData);
  const deletedAt = toDate(card.deletedAt) ?? new Date();
  const daysRemaining = getTrashDaysRemaining(deletedAt);

  const restore = useMutation(
    trpc.card.restore.mutationOptions({
      onSuccess: () => {
        toast.success("Card restored.");
        void queryClient.invalidateQueries(trpc.card.list.queryFilter());
        void queryClient.invalidateQueries(trpc.card.listTrash.queryFilter());
      },
      onError: (error) => {
        toast.error(error.message || "Failed to restore card.");
      },
    }),
  );

  const permanentDelete = useMutation(
    trpc.card.permanentDelete.mutationOptions({
      onSuccess: () => {
        toast.success("Card permanently deleted.");
        setDeleteOpen(false);
        void queryClient.invalidateQueries(trpc.card.listTrash.queryFilter());
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete card.");
      },
    }),
  );

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div
          className={cn(
            "relative overflow-hidden opacity-70",
            styles.frontSurface,
          )}
        >
          <CardPreviewScaler
            className="border-0 bg-transparent p-2"
            minHeightClass="h-44"
          >
            <BusinessCard
              data={card.cardData}
              theme={theme}
              displayMode="front"
              compact
              className="pointer-events-none shadow-none ring-0"
            />
          </CardPreviewScaler>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <p className="truncate text-sm font-medium">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Deleted {formatDistanceToNow(deletedAt, { addSuffix: true })}
            </p>
          </div>

          <Badge variant="secondary">
            {daysRemaining === 0
              ? "Expires soon"
              : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`}
          </Badge>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-1.5"
              disabled={restore.isPending}
              onClick={() => restore.mutate({ id: card.id })}
            >
              <HugeiconsIcon icon={ArrowMoveUpLeftIcon} size={14} />
              Recover
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-1.5"
              onClick={() => setDeleteOpen(true)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
              Delete forever
            </Button>
          </div>
        </div>
      </div>

      <DeleteCardDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete permanently?"
        description={`"${title}" will be deleted forever. This action cannot be undone.`}
        confirmLabel="Delete forever"
        loading={permanentDelete.isPending}
        onConfirm={() => permanentDelete.mutate({ id: card.id })}
      />
    </>
  );
}
