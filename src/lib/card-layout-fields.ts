import {
  type CardFieldKey,
} from "@/lib/card-field-utils";
import type { CardLayout } from "@/lib/card-themes";
import { getTheme } from "@/lib/card-themes";

/** Same editable + renderable fields for every card theme. */
export const STANDARD_CARD_FIELDS: CardFieldKey[] = [
  "logo",
  "company",
  "tagline",
  "name",
  "title",
  "email",
  "phone",
  "location",
  "website",
];

export function getSupportedFieldsForLayout(
  _layout: CardLayout,
): ReadonlySet<CardFieldKey> {
  return new Set(STANDARD_CARD_FIELDS);
}

export function isFieldSupportedByLayout(
  layout: CardLayout,
  field: CardFieldKey,
): boolean {
  return getSupportedFieldsForLayout(layout).has(field);
}

export function isFieldSupportedByTheme(
  themeId: string,
  field: CardFieldKey,
): boolean {
  return isFieldSupportedByLayout(getTheme(themeId).layout, field);
}
