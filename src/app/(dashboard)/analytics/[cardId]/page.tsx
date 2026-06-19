import { Suspense } from "react";

import { AnalyticsView } from "@/features/analytics/views/analytics-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function CardAnalyticsPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;

  prefetch(trpc.card.list.queryOptions());

  return (
    <HydrateClient>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading analytics…</p>
          </div>
        }
      >
        <AnalyticsView cardId={cardId} />
      </Suspense>
    </HydrateClient>
  );
}
