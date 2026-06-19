import { z } from "zod";

// OpenAI structured output requires every property to be required.
// Use empty strings when a field is not found in the resume.
export const extractedCardDataSchema = z.object({
  name: z.string().describe("Full name from resume header"),
  title: z
    .string()
    .describe(
      "Current job title or headline; if missing, infer from most recent work experience role",
    ),
  email: z.string().describe("Email if explicitly listed, else empty string"),
  phone: z.string().describe("Phone if explicitly listed, else empty string"),
  location: z
    .string()
    .describe("City/region if explicitly listed, else empty string"),
  skills: z
    .array(z.string())
    .describe(
      "Up to 8 professional skills; infer from work experience if no skills section, else empty array",
    ),
  company: z
    .string()
    .describe("Current or most recent employer from work experience"),
  website: z
    .string()
    .describe("Portfolio, LinkedIn, or personal URL if listed, else empty string"),
});

export type ExtractedCardData = z.infer<typeof extractedCardDataSchema>;

export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const ACCEPTED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_RESUME_SIZE_BYTES = 8 * 1024 * 1024;
