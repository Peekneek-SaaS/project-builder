import { ensureCardLiveForQr } from "@/lib/card-publish";
import { prisma } from "@/lib/db";

export type QrRedirectResult =
  | { status: "redirect"; slug: string }
  | { status: "not_found" };

/** @deprecated Use loadPublicCardByQrCodeId — kept for tests/tools. */
export async function resolveQrRedirect(
  qrCodeId: string,
): Promise<QrRedirectResult> {
  const normalized = qrCodeId.trim().toLowerCase();
  if (!normalized) {
    return { status: "not_found" };
  }

  const card = await prisma.card.findFirst({
    where: {
      qrCodeId: { equals: normalized, mode: "insensitive" },
      deletedAt: null,
    },
    select: {
      id: true,
      slug: true,
      published: true,
      publishedAt: true,
      cardData: true,
    },
  });

  if (!card) {
    return { status: "not_found" };
  }

  const { slug } = await ensureCardLiveForQr(card);
  return { status: "redirect", slug };
}
