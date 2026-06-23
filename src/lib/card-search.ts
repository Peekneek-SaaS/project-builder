import type { CardData } from "@/lib/card-data";
import { getCardBuilderLabel } from "@/lib/card-data";
import { getTheme } from "@/lib/card-themes";

export type SearchableCard = {
  id: string;
  resumeId: string;
  cardSetId: string;
  themeId: string;
  cardData: Pick<CardData, "name" | "builderLabel" | "title" | "company">;
};

export function cardMatchesQuery(card: SearchableCard, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const theme = getTheme(card.themeId);
  const haystack = [
    getCardBuilderLabel(card.cardData),
    card.cardData.name,
    card.cardData.title,
    card.cardData.company,
    theme.name,
    theme.description,
  ]
    .filter(Boolean)
    .map((value) => value.toLowerCase());

  return haystack.some((value) => value.includes(q));
}

export function filterCardsByQuery<T extends SearchableCard>(
  cards: T[],
  query: string,
): T[] {
  const q = query.trim();
  if (!q) return cards;
  return cards.filter((card) => cardMatchesQuery(card, q));
}
