"use client";

import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import type { LinkClickPayload } from "@/features/builder/components/card-layouts";
import { CardPreviewScaler } from "@/features/builder/components/card-preview-scaler";
import { PublicCardStack } from "@/features/share/components/public-card-stack";
import { PublicProfilePanel } from "@/features/share/components/public-profile-panel";
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <HugeiconsIcon
          icon={Loading03Icon}
          className="animate-spin text-black"
          size={16}
        />
        <p className="text-sm text-muted-foreground">Loading card</p>
      </div>
    );
  }

  if (isError || !card) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white px-4">
        <p className="text-sm font-medium">Card not found</p>
        <p className="text-sm text-muted-foreground">
          This card may be unpublished or the link is incorrect.
        </p>
      </div>
    );
  }

  const theme = getTheme(card.themeId);
  const { name, title, company } = card.cardData;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:min-h-[calc(100vh-4rem)] lg:flex-row lg:items-center lg:gap-14 lg:py-16 xl:gap-20">
        {/* Left — business card stack, vertically centered to profile */}
        <div className="flex w-full shrink-0 justify-center lg:flex-1 lg:justify-center xl:justify-end">
          <CardPreviewScaler
            fitMode="fillWidth"
            maxScale={1.75}
            padding={12}
            minHeightClass="min-h-0"
            clipContent={false}
            className="w-full max-w-[min(100%,560px)] lg:max-w-[min(100%,520px)]"
          >
            <PublicCardStack
              data={card.cardData}
              theme={theme}
              displayMode={card.displayMode}
              interactive
              onLinkClick={handleLinkClick}
            />
          </CardPreviewScaler>
        </div>

        {/* Right — profile */}
        <div className="flex min-w-0 flex-1 flex-col gap-8 lg:max-w-xl">
          <header className="space-y-1 border-b border-neutral-100 pb-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
              Digital business card
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              {name || "Untitled card"}
            </h1>
            {title ? (
              <p className="text-base text-neutral-600">{title}</p>
            ) : null}
            {company ? (
              <p className="text-sm text-neutral-400">{company}</p>
            ) : null}
          </header>

          <PublicProfilePanel data={card.cardData} />
        </div>
      </div>
    </div>
  );
}
