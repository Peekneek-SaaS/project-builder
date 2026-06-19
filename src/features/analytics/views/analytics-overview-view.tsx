"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { AnalyticsDashboard } from "@/features/analytics/components/analytics-dashboard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ANALYTICS_PERIODS,
  isAnalyticsPeriod,
  type AnalyticsPeriod,
} from "@/lib/card-analytics";
import { getTheme } from "@/lib/card-themes";
import { useTRPC } from "@/trpc/client";
import { Chart03Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FadeIn } from "@/components/motion";

const periodLabels: Record<AnalyticsPeriod, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export function AnalyticsOverviewView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();

  const periodParam = searchParams.get("period");
  const period: AnalyticsPeriod =
    periodParam && isAnalyticsPeriod(periodParam) ? periodParam : "7d";

  const { data: billing, isLoading: billingLoading } = useQuery(
    trpc.billing.getPlan.queryOptions(),
  );

  const { data: overview, isLoading: overviewLoading } = useQuery(
    trpc.analytics.getOverview.queryOptions({ period }),
  );

  function setPeriod(nextPeriod: AnalyticsPeriod) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", nextPeriod);
    router.replace(`/analytics?${params.toString()}`);
  }

  if (billingLoading || overviewLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2">
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
        <p className="text-sm text-muted-foreground">Loading analytics…</p>
      </div>
    );
  }

  if (billing && !billing.analyticsEnabled) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <h2 className="text-lg font-semibold">Analytics is a Pro feature</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Upgrade to Pro for full analytics: views, visitors, link clicks,
            traffic sources, and locations across all your cards.
          </p>
          <Button asChild>
            <Link href="/settings">Upgrade to Pro</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <HugeiconsIcon
            icon={Chart03Icon}
            className="mx-auto text-muted-foreground"
          />
          <p className="mt-4 text-sm font-medium">No cards to analyze yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and publish a card to start tracking views and link clicks.
          </p>
          <Button asChild className="mt-4">
            <Link href="/create">Create a card</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-6xl overflow-x-hidden px-4 py-8 sm:px-6">
      <FadeIn className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Performance across{" "}
            <span className="font-medium text-foreground">
              {overview.totalCards} card{overview.totalCards === 1 ? "" : "s"}
            </span>
          </p>
        </div>
        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ANALYTICS_PERIODS.map((value) => (
              <SelectItem key={value} value={value}>
                {periodLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FadeIn>

      <AnalyticsDashboard
        data={overview}
        period={period}
        chartIdPrefix="overview"
      />

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Views by card</h2>
        <p className="text-xs text-muted-foreground">
          Card performance in the selected period
        </p>
        {overview.topCards.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No card views recorded in this period yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {overview.topCards.map((card, index) => {
              const theme = getTheme(card.themeId);
              return (
                <Link
                  key={card.id}
                  href={`/analytics/${card.id}?period=${period}`}
                  className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-primary"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {card.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {theme.name}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-muted-foreground">
                    {card.views.toLocaleString("en-US")} views
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
