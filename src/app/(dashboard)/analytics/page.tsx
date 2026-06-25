import { Suspense } from "react";
import type { Metadata } from "next";

import { AnalyticsOverviewView } from "@/features/analytics/views/analytics-overview-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "Track views and engagement for your shared business cards over time.",
};

export default async function AnalyticsPage() {
  prefetch(trpc.analytics.getOverview.queryOptions({ period: "7d" }));
  prefetch(trpc.billing.getPlan.queryOptions());

  return (
    <HydrateClient>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading analytics…</p>
          </div>
        }
      >
        <AnalyticsOverviewView />
      </Suspense>
    </HydrateClient>
  );
}
