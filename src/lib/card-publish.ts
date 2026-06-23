import { cardDataSchema } from "@/lib/card-schema";
import { generateCardSlug } from "@/lib/card-slug";
import { prisma } from "@/lib/db";

export async function uniqueCardSlug(name: string): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = generateCardSlug(name);
    const existing = await prisma.card.findFirst({
      where: { slug, deletedAt: null },
      select: { id: true },
    });
    if (!existing) return slug;
  }

  return `${generateCardSlug(name)}-${Date.now().toString(36)}`;
}

/** Ensure a card reachable via QR has a slug and is published. */
export async function ensureCardLiveForQr(card: {
  id: string;
  slug: string | null;
  published: boolean;
  publishedAt: Date | null;
  cardData: unknown;
}): Promise<{ slug: string }> {
  const cardData = cardDataSchema.parse(card.cardData);
  const slug = card.slug ?? (await uniqueCardSlug(cardData.name));

  if (!card.published || !card.slug) {
    await prisma.card.update({
      where: { id: card.id },
      data: {
        published: true,
        publishedAt: card.publishedAt ?? new Date(),
        slug,
      },
    });
  }

  return { slug };
}
