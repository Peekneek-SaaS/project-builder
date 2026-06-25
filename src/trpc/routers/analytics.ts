import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  ANALYTICS_PERIODS,
  buildDailySeries,
  createAnalyticsFromViewCount,
  createEmptyAnalytics,
  createOverviewFromViewCounts,
  formatDelta,
  getAnalyticsDateRange,
  mergeLegacyViewsIntoSnapshot,
  type AnalyticsOverviewCard,
} from "@/lib/card-analytics";
import { getCardBuilderLabel } from "@/lib/card-data";
import { cardDataSchema } from "@/lib/card-schema";
import { assertCanAccessAnalytics } from "@/lib/billing";
import { prisma } from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";

async function getOwnedCard(userId: string, cardId: string) {
  const card = await prisma.card.findFirst({
    where: { id: cardId, userId, deletedAt: null },
  });

  if (!card) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Card not found." });
  }

  return card;
}

function cardDisplayName(cardData: unknown) {
  return getCardBuilderLabel(cardDataSchema.parse(cardData));
}

function analyticsTablesReady() {
  return (
    typeof prisma.cardView?.count === "function" &&
    typeof prisma.cardLinkClick?.count === "function"
  );
}

async function countUniqueVisitors(
  cardIds: string | string[],
  start: Date,
  end: Date,
) {
  const ids = Array.isArray(cardIds) ? cardIds : [cardIds];
  if (ids.length === 0) return 0;

  const groups = await prisma.cardView.groupBy({
    by: ["visitorId"],
    where: {
      cardId: { in: ids },
      createdAt: { gte: start, lte: end },
    },
  });

  return groups.length;
}

async function getUntrackedViewCount(cardId: string, viewCount: number) {
  if (!analyticsTablesReady()) {
    return viewCount;
  }

  try {
    const tracked = await prisma.cardView.count({ where: { cardId } });
    return Math.max(0, viewCount - tracked);
  } catch {
    return viewCount;
  }
}

export const analyticsRouter = createTRPCRouter({
  getByCard: protectedProcedure
    .input(
      z.object({
        cardId: z.string(),
        period: z.enum(ANALYTICS_PERIODS).default("7d"),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        await assertCanAccessAnalytics(ctx.userId);
      } catch (error) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            error instanceof Error
              ? error.message
              : "Upgrade to Pro to access analytics.",
        });
      }

      const card = await getOwnedCard(ctx.userId, input.cardId);
      const cardSummary = {
        id: card.id,
        themeId: card.themeId,
        name: cardDisplayName(card.cardData),
      };

      if (!analyticsTablesReady()) {
        return createAnalyticsFromViewCount(
          cardSummary,
          input.period,
          card.viewCount,
        );
      }

      try {
        const range = getAnalyticsDateRange(input.period);
        const untrackedViews = await getUntrackedViewCount(
          card.id,
          card.viewCount,
        );

        const [
          currentViews,
          previousViews,
          currentClicks,
          previousClicks,
          viewsInRange,
          linkGroups,
          sourceGroups,
          locationGroups,
        ] = await Promise.all([
          prisma.cardView.count({
            where: {
              cardId: card.id,
              createdAt: { gte: range.start, lte: range.end },
            },
          }),
          prisma.cardView.count({
            where: {
              cardId: card.id,
              createdAt: { gte: range.previousStart, lte: range.previousEnd },
            },
          }),
          prisma.cardLinkClick.count({
            where: {
              cardId: card.id,
              createdAt: { gte: range.start, lte: range.end },
            },
          }),
          prisma.cardLinkClick.count({
            where: {
              cardId: card.id,
              createdAt: { gte: range.previousStart, lte: range.previousEnd },
            },
          }),
          prisma.cardView.findMany({
            where: {
              cardId: card.id,
              createdAt: { gte: range.start, lte: range.end },
            },
            select: { createdAt: true, visitorId: true },
            orderBy: { createdAt: "asc" },
          }),
          prisma.cardLinkClick.groupBy({
            by: ["linkLabel"],
            where: {
              cardId: card.id,
              createdAt: { gte: range.start, lte: range.end },
            },
            _count: { _all: true },
          }),
          prisma.cardView.groupBy({
            by: ["source"],
            where: {
              cardId: card.id,
              createdAt: { gte: range.start, lte: range.end },
            },
            _count: { _all: true },
          }),
          prisma.cardView.groupBy({
            by: ["city", "country"],
            where: {
              cardId: card.id,
              createdAt: { gte: range.start, lte: range.end },
              city: { not: null },
            },
            _count: { _all: true },
          }),
        ]);

        const [uniqueVisitors, previousUniqueVisitors] = await Promise.all([
          countUniqueVisitors(card.id, range.start, range.end),
          countUniqueVisitors(
            card.id,
            range.previousStart,
            range.previousEnd,
          ),
        ]);

        const trackedClickRate =
          currentViews > 0 ? (currentClicks / currentViews) * 100 : 0;
        const previousClickRate =
          previousViews > 0 ? (previousClicks / previousViews) * 100 : 0;

        const sourceTotal = sourceGroups.reduce(
          (sum, group) => sum + group._count._all,
          0,
        );

        const baseSnapshot = {
          card: cardSummary,
          period: input.period,
          kpis: {
            totalViews: currentViews,
            uniqueVisitors,
            linkClicks: currentClicks,
            clickRate: trackedClickRate,
            deltas: {
              totalViews: formatDelta(currentViews, previousViews),
              uniqueVisitors: formatDelta(
                uniqueVisitors,
                previousUniqueVisitors,
              ),
              linkClicks: formatDelta(currentClicks, previousClicks),
              clickRate: formatDelta(trackedClickRate, previousClickRate),
            },
          },
          daily: buildDailySeries(input.period, viewsInRange, range),
          topLinks: [...linkGroups]
            .sort((a, b) => b._count._all - a._count._all)
            .slice(0, 8)
            .map((group) => ({
              label: group.linkLabel,
              clicks: group._count._all,
            })),
          sources: [...sourceGroups]
            .sort((a, b) => b._count._all - a._count._all)
            .map((group) => ({
              name: group.source,
              value:
                sourceTotal > 0
                  ? Math.round((group._count._all / sourceTotal) * 100)
                  : 0,
              count: group._count._all,
            })),
          locations: [...locationGroups]
            .sort((a, b) => b._count._all - a._count._all)
            .map((group) => ({
              city: [group.city, group.country].filter(Boolean).join(", "),
              views: group._count._all,
            })),
        };

        return mergeLegacyViewsIntoSnapshot(
          baseSnapshot,
          untrackedViews,
          input.period,
          viewsInRange,
          {
            totalViews: previousViews,
            uniqueVisitors: previousUniqueVisitors,
            clickRate: previousClickRate,
          },
        );
      } catch {
        return createAnalyticsFromViewCount(
          cardSummary,
          input.period,
          card.viewCount,
        );
      }
    }),

  getOverview: protectedProcedure
    .input(
      z.object({
        period: z.enum(ANALYTICS_PERIODS).default("7d"),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        await assertCanAccessAnalytics(ctx.userId);
      } catch (error) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            error instanceof Error
              ? error.message
              : "Upgrade to Pro to access analytics.",
        });
      }

      const cards = await prisma.card.findMany({
        where: { userId: ctx.userId, deletedAt: null },
        select: {
          id: true,
          themeId: true,
          cardData: true,
          viewCount: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      if (cards.length === 0) {
        return null;
      }

      const cardSummaries: AnalyticsOverviewCard[] = cards.map((card) => ({
        id: card.id,
        themeId: card.themeId,
        name: cardDisplayName(card.cardData),
        views: card.viewCount,
      }));

      const cardIds = cards.map((card) => card.id);
      const overviewCard = {
        id: "overview",
        themeId: "midnight",
        name: "All cards",
      };

      if (!analyticsTablesReady()) {
        return createOverviewFromViewCounts(cardSummaries, input.period);
      }

      try {
        const range = getAnalyticsDateRange(input.period);
        const untrackedViews = (
          await Promise.all(
            cards.map((card) => getUntrackedViewCount(card.id, card.viewCount)),
          )
        ).reduce((sum, count) => sum + count, 0);

        const [
          currentViews,
          previousViews,
          currentClicks,
          previousClicks,
          viewsInRange,
          linkGroups,
          sourceGroups,
          locationGroups,
          cardViewGroups,
        ] = await Promise.all([
          prisma.cardView.count({
            where: {
              cardId: { in: cardIds },
              createdAt: { gte: range.start, lte: range.end },
            },
          }),
          prisma.cardView.count({
            where: {
              cardId: { in: cardIds },
              createdAt: { gte: range.previousStart, lte: range.previousEnd },
            },
          }),
          prisma.cardLinkClick.count({
            where: {
              cardId: { in: cardIds },
              createdAt: { gte: range.start, lte: range.end },
            },
          }),
          prisma.cardLinkClick.count({
            where: {
              cardId: { in: cardIds },
              createdAt: { gte: range.previousStart, lte: range.previousEnd },
            },
          }),
          prisma.cardView.findMany({
            where: {
              cardId: { in: cardIds },
              createdAt: { gte: range.start, lte: range.end },
            },
            select: { createdAt: true, visitorId: true },
            orderBy: { createdAt: "asc" },
          }),
          prisma.cardLinkClick.groupBy({
            by: ["linkLabel"],
            where: {
              cardId: { in: cardIds },
              createdAt: { gte: range.start, lte: range.end },
            },
            _count: { _all: true },
          }),
          prisma.cardView.groupBy({
            by: ["source"],
            where: {
              cardId: { in: cardIds },
              createdAt: { gte: range.start, lte: range.end },
            },
            _count: { _all: true },
          }),
          prisma.cardView.groupBy({
            by: ["city", "country"],
            where: {
              cardId: { in: cardIds },
              createdAt: { gte: range.start, lte: range.end },
              city: { not: null },
            },
            _count: { _all: true },
          }),
          prisma.cardView.groupBy({
            by: ["cardId"],
            where: {
              cardId: { in: cardIds },
              createdAt: { gte: range.start, lte: range.end },
            },
            _count: { _all: true },
          }),
        ]);

        const [uniqueVisitors, previousUniqueVisitors] = await Promise.all([
          countUniqueVisitors(cardIds, range.start, range.end),
          countUniqueVisitors(cardIds, range.previousStart, range.previousEnd),
        ]);

        const trackedClickRate =
          currentViews > 0 ? (currentClicks / currentViews) * 100 : 0;
        const previousClickRate =
          previousViews > 0 ? (previousClicks / previousViews) * 100 : 0;

        const sourceTotal = sourceGroups.reduce(
          (sum, group) => sum + group._count._all,
          0,
        );

        const viewsByCardId = new Map(
          cardViewGroups.map((group) => [group.cardId, group._count._all]),
        );

        const topCards = cardSummaries
          .map((card) => ({
            ...card,
            views: viewsByCardId.get(card.id) ?? 0,
          }))
          .sort((a, b) => b.views - a.views);

        const baseSnapshot = {
          card: overviewCard,
          period: input.period,
          kpis: {
            totalViews: currentViews,
            uniqueVisitors,
            linkClicks: currentClicks,
            clickRate: trackedClickRate,
            deltas: {
              totalViews: formatDelta(currentViews, previousViews),
              uniqueVisitors: formatDelta(
                uniqueVisitors,
                previousUniqueVisitors,
              ),
              linkClicks: formatDelta(currentClicks, previousClicks),
              clickRate: formatDelta(trackedClickRate, previousClickRate),
            },
          },
          daily: buildDailySeries(input.period, viewsInRange, range),
          topLinks: [...linkGroups]
            .sort((a, b) => b._count._all - a._count._all)
            .slice(0, 8)
            .map((group) => ({
              label: group.linkLabel,
              clicks: group._count._all,
            })),
          sources: [...sourceGroups]
            .sort((a, b) => b._count._all - a._count._all)
            .map((group) => ({
              name: group.source,
              value:
                sourceTotal > 0
                  ? Math.round((group._count._all / sourceTotal) * 100)
                  : 0,
              count: group._count._all,
            })),
          locations: [...locationGroups]
            .sort((a, b) => b._count._all - a._count._all)
            .map((group) => ({
              city: [group.city, group.country].filter(Boolean).join(", "),
              views: group._count._all,
            })),
        };

        const merged = mergeLegacyViewsIntoSnapshot(
          baseSnapshot,
          untrackedViews,
          input.period,
          viewsInRange,
          {
            totalViews: previousViews,
            uniqueVisitors: previousUniqueVisitors,
            clickRate: previousClickRate,
          },
        );

        return {
          ...merged,
          totalCards: cards.length,
          topCards,
        };
      } catch {
        return createOverviewFromViewCounts(cardSummaries, input.period);
      }
    }),
});
