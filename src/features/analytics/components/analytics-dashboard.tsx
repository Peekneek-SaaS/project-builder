"use client";

import { useEffect, useState } from "react";
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
  formatKpi,
  type AnalyticsPeriod,
  type CardAnalyticsSnapshot,
} from "@/lib/card-analytics";
import { cn } from "@/lib/utils";
import { ListPagination } from "@/components/list-pagination";
import { paginateItems, PAGE_SIZE } from "@/lib/pagination";
import {
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
  BubblesIcon,
  ChartIcon,
  ClipboardIcon,
  DivideSignIcon,
  Link01Icon,
  SquareMousePointerIcon,
  StarIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

const CHART_PRIMARY = "var(--primary)";
const CHART_PRIMARY_MUTED =
  "color-mix(in oklch, var(--primary) 55%, var(--background))";

const chartConfig = {
  views: { label: "Views", color: CHART_PRIMARY },
  visitors: { label: "Visitors", color: CHART_PRIMARY_MUTED },
  clicks: { label: "Clicks", color: CHART_PRIMARY },
} satisfies ChartConfig;

export function AnalyticsDashboard({
  data,
  period,
  chartIdPrefix = "analytics",
}: {
  data: CardAnalyticsSnapshot;
  period: AnalyticsPeriod;
  chartIdPrefix?: string;
}) {
  const [locationsPage, setLocationsPage] = useState(1);

  useEffect(() => {
    setLocationsPage(1);
  }, [data.locations, period, chartIdPrefix]);

  const paginatedLocations = paginateItems(data.locations, locationsPage);

  const dailyMax = Math.max(
    ...data.daily.flatMap((point) => [point.views, point.visitors]),
    1,
  );
  const yMax = Math.ceil(dailyMax / 10) * 10 || 10;
  const yTicks = Array.from(
    new Set([0, Math.round(yMax / 3), Math.round((yMax * 2) / 3), yMax]),
  ).sort((a, b) => a - b);

  const viewsGradientId = `${chartIdPrefix}-fillViews`;
  const visitorsGradientId = `${chartIdPrefix}-fillVisitors`;

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={ViewIcon}
          label="Total views"
          value={formatKpi(data.kpis.totalViews)}
          delta={data.kpis.deltas.totalViews.label}
          up={data.kpis.deltas.totalViews.up}
          variant="views"
        />
        <Kpi
          icon={UserIcon}
          label="Unique visitors"
          value={formatKpi(data.kpis.uniqueVisitors)}
          delta={data.kpis.deltas.uniqueVisitors.label}
          up={data.kpis.deltas.uniqueVisitors.up}
          variant="visitors"
        />
        <Kpi
          icon={SquareMousePointerIcon}
          label="Link clicks"
          value={formatKpi(data.kpis.linkClicks)}
          delta={data.kpis.deltas.linkClicks.label}
          up={data.kpis.deltas.linkClicks.up}
          variant="clicks"
        />
        <Kpi
          icon={ArrowUpRight01Icon}
          label="Click rate"
          value={formatKpi(data.kpis.clickRate, "%")}
          delta={data.kpis.deltas.clickRate.label}
          up={data.kpis.deltas.clickRate.up}
          variant="clickRate"
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
            <Legend color={CHART_PRIMARY} label="Views" />
            <Legend color={CHART_PRIMARY_MUTED} label="Visitors" />
          </div>
        </div>
        <ChartContainer config={chartConfig} className="mt-6 h-72 w-full">
          <AreaChart data={data.daily} margin={{ left: 8, right: 8, top: 8 }}>
            <defs>
              <linearGradient id={viewsGradientId} x1="0" y1="0" x2="0" y2="1">
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
              <linearGradient
                id={visitorsGradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
              fill={`url(#${viewsGradientId})`}
            />
            <Area
              dataKey="visitors"
              type="monotone"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              fill={`url(#${visitorsGradientId})`}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold">Top links</h2>
          <p className="text-xs text-muted-foreground">
            Clicks per link across your cards
          </p>
          {data.topLinks.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              No link clicks recorded in this period yet.
            </p>
          ) : (
            <ChartContainer config={chartConfig} className="mt-6 h-64 w-full">
              <BarChart
                data={data.topLinks}
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
                  {data.topLinks.map((_, i) => (
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
          {data.sources.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              No traffic recorded in this period yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {data.sources.map((source) => (
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">Top locations</h2>
            <p className="text-xs text-muted-foreground">Visitor cities</p>
          </div>
          <ListPagination
            page={locationsPage}
            totalItems={data.locations.length}
            onPageChange={setLocationsPage}
          />
        </div>
        {data.locations.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Location data will appear once visitors view your public cards.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {paginatedLocations.map((loc, i) => (
              <div
                key={loc.city}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                    {(locationsPage - 1) * PAGE_SIZE + i + 1}
                  </span>
                  <span className="text-sm">{loc.city}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {loc.views.toLocaleString("en-US")} views
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

type KpiVariant = "views" | "visitors" | "clicks" | "clickRate";

function Kpi({
  icon,
  label,
  value,
  delta,
  up,
  variant,
}: {
  icon?: IconSvgElement;
  label: string;
  value: string;
  delta: string;
  up: boolean;
  variant: KpiVariant;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      <div className="relative z-10">
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
      <KpiDecoration variant={variant} />
    </div>
  );
}

function KpiDecoration({ variant }: { variant: KpiVariant }) {
  switch (variant) {
    case "views":
      return (
        <HugeiconsIcon
          icon={UserGroupIcon}
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-6 size-23 text-amber-500/14 sm:size-24"
        />
      );
    case "visitors":
      return (
        <HugeiconsIcon
          icon={UserCircleIcon}
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-6 size-23 text-emerald-500/14 sm:size-24"
        />
      );
    case "clicks":
      return (
        <>
          <HugeiconsIcon
            icon={Link01Icon}
            aria-hidden
            className="pointer-events-none absolute -bottom-10 -right-8 size-24 -rotate-8 text-indigo-500/14 sm:size-28"
          />
        </>
      );
    case "clickRate":
      return (
        <HugeiconsIcon
          icon={DivideSignIcon}
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-6 size-23 -rotate-12 text-red-500/14 sm:size-24"
        />
      );
  }
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
