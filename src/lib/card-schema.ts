import { z } from "zod";

import { CARD_FIELD_KEYS } from "@/lib/card-field-utils";

const cardFieldStyleSchema = z.object({
  enabled: z.boolean(),
  color: z.string(),
  uppercase: z.boolean(),
  bold: z.boolean(),
  italic: z.boolean(),
  fontSize: z.number().int().min(0).max(50).optional().default(0),
});

const cardFieldSettingsSchema = z.object(
  Object.fromEntries(
    CARD_FIELD_KEYS.map((key) => [key, cardFieldStyleSchema]),
  ) as Record<(typeof CARD_FIELD_KEYS)[number], typeof cardFieldStyleSchema>,
);

export const cardLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const cardSideColorsSchema = z.object({
  background: z.string().optional(),
  text: z.string().optional(),
});

export const cardColorOverridesSchema = z
  .object({
    front: cardSideColorsSchema.optional(),
    back: cardSideColorsSchema.optional(),
    accent: z.string().optional(),
  })
  .optional();

export const cardDataSchema = z.object({
  name: z.string(),
  builderLabel: z.string().optional().default(""),
  title: z.string(),
  company: z.string(),
  logoUrl: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  bio: z.string().optional().default(""),
  experience: z.string().optional().default(""),
  skills: z.array(z.string()).optional().default([]),
  links: z.array(cardLinkSchema),
  fieldSettings: cardFieldSettingsSchema,
  customColors: cardColorOverridesSchema,
});

export const cardDisplayModeSchema = z.enum(["pair", "front", "back"]);

export type CardDataInput = z.infer<typeof cardDataSchema>;
