"use client";

import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { BusinessCard } from "@/features/builder/components/business-card";
import type { LinkClickPayload } from "@/features/builder/components/card-layouts";
import { usePublicCardViewTracking } from "@/features/share/hooks/use-public-card-view-tracking";
import type { PublicCardPayload } from "@/lib/public-card-server";
import { getVisitorId } from "@/lib/analytics-client";
import { getTheme } from "@/lib/card-themes";
import { useTRPC } from "@/trpc/client";

export function PublicQrCardView({ card }: { card: PublicCardPayload }) {
  const trpc = useTRPC();
  const theme = getTheme(card.themeId);

  usePublicCardViewTracking(card.slug, { utmSource: "qr" });

  const recordLinkClick = useMutation(
    trpc.card.recordLinkClick.mutationOptions(),
  );

  const handleLinkClick = useCallback(
    (payload: LinkClickPayload) => {
      recordLinkClick.mutate({
        slug: card.slug,
        visitorId: getVisitorId(),
        linkLabel: payload.label,
        linkUrl: payload.href,
      });
    },
    [card.slug, recordLinkClick],
  );

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
