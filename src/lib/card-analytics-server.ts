import "server-only";

import {
  getGeoFromHeaders,
  parseTrafficSourceFromServer,
} from "@/lib/card-analytics";
import { prisma } from "@/lib/db";

export async function recordCardView(input: {
  cardId: string;
  visitorId: string;
  referrer?: string;
  utmSource?: string;
  headers: Headers;
}) {
  if (typeof prisma.cardView?.create !== "function") {
    await prisma.card.update({
      where: { id: input.cardId },
      data: { viewCount: { increment: 1 } },
    });
    return;
  }

  const geo = getGeoFromHeaders(input.headers);
  const source = parseTrafficSourceFromServer(
    input.referrer,
    input.utmSource,
  );

  try {
    await prisma.$transaction([
      prisma.cardView.create({
        data: {
          cardId: input.cardId,
          visitorId: input.visitorId,
          source,
          referrer: input.referrer?.slice(0, 500) ?? null,
          city: geo.city,
          country: geo.country,
        },
      }),
      prisma.card.update({
        where: { id: input.cardId },
        data: { viewCount: { increment: 1 } },
      }),
    ]);
  } catch {
    await prisma.card.update({
      where: { id: input.cardId },
      data: { viewCount: { increment: 1 } },
    });
  }
}

export async function recordCardLinkClick(input: {
  cardId: string;
  visitorId: string;
  linkLabel: string;
  linkUrl?: string;
  headers: Headers;
}) {
  if (typeof prisma.cardLinkClick?.create !== "function") {
    return;
  }

  const geo = getGeoFromHeaders(input.headers);

  try {
    await prisma.cardLinkClick.create({
      data: {
        cardId: input.cardId,
        visitorId: input.visitorId,
        linkLabel: input.linkLabel,
        linkUrl: input.linkUrl?.slice(0, 500) ?? null,
        city: geo.city,
        country: geo.country,
      },
    });
  } catch {
    // Ignore click tracking failures so public links still work.
  }
}
