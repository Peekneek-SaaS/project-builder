"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
  formatKpi,
  isAnalyticsPeriod,
  type AnalyticsPeriod,
} from "@/lib/card-analytics";
import { getTheme } from "@/lib/card-themes";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import {
  ArrowDownRight01Icon,
  ArrowLeft01Icon,
  ArrowUpRight01Icon,
  Loading03Icon,
  SquareMousePointerIcon,
  UserIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

const chartConfig = {
  views: { label: "Views", color: "var(--chart-1)" },
  visitors: { label: "Visitors", color: "var(--chart-2)" },
  clicks: { label: "Clicks", color: "var(--chart-1)" },
} satisfies ChartConfig;

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
          <Link href="/analytics">Choose a card</Link>
        </Button>
      </div>
    );
  }

  const theme = getTheme(displayAnalytics.card.themeId);
  const dailyMax = Math.max(
    ...displayAnalytics.daily.flatMap((point) => [point.views, point.visitors]),
    1,
  );
  const yMax = Math.ceil(dailyMax / 10) * 10 || 10;
  const yTicks = Array.from(
    new Set([0, Math.round(yMax / 3), Math.round((yMax * 2) / 3), yMax]),
  ).sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            Back to dashboard
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={ViewIcon}
          label="Total views"
          value={formatKpi(displayAnalytics.kpis.totalViews)}
          delta={displayAnalytics.kpis.deltas.totalViews.label}
          up={displayAnalytics.kpis.deltas.totalViews.up}
        />
        <Kpi
          icon={UserIcon}
          label="Unique visitors"
          value={formatKpi(displayAnalytics.kpis.uniqueVisitors)}
          delta={displayAnalytics.kpis.deltas.uniqueVisitors.label}
          up={displayAnalytics.kpis.deltas.uniqueVisitors.up}
        />
        <Kpi
          icon={SquareMousePointerIcon}
          label="Link clicks"
          value={formatKpi(displayAnalytics.kpis.linkClicks)}
          delta={displayAnalytics.kpis.deltas.linkClicks.label}
          up={displayAnalytics.kpis.deltas.linkClicks.up}
        />
        <Kpi
          icon={ArrowUpRight01Icon}
          label="Click rate"
          value={formatKpi(displayAnalytics.kpis.clickRate, "%")}
          delta={displayAnalytics.kpis.deltas.clickRate.label}
          up={displayAnalytics.kpis.deltas.clickRate.up}
        />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Views & visitors</h2>
            <p className="text-xs text-muted-foreground">
              {period === "24h" ? "Hourly" : "Daily"} traffic over the selected
              period
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Legend color="var(--chart-1)" label="Views" />
            <Legend color="var(--chart-2)" label="Visitors" />
          </div>
        </div>
        <ChartContainer config={chartConfig} className="mt-6 h-72 w-full">
          <AreaChart data={displayAnalytics.daily} margin={{ left: 8, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-views)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={period === "90d" ? 24 : 8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              domain={[0, yMax]}
              ticks={yTicks}
              allowDecimals={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="views"
              type="monotone"
              stroke="var(--color-views)"
              strokeWidth={2}
              fill="url(#fillViews)"
            />
            <Area
              dataKey="visitors"
              type="monotone"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              fill="url(#fillVisitors)"
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold">Top links</h2>
          <p className="text-xs text-muted-foreground">
            Clicks per link on your card
          </p>
          {displayAnalytics.topLinks.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              No link clicks recorded in this period yet.
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="mt-6 h-64 w-full">
              <BarChart
                data={displayAnalytics.topLinks}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid
                  horizontal={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="clicks" radius={6} fill="var(--color-clicks)">
                  {displayAnalytics.topLinks.map((_, i) => (
                    <Cell key={i} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Traffic sources</h2>
          <p className="text-xs text-muted-foreground">
            Where visits come from
          </p>
          {displayAnalytics.sources.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              No traffic recorded in this period yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {displayAnalytics.sources.map((source) => (
                <div key={source.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{source.name}</span>
                    <span className="font-medium">{source.value}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${source.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Top locations</h2>
        <p className="text-xs text-muted-foreground">Visitor cities</p>
        {displayAnalytics.locations.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Location data will appear once visitors view your public card.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {displayAnalytics.locations.map((loc, i) => (
              <div
                key={loc.city}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm">{loc.city}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {loc.views.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  delta,
  up,
}: {
  icon?: IconSvgElement;
  label: string;
  value: string;
  delta: string;
  up: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
          {icon ? <HugeiconsIcon icon={icon} /> : null}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-medium",
            up ? "text-emerald-600" : "text-destructive",
          )}
        >
          {up ? (
            <HugeiconsIcon icon={ArrowUpRight01Icon} />
          ) : (
            <HugeiconsIcon icon={ArrowDownRight01Icon} />
          )}
          {delta}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
