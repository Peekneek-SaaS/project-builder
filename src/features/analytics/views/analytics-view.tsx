"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { AnalyticsDashboard } from "@/features/analytics/components/analytics-dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ANALYTICS_PERIODS,
  createAnalyticsFromViewCount,
  isAnalyticsPeriod,
  type AnalyticsPeriod,
} from "@/lib/card-analytics";
import { getTheme } from "@/lib/card-themes";
import { useTRPC } from "@/trpc/client";
import { ArrowLeft01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const periodLabels: Record<AnalyticsPeriod, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

export function AnalyticsView({ cardId }: { cardId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trpc = useTRPC();

  const periodParam = searchParams.get("period");
  const period: AnalyticsPeriod =
    periodParam && isAnalyticsPeriod(periodParam) ? periodParam : "7d";

  const { data: billing, isLoading: billingLoading } = useQuery(
    trpc.billing.getPlan.queryOptions(),
  );

  const { data: cards = [], isLoading: cardsLoading } = useQuery(
    trpc.card.list.queryOptions(),
  );

  const {
    data: analytics,
    isLoading: analyticsLoading,
  } = useQuery(
    trpc.analytics.getByCard.queryOptions({
      cardId,
      period,
    }),
  );

  const selectedCard = cards.find((card) => card.id === cardId);

  const displayAnalytics = useMemo(() => {
    if (analytics) return analytics;
    if (!selectedCard) return null;

    const theme = getTheme(selectedCard.themeId);
    return createAnalyticsFromViewCount(
      {
        id: selectedCard.id,
        themeId: selectedCard.themeId,
        name: selectedCard.cardData.name || theme.name,
      },
      period,
      selectedCard.viewCount,
    );
  }, [analytics, selectedCard, period]);

  function setPeriod(nextPeriod: AnalyticsPeriod) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", nextPeriod);
    router.replace(`/analytics/${cardId}?${params.toString()}`);
  }

  function setCard(nextCardId: string) {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/analytics/${nextCardId}?${params.toString()}`);
  }

  if (billingLoading) {
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
            traffic sources, and locations.
          </p>
          <Button asChild>
            <Link href="/settings">Upgrade to Pro</Link>
          </Button>
        </div>
      </div>
    );
  }

  if ((cardsLoading || analyticsLoading) && !displayAnalytics) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2">
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
        <p className="text-sm text-muted-foreground">Loading analytics…</p>
      </div>
    );
  }

  if (!displayAnalytics) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">Card not found.</p>
        <Button asChild variant="outline">
          <Link href="/analytics">Back to analytics</Link>
        </Button>
      </div>
    );
  }

  const theme = getTheme(displayAnalytics.card.themeId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/analytics?period=${period}`}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            All analytics
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Performance for{" "}
            <span className="font-medium text-foreground">
              {displayAnalytics.card.name} · {theme.name}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={cardId} onValueChange={setCard}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Select card" />
            </SelectTrigger>
            <SelectContent>
              {cards.map((card) => {
                const cardTheme = getTheme(card.themeId);
                const name = card.cardData.name || cardTheme.name;
                return (
                  <SelectItem key={card.id} value={card.id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}>
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
        </div>
      </div>

      <AnalyticsDashboard
        data={displayAnalytics}
        period={period}
        chartIdPrefix={`card-${cardId}-${period}`}
      />
    </div>
  );
}
