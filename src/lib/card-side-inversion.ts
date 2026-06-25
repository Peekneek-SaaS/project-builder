import type { CardLayout } from "@/lib/card-themes";

/**
 * Layouts where the authored CardFront/CardBack renderers are swapped relative
 * to the picker and export convention (brand/pattern first, contact second).
 */
export const INVERTED_CARD_SIDES = new Set<CardLayout>([
  "free-montreal-frame",
  "mod-rexora",
  "mod-vitvio",
  "mod-zight",
  "mod-southern",
  "mod-riwo",
  "mod-alpha",
  "studio-austerlitz",
]);

export function usesInvertedCardSides(layout: CardLayout): boolean {
  return INVERTED_CARD_SIDES.has(layout);
}
