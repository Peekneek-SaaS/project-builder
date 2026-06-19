"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import { getVisitorId } from "@/lib/analytics-client";
import { getUtmSourceFromUrl } from "@/lib/card-analytics";
import { useTRPC } from "@/trpc/client";

export function usePublicCardViewTracking(
  slug: string | undefined,
  options?: { utmSource?: string },
) {
  const trpc = useTRPC();
  const recordView = useMutation(trpc.card.recordView.mutationOptions());
  const countedRef = useRef(false);

  useEffect(() => {
    if (!slug || countedRef.current) return;
    countedRef.current = true;

    recordView.mutate({
      slug,
      visitorId: getVisitorId(),
      referrer: document.referrer || undefined,
      utmSource:
        options?.utmSource ??
        getUtmSourceFromUrl(window.location.href) ??
        undefined,
    });
  }, [slug, options?.utmSource, recordView]);
}
