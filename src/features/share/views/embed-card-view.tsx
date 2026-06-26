"use client";

import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { BusinessCard } from "@/features/builder/components/business-card";
import { EmbedBranding } from "@/features/share/components/embed-branding";
import { usePublicCardViewTracking } from "@/features/share/hooks/use-public-card-view-tracking";
import type { LinkClickPayload } from "@/features/builder/components/card-layouts";
import { getVisitorId } from "@/lib/analytics-client";
import { getTheme } from "@/lib/card-themes";
import { useTRPC } from "@/trpc/client";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const EMBED_REFETCH_MS = 15_000;

export function EmbedCardView({ slug }: { slug: string }) {
  const trpc = useTRPC();

  const {
    data: card,
    isLoading,
    isError,
  } = useQuery({
    ...trpc.card.getPublicBySlug.queryOptions({ slug }),
    staleTime: 0,
    refetchInterval: EMBED_REFETCH_MS,
    refetchOnWindowFocus: true,
  });

  usePublicCardViewTracking(card?.slug ?? undefined, { utmSource: "iframe" });

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
      <div className="flex min-h-[480px] items-center justify-center p-6">
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
      </div>
    );
  }

  if (isError || !card) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-medium">Card unavailable</p>
        <p className="text-xs text-muted-foreground">
          This card may be unpublished or the embed link is incorrect.
        </p>
      </div>
    );
  }

  const theme = getTheme(card.themeId);

  return (
    <div className="flex min-h-[480px] w-full flex-col items-center justify-center gap-5 p-4 sm:p-6 bg-white">
      <BusinessCard
        data={card.cardData}
        theme={theme}
        displayMode={card.displayMode}
        showSideLabels={false}
        interactive
        onLinkClick={handleLinkClick}
        className="w-full max-w-[920px] flex-col items-center gap-4 md:flex-row md:items-center md:justify-center md:gap-8"
      />
      {card.showBranding ? <EmbedBranding /> : null}
    </div>
  );
}
