import {
  format,
  startOfDay,
  startOfHour,
  subDays,
  subHours,
} from "date-fns";

export const ANALYTICS_PERIODS = ["24h", "7d", "30d", "90d"] as const;
export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[number];

export type AnalyticsDateRange = {
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
};

export function isAnalyticsPeriod(value: string): value is AnalyticsPeriod {
  return ANALYTICS_PERIODS.includes(value as AnalyticsPeriod);
}

export function getAnalyticsDateRange(
  period: AnalyticsPeriod,
  now = new Date(),
): AnalyticsDateRange {
  const end = now;

  if (period === "24h") {
    const start = subHours(end, 24);
    return {
      start,
      end,
      previousStart: subHours(start, 24),
      previousEnd: start,
    };
  }

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const start = subDays(end, days);
  return {
    start,
    end,
    previousStart: subDays(start, days),
    previousEnd: start,
  };
}

export function parseTrafficSourceFromServer(
  referrer?: string | null,
  utmSource?: string | null,
): string {
  const utm = utmSource?.trim().toLowerCase();
  if (utm) {
    if (utm.includes("qr")) return "QR scan";
    if (utm.includes("linkedin")) return "LinkedIn";
    if (utm.includes("email")) return "Email signature";
    if (utm === "direct") return "Direct link";
    return utm.charAt(0).toUpperCase() + utm.slice(1);
  }

  if (!referrer?.trim()) return "Direct link";

  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("linkedin")) return "LinkedIn";
    if (
      host.includes("mail.google") ||
      host.includes("outlook") ||
      host.includes("mail.yahoo") ||
      host.includes("mail.")
    ) {
      return "Email signature";
    }
    return "Other";
  } catch {
    return "Other";
  }
}

export function getGeoFromHeaders(headers: Headers) {
  const city =
    headers.get("x-vercel-ip-city") ??
    headers.get("cf-ipcity") ??
    headers.get("x-app-city");
  const country =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-app-country");

  return {
    city: city?.trim() || null,
    country: country?.trim() || null,
  };
}

export function formatDelta(current: number, previous: number): {
  label: string;
  up: boolean;
} {
  if (previous === 0) {
    if (current === 0) return { label: "0%", up: true };
    return { label: "+100%", up: true };
  }

  const change = ((current - previous) / previous) * 100;
  const up = change >= 0;
  const label = `${up ? "+" : ""}${change.toFixed(1)}%`;
  return { label, up };
}

export function formatKpi(value: number, suffix = ""): string {
  if (suffix === "%") return `${Math.round(value)}%`;
  return value.toLocaleString();
}

type DailyBucket = {
  key: string;
  label: string;
  views: number;
  visitors: Set<string>;
};

export function buildDailySeries(
  period: AnalyticsPeriod,
  views: { createdAt: Date; visitorId: string }[],
  range: AnalyticsDateRange,
): { label: string; views: number; visitors: number }[] {
  const buckets = new Map<string, DailyBucket>();

  if (period === "24h") {
    for (let i = 23; i >= 0; i--) {
      const bucketStart = startOfHour(subHours(range.end, i));
      const key = bucketStart.toISOString();
      buckets.set(key, {
        key,
        label: format(bucketStart, "ha"),
        views: 0,
        visitors: new Set(),
      });
    }
  } else {
    const days =
      period === "7d" ? 7 : period === "30d" ? 30 : 90;
    for (let i = days - 1; i >= 0; i--) {
      const bucketStart = startOfDay(subDays(range.end, i));
      const key = bucketStart.toISOString();
      buckets.set(key, {
        key,
        label:
          period === "7d"
            ? format(bucketStart, "EEE")
            : format(bucketStart, "MMM d"),
        views: 0,
        visitors: new Set(),
      });
    }
  }

  for (const view of views) {
    const bucketStart =
      period === "24h"
        ? startOfHour(view.createdAt)
        : startOfDay(view.createdAt);
    const key = bucketStart.toISOString();
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.views += 1;
    bucket.visitors.add(view.visitorId);
  }

  return Array.from(buckets.values()).map((bucket) => ({
    label: bucket.label,
    views: bucket.views,
    visitors: bucket.visitors.size,
  }));
}

export function getUtmSourceFromUrl(url: string): string | null {
  try {
    return new URL(url).searchParams.get("utm_source");
  } catch {
    return null;
  }
}

export type CardAnalyticsSnapshot = {
  card: { id: string; themeId: string; name: string };
  period: AnalyticsPeriod;
  kpis: {
    totalViews: number;
    uniqueVisitors: number;
    linkClicks: number;
    clickRate: number;
    deltas: {
      totalViews: ReturnType<typeof formatDelta>;
      uniqueVisitors: ReturnType<typeof formatDelta>;
      linkClicks: ReturnType<typeof formatDelta>;
      clickRate: ReturnType<typeof formatDelta>;
    };
  };
  daily: { label: string; views: number; visitors: number }[];
  topLinks: { label: string; clicks: number }[];
  sources: { name: string; value: number; count: number }[];
  locations: { city: string; views: number }[];
};

export function createEmptyAnalytics(
  card: { id: string; themeId: string; name: string },
  period: AnalyticsPeriod,
): CardAnalyticsSnapshot {
  const range = getAnalyticsDateRange(period);
  const zeroDelta = formatDelta(0, 0);

  return {
    card,
    period,
    kpis: {
      totalViews: 0,
      uniqueVisitors: 0,
      linkClicks: 0,
      clickRate: 0,
      deltas: {
        totalViews: zeroDelta,
        uniqueVisitors: zeroDelta,
        linkClicks: zeroDelta,
        clickRate: zeroDelta,
      },
    },
    daily: buildDailySeries(period, [], range),
    topLinks: [],
    sources: [],
    locations: [],
  };
}

export function buildLegacyViewRecords(
  count: number,
  at: Date,
): { createdAt: Date; visitorId: string }[] {
  return Array.from({ length: count }, (_, index) => ({
    createdAt: at,
    visitorId: `legacy-${index}`,
  }));
}

export function mergeLegacyViewsIntoSnapshot(
  snapshot: CardAnalyticsSnapshot,
  legacyViewCount: number,
  period: AnalyticsPeriod,
  viewsInRange: { createdAt: Date; visitorId: string }[],
  previous: {
    totalViews: number;
    uniqueVisitors: number;
    clickRate: number;
  },
): CardAnalyticsSnapshot {
  if (legacyViewCount <= 0) {
    return snapshot;
  }

  const range = getAnalyticsDateRange(period);
  const mergedViews = [
    ...viewsInRange,
    ...buildLegacyViewRecords(legacyViewCount, range.end),
  ];
  const totalViews = snapshot.kpis.totalViews + legacyViewCount;
  const uniqueVisitors = new Set(mergedViews.map((view) => view.visitorId)).size;
  const clickRate =
    totalViews > 0 ? (snapshot.kpis.linkClicks / totalViews) * 100 : 0;

  const sources =
    snapshot.sources.length > 0
      ? snapshot.sources
      : [{ name: "Direct link", value: 100, count: legacyViewCount }];

  return {
    ...snapshot,
    kpis: {
      ...snapshot.kpis,
      totalViews,
      uniqueVisitors,
      clickRate,
      deltas: {
        totalViews: formatDelta(totalViews, previous.totalViews),
        uniqueVisitors: formatDelta(uniqueVisitors, previous.uniqueVisitors),
        linkClicks: snapshot.kpis.deltas.linkClicks,
        clickRate: formatDelta(clickRate, previous.clickRate),
      },
    },
    daily: buildDailySeries(period, mergedViews, range),
    sources,
  };
}

export function createAnalyticsFromViewCount(
  card: { id: string; themeId: string; name: string },
  period: AnalyticsPeriod,
  viewCount: number,
): CardAnalyticsSnapshot {
  if (viewCount <= 0) {
    return createEmptyAnalytics(card, period);
  }

  const range = getAnalyticsDateRange(period);
  const views = buildLegacyViewRecords(viewCount, range.end);
  const uniqueVisitors = new Set(views.map((view) => view.visitorId)).size;

  return {
    card,
    period,
    kpis: {
      totalViews: viewCount,
      uniqueVisitors,
      linkClicks: 0,
      clickRate: 0,
      deltas: {
        totalViews: formatDelta(viewCount, 0),
        uniqueVisitors: formatDelta(uniqueVisitors, 0),
        linkClicks: formatDelta(0, 0),
        clickRate: formatDelta(0, 0),
      },
    },
    daily: buildDailySeries(period, views, range),
    topLinks: [],
    sources: [{ name: "Direct link", value: 100, count: viewCount }],
    locations: [],
  };
}
