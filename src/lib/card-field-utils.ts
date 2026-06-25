import type { CSSProperties } from "react";

import type { CardData } from "@/lib/card-data";
import { cn } from "@/lib/utils";

export type CardFieldKey =
  | "logo"
  | "company"
  | "tagline"
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
};

export type CardFieldSettings = Record<CardFieldKey, CardFieldStyle>;

export const CARD_FIELD_KEYS: CardFieldKey[] = [
  "logo",
  "company",
  "tagline",
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
  };
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
  return data.fieldSettings?.[key] ?? defaultFieldStyle();
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
  return settings.color ? { color: settings.color } : undefined;
}
