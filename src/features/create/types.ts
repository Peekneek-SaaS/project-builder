import { z } from "zod";

// OpenAI structured output requires every property to be required.
// Use empty strings when a field is not found in the resume.
export const extractedCardDataSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  skills: z.array(z.string()),
  company: z.string(),
  website: z.string(),
});

export type ExtractedCardData = z.infer<typeof extractedCardDataSchema>;

export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const ACCEPTED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_RESUME_SIZE_BYTES = 8 * 1024 * 1024;
