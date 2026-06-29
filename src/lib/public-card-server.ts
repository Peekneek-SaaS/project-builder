import "server-only";

import { cardDataSchema, cardDisplayModeSchema } from "@/lib/card-schema";
import type { CardData, CardDisplayMode } from "@/lib/card-data";
import { getBillingProfile } from "@/lib/billing";
import { ensureCardLiveForQr } from "@/lib/card-publish";
import { prisma } from "@/lib/db";

export type PublicCardPayload = {
  slug: string;
  themeId: string;
  cardData: CardData;
  displayMode: CardDisplayMode;
  showBranding: boolean;
};

export async function loadPublicCardByQrCodeId(
  qrCodeId: string,
): Promise<PublicCardPayload | null> {
  const normalized = qrCodeId.trim().toLowerCase();
  if (!normalized) return null;

  const card = await prisma.card.findFirst({
    where: {
      qrCodeId: { equals: normalized, mode: "insensitive" },
      deletedAt: null,
    },
  });

  if (!card) return null;

  const live = await ensureCardLiveForQr(card);
  if (!live) return null;

  const fresh = await prisma.card.findUnique({ where: { id: card.id } });
  if (!fresh?.published || !fresh.slug) return null;

  const billing = await getBillingProfile(fresh.userId);

  return {
    slug: fresh.slug,
    themeId: fresh.themeId,
    cardData: cardDataSchema.parse(fresh.cardData),
    displayMode: cardDisplayModeSchema.parse(fresh.displayMode),
    showBranding: !billing.isPro,
  };
}
