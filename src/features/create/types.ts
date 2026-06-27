import { z } from "zod";

import { PROFILE_WORD_LIMITS } from "@/lib/profile-limits";

// OpenAI structured output requires every property to be required.
// Use empty strings when a field is not found in the resume.
export const extractedCardDataSchema = z.object({
  name: z
    .string()
    .describe(
      "Person's name exactly as written in the resume header. A single name (mononym) is valid — never add a missing surname, initial, or second name.",
    ),
  title: z
    .string()
    .describe(
      "Current professional title or headline — short role label, not a sentence. Infer from most recent job if no explicit headline.",
    ),
  company: z
    .string()
    .describe(
      "Current or most recent employer organization name only — no dates or location. Empty string if none.",
    ),
  email: z
    .string()
    .describe(
      "Email address exactly as listed in contact section. Empty string if absent — never invent.",
    ),
  phone: z
    .string()
    .describe(
      "Phone number as listed (light normalization ok). Empty string if absent — never invent.",
    ),
  location: z
    .string()
    .describe(
      "City and region/country from contact or header (e.g. 'San Francisco, CA'). Empty string if absent.",
    ),
  website: z
    .string()
    .describe(
      "Personal website, portfolio, or LinkedIn URL if explicitly listed. Empty string if absent.",
    ),
  aboutYou: z
    .string()
    .describe(
      `Professional summary — max ${PROFILE_WORD_LIMITS.aboutYou} words, 2-3 sentences. If no summary exists, compose from skills and experience within the limit.`,
    ),
  experience: z
    .string()
    .describe(
      `Work experience as multiline text, max ${PROFILE_WORD_LIMITS.experience} words total. One role per line. If missing, suggest brief lines from job title within the limit.`,
    ),
  skills: z
    .array(z.string())
    .describe(
      `Up to ${PROFILE_WORD_LIMITS.skillsMaxCount} skill labels, max ${PROFILE_WORD_LIMITS.skillLabelMaxWords} words each. Infer from title or experience if absent.`,
    ),
});

export type ExtractedCardData = z.infer<typeof extractedCardDataSchema>;

const EXTRACTED_CARD_DATA_DEFAULTS = {
  name: "",
  title: "",
  company: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  aboutYou: "",
  experience: "",
  skills: [],
} satisfies ExtractedCardData;

/** Parse resume JSON from the database (backward-compatible with older rows). */
export function parseExtractedCardData(data: unknown): ExtractedCardData {
  const partial =
    typeof data === "object" && data !== null
      ? (data as Partial<ExtractedCardData>)
      : {};

  return extractedCardDataSchema.parse({
    ...EXTRACTED_CARD_DATA_DEFAULTS,
    ...partial,
    skills: Array.isArray(partial.skills) ? partial.skills : [],
  });
}

export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const ACCEPTED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_RESUME_SIZE_BYTES = 8 * 1024 * 1024;
