import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { extractedCardDataSchema } from "@/features/create/types";
import {
  cloneCardData,
  extractedToCardData,
  type CardDisplayMode,
} from "@/lib/card-data";
import { cardDataSchema, cardDisplayModeSchema } from "@/lib/card-schema";
import { generateCardSlug, generateQrCodeId } from "@/lib/card-slug";
import { TRASH_RETENTION_MS } from "@/lib/card-trash";
import { prisma } from "@/lib/db";
import { recordCardLinkClick, recordCardView } from "@/lib/card-analytics-server";
import {
  assertCanCreateCards,
  assertCanUseTheme,
  getBillingProfile,
} from "@/lib/billing";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";

const activeCardWhere = (userId: string) => ({
  userId,
  deletedAt: null,
});

const trashedCardWhere = (userId: string) => ({
  userId,
  deletedAt: { not: null },
});

async function purgeExpiredTrash(userId: string) {
  const cutoff = new Date(Date.now() - TRASH_RETENTION_MS);
  await prisma.card.deleteMany({
    where: {
      userId,
      deletedAt: { lt: cutoff },
    },
  });
}

function parseCardRecord(card: {
  id: string;
  userId: string;
  resumeId: string;
  cardSetId: string;
  themeId: string;
  cardData: unknown;
  displayMode: string;
  published: boolean;
  publishedAt: Date | null;
  slug: string | null;
  qrCodeId: string | null;
  viewCount: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: card.id,
    userId: card.userId,
    resumeId: card.resumeId,
    cardSetId: card.cardSetId,
    themeId: card.themeId,
    cardData: cardDataSchema.parse(card.cardData),
    displayMode: cardDisplayModeSchema.parse(card.displayMode),
    published: card.published,
    publishedAt: card.publishedAt,
    slug: card.slug,
    qrCodeId: card.qrCodeId,
    viewCount: card.viewCount,
    deletedAt: card.deletedAt,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  };
}

async function uniqueSlug(name: string): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = generateCardSlug(name);
    const existing = await prisma.card.findFirst({
      where: { slug, deletedAt: null },
    });
    if (!existing) return slug;
  }

  return `${generateCardSlug(name)}-${Date.now().toString(36)}`;
}

async function ensureQrCodeId(card: { id: string; qrCodeId: string | null }) {
  if (card.qrCodeId) return card.qrCodeId;

  for (let attempt = 0; attempt < 5; attempt++) {
    const qrCodeId = generateQrCodeId();
    try {
      await prisma.card.update({
        where: { id: card.id },
        data: { qrCodeId },
      });
      return qrCodeId;
    } catch {
      // Unique collision — retry.
    }
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to assign QR code.",
  });
}

async function getOwnedActiveCard(userId: string, id: string) {
  const card = await prisma.card.findFirst({
    where: { id, ...activeCardWhere(userId) },
  });

  if (!card) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Card not found." });
  }

  return card;
}

async function getOwnedTrashedCard(userId: string, id: string) {
  const card = await prisma.card.findFirst({
    where: { id, ...trashedCardWhere(userId) },
  });

  if (!card) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Card not found in trash.",
    });
  }

  return card;
}

export const cardRouter = createTRPCRouter({
  createBatch: protectedProcedure
    .input(
      z.object({
        resumeId: z.string(),
        themeIds: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await purgeExpiredTrash(ctx.userId);

      try {
        await assertCanCreateCards(ctx.userId, input.themeIds);
      } catch (error) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            error instanceof Error
              ? error.message
              : "Your plan does not allow creating these cards.",
        });
      }

      const resume = await prisma.resume.findFirst({
        where: { id: input.resumeId, userId: ctx.userId },
      });

      if (!resume) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Resume not found.",
        });
      }

      const extracted = extractedCardDataSchema.parse(resume.extractedData);
      const baseData = extractedToCardData(extracted);
      const cardSetId = crypto.randomUUID();

      const cards = await prisma.$transaction(
        input.themeIds.map((themeId) =>
          prisma.card.create({
            data: {
              userId: ctx.userId,
              resumeId: input.resumeId,
              cardSetId,
              themeId,
              cardData: cloneCardData(baseData),
              displayMode: "pair",
              qrCodeId: generateQrCodeId(),
            },
          }),
        ),
      );

      return {
        cardSetId,
        cards: cards.map(parseCardRecord),
      };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    await purgeExpiredTrash(ctx.userId);

    const cards = await prisma.card.findMany({
      where: activeCardWhere(ctx.userId),
      orderBy: { updatedAt: "desc" },
    });

    return cards.map(parseCardRecord);
  }),

  listTrash: protectedProcedure.query(async ({ ctx }) => {
    await purgeExpiredTrash(ctx.userId);

    const cards = await prisma.card.findMany({
      where: trashedCardWhere(ctx.userId),
      orderBy: { deletedAt: "desc" },
    });

    return cards.map(parseCardRecord);
  }),

  listByIds: protectedProcedure
    .input(z.object({ ids: z.array(z.string()).min(1) }))
    .query(async ({ ctx, input }) => {
      const cards = await prisma.card.findMany({
        where: {
          id: { in: input.ids },
          ...activeCardWhere(ctx.userId),
        },
        orderBy: { createdAt: "asc" },
      });

      if (cards.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Cards not found." });
      }

      return cards.map(parseCardRecord);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const card = await getOwnedActiveCard(ctx.userId, input.id);
      await ensureQrCodeId(card);
      const fresh = await getOwnedActiveCard(ctx.userId, input.id);
      return parseCardRecord(fresh);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        themeId: z.string().optional(),
        cardData: cardDataSchema.optional(),
        displayMode: cardDisplayModeSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await getOwnedActiveCard(ctx.userId, input.id);

      if (input.themeId) {
        try {
          await assertCanUseTheme(ctx.userId, input.themeId);
        } catch (error) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              error instanceof Error
                ? error.message
                : "Your plan does not allow this theme.",
          });
        }
      }

      const card = await prisma.card.update({
        where: { id: input.id },
        data: {
          ...(input.themeId ? { themeId: input.themeId } : {}),
          ...(input.cardData ? { cardData: input.cardData } : {}),
          ...(input.displayMode ? { displayMode: input.displayMode } : {}),
        },
      });

      return parseCardRecord(card);
    }),

  moveToTrash: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await getOwnedActiveCard(ctx.userId, input.id);

      const card = await prisma.card.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
          published: false,
          publishedAt: null,
        },
      });

      return parseCardRecord(card);
    }),

  restore: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await getOwnedTrashedCard(ctx.userId, input.id);

      const card = await prisma.card.update({
        where: { id: input.id },
        data: { deletedAt: null },
      });

      return parseCardRecord(card);
    }),

  permanentDelete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await getOwnedTrashedCard(ctx.userId, input.id);

      await prisma.card.delete({ where: { id: input.id } });

      return { ok: true as const };
    }),

  publish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        publishSet: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await getOwnedActiveCard(ctx.userId, input.id);

      const cardsToPublish = input.publishSet
        ? await prisma.card.findMany({
            where: {
              cardSetId: existing.cardSetId,
              ...activeCardWhere(ctx.userId),
            },
            orderBy: { createdAt: "asc" },
          })
        : [existing];

      let primary = parseCardRecord(existing);

      for (const card of cardsToPublish) {
        const cardData = cardDataSchema.parse(card.cardData);
        const slug = card.slug ?? (await uniqueSlug(cardData.name));

        const updated = await prisma.card.update({
          where: { id: card.id },
          data: {
            published: true,
            publishedAt: new Date(),
            slug,
          },
        });

        const parsed = parseCardRecord(updated);
        if (parsed.id === input.id) {
          primary = parsed;
        }
      }

      return primary;
    }),

  setPublished: protectedProcedure
    .input(z.object({ id: z.string(), published: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await getOwnedActiveCard(ctx.userId, input.id);

      let slug = existing.slug;
      if (input.published && !slug) {
        const cardData = cardDataSchema.parse(existing.cardData);
        slug = await uniqueSlug(cardData.name);
      }

      const card = await prisma.card.update({
        where: { id: input.id },
        data: {
          published: input.published,
          publishedAt: input.published
            ? (existing.publishedAt ?? new Date())
            : null,
          slug: input.published ? slug : existing.slug,
        },
      });

      return parseCardRecord(card);
    }),

  getPublicBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const card = await prisma.card.findFirst({
        where: { slug: input.slug, published: true, deletedAt: null },
      });

      if (!card) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found." });
      }

      const billing = await getBillingProfile(card.userId);

      return {
        ...parseCardRecord(card),
        showBranding: !billing.isPro,
      };
    }),

  recordView: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        visitorId: z.string().min(1),
        referrer: z.string().optional(),
        utmSource: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const card = await prisma.card.findFirst({
        where: { slug: input.slug, published: true, deletedAt: null },
      });

      if (!card) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found." });
      }

      await recordCardView({
        cardId: card.id,
        visitorId: input.visitorId,
        referrer: input.referrer,
        utmSource: input.utmSource,
        headers: ctx.headers,
      });

      return { ok: true as const };
    }),

  recordLinkClick: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        visitorId: z.string().min(1),
        linkLabel: z.string().min(1),
        linkUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const card = await prisma.card.findFirst({
        where: { slug: input.slug, published: true, deletedAt: null },
      });

      if (!card) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Card not found." });
      }

      await recordCardLinkClick({
        cardId: card.id,
        visitorId: input.visitorId,
        linkLabel: input.linkLabel,
        linkUrl: input.linkUrl,
        headers: ctx.headers,
      });

      return { ok: true as const };
    }),
});

export type ParsedCard = ReturnType<typeof parseCardRecord> & {
  displayMode: CardDisplayMode;
};
