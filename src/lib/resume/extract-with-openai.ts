import "server-only";

import {
  extractedCardDataSchema,
  type ExtractedCardData,
} from "@/features/create/types";
import { ChatOpenAI } from "@langchain/openai";

export async function extractCardDataWithOpenAI(
  resumeText: string,
): Promise<ExtractedCardData> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const structured = model.withStructuredOutput(extractedCardDataSchema);

  const result = await structured.invoke([
    {
      role: "system",
      content: `You extract business-card details from resume text for a digital business card.

## Priority order
1. Use explicit values from the resume when they are clearly stated (header, summary, contact block, dedicated skills section).
2. If a field is missing, infer carefully using the rules below.
3. If you still cannot infer with reasonable confidence, use "" for single-value fields or [] for skills. Never guess contact details.

## Field rules

**name** — Full name from the resume header or top of document. Required if present anywhere.

**title** — Job title or professional headline.
- Prefer an explicit current title, headline, or role line if present.
- If no clear title, infer from the most recent (or current) work experience entry: use the job title from that role.
- If multiple roles exist, use the latest by date.
- Keep it short and professional (e.g. "Senior Product Designer", not a full sentence).
- Use "" only if there is no work history and no title-like text to infer from.

**company** — Current or most recent employer from work experience. Use "" if none found.

**email / phone / location** — Only extract if explicitly present. Normalize lightly (trim whitespace). Do not invent or fabricate. Use "" if absent.

**website** — Personal portfolio, LinkedIn URL, or personal site if listed. Use "" if absent.

**skills** — Up to 8 concise, professional skills (tools, technologies, domains, certifications).
- First: use an explicit skills/technologies/competencies section if present.
- If no skills section: infer from job titles, responsibilities, and technologies mentioned across work experience (e.g. "React", "Project Management", "Financial Modeling").
- Prefer skills strongly supported by multiple mentions or core to the person's role.
- Do not add generic filler (e.g. "Communication", "Teamwork") unless the resume heavily emphasizes them as primary strengths.
- Use [] only when work history and title give no reasonable basis to infer skills.

## General
- Prefer the most recent information when the resume spans many years.
- Do not include markdown, explanations, or extra fields.
- All string fields must be present; use "" when unknown. skills must be an array (empty if none).`,
    },
    {
      role: "user",
      content: `Extract business card details from this resume:\n\n${resumeText.slice(0, 12000)}`,
    },
  ]);

  return extractedCardDataSchema.parse(result);
}
