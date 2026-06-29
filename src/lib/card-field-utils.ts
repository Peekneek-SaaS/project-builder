import type { CSSProperties } from "react";

import type { CardData } from "@/lib/card-data";
import { cn } from "@/lib/utils";

export type CardFieldKey =
  | "logo"
  | "company"
  | "name"
  | "title"
  | "email"
  | "phone"
  | "location"
  | "website"
  | "bio"
  | "skills"
  | "links";

export type CardFieldStyle = {
  enabled: boolean;
  color: string;
  uppercase: boolean;
  bold: boolean;
  italic: boolean;
  /** px; 0 = theme/layout default */
  fontSize: number;
};

export const CARD_FIELD_FONT_SIZES = [
  2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40,
  42, 44, 46, 48, 50,
] as const;

export type CardFieldFontSize = (typeof CARD_FIELD_FONT_SIZES)[number];

export type CardFieldSettings = Record<CardFieldKey, CardFieldStyle>;

export const CARD_FIELD_KEYS: CardFieldKey[] = [
  "logo",
  "company",
  "name",
  "title",
  "email",
  "phone",
  "location",
  "website",
  "bio",
  "skills",
  "links",
];

const DEPRECATED_FIELD_KEYS = new Set<CardFieldKey>(["bio", "skills", "links"]);

export function defaultFieldStyle(): CardFieldStyle {
  return {
    enabled: true,
    color: "",
    uppercase: false,
    bold: false,
    italic: false,
    fontSize: 0,
  };
}

/** Caps user font size so text stays inside the card shell. */
export function getFieldFontSizeCSSValue(fontSize: number): string {
  return `min(${fontSize}px, 8.5cqw, 11cqh)`;
}

/** Caps logo mark dimensions relative to the card shell. */
export function getLogoMarkSizeStyle(fontSize: number): CSSProperties | undefined {
  if (fontSize <= 0) return undefined;
  return {
    maxHeight: `min(${fontSize * 2.5}px, 18cqh)`,
    maxWidth: `min(${fontSize * 4}px, 32cqw)`,
    width: "auto",
    height: "auto",
  };
}

export function normalizeFieldFontSize(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return 0;
  return CARD_FIELD_FONT_SIZES.includes(value as CardFieldFontSize) ? value : 0;
}

export function createDefaultFieldSettings(): CardFieldSettings {
  return Object.fromEntries(
    CARD_FIELD_KEYS.map((key) => [
      key,
      {
        ...defaultFieldStyle(),
        enabled: !DEPRECATED_FIELD_KEYS.has(key),
      },
    ]),
  ) as CardFieldSettings;
}

export function getFieldSettings(
  data: CardData,
  key: CardFieldKey,
): CardFieldStyle {
  const settings = data.fieldSettings?.[key] ?? defaultFieldStyle();
  return {
    ...settings,
    fontSize: normalizeFieldFontSize(settings.fontSize),
  };
}

export function isFieldEnabled(data: CardData, key: CardFieldKey): boolean {
  return getFieldSettings(data, key).enabled;
}

export function getFieldClassName(
  settings: CardFieldStyle,
  className?: string,
): string {
  return cn(
    className,
    settings.bold && "font-bold",
    settings.italic && "italic",
    settings.uppercase ? "uppercase" : "normal-case",
  );
}

export function getFieldInlineStyle(
  settings: CardFieldStyle,
): CSSProperties | undefined {
  const style: CSSProperties = {};
  if (settings.color) style.color = settings.color;
  if (settings.fontSize > 0) {
    style.fontSize = getFieldFontSizeCSSValue(settings.fontSize);
  }
  return Object.keys(style).length > 0 ? style : undefined;
}
