"use client";

import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { BusinessCard } from "@/features/builder/components/business-card";
import type { LinkClickPayload } from "@/features/builder/components/card-layouts";
import { usePublicCardViewTracking } from "@/features/share/hooks/use-public-card-view-tracking";
import { getVisitorId } from "@/lib/analytics-client";
import { getTheme } from "@/lib/card-themes";
import { useTRPC } from "@/trpc/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

export function PublicCardView({ slug }: { slug: string }) {
  const trpc = useTRPC();

  const {
    data: card,
    isLoading,
    isError,
  } = useQuery(trpc.card.getPublicBySlug.queryOptions({ slug }));

  usePublicCardViewTracking(card?.slug ?? undefined);

  const recordLinkClick = useMutation(
    trpc.card.recordLinkClick.mutationOptions(),
  );

  const handleLinkClick = useCallback(
    (payload: LinkClickPayload) => {
      if (!card?.slug) return;

      recordLinkClick.mutate({
        slug: card.slug,
        visitorId: getVisitorId(),
        linkLabel: payload.label,
        linkUrl: payload.href,
      });
    },
    [card?.slug, recordLinkClick],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <HugeiconsIcon
          icon={Loading03Icon}
          className="animate-spin"
          size={16}
        />
        <p className="text-sm text-muted-foreground">Loading card</p>
      </div>
    );
  }

  if (isError || !card) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background px-4">
        <p className="text-sm font-medium">Card not found</p>
        <p className="text-sm text-muted-foreground">
          This card may be unpublished or the link is incorrect.
        </p>
      </div>
    );
  }

  const theme = getTheme(card.themeId);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Digital business card
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">
          {card.cardData.name}
        </h1>
        {card.cardData.title ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {card.cardData.title}
          </p>
        ) : null}
      </div>
      <BusinessCard
        data={card.cardData}
        theme={theme}
        displayMode={card.displayMode}
        interactive
        onLinkClick={handleLinkClick}
      />
    </div>
  );
}
