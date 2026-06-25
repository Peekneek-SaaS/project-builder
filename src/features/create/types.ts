import { z } from "zod";

// OpenAI structured output requires every property to be required.
// Use empty strings when a field is not found in the resume.
export const extractedCardDataSchema = z.object({
  name: z
    .string()
    .describe(
      "Full legal or professional name from the resume header (first + last). Empty string if not found.",
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
});

export type ExtractedCardData = z.infer<typeof extractedCardDataSchema>;

export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const ACCEPTED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_RESUME_SIZE_BYTES = 8 * 1024 * 1024;
