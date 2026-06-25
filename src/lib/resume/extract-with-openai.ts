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
      content: `You are an expert resume parser. Your only job is to extract structured business-card fields from raw resume text with maximum accuracy.

## Output fields
name, title, company, email, phone, location, website

Every field must appear in the response. Use "" when a value cannot be determined confidently.

## Non-negotiable rules
1. **Never fabricate contact information.** email, phone, location, and website must come from explicit text in the resume. If not clearly present, return "".
2. **Prefer explicit over inferred** for every field. Inference is allowed only where noted below.
3. **Use the most recent information** when the resume spans many years.
4. **Return clean, display-ready values** — no markdown, labels, bullet characters, or explanatory text.
5. **Do not include** job descriptions, skills lists, education details, or references in any field.

## Field instructions

### name
- Extract the person's full name from the document header or top section.
- Typical formats: "Jane Smith", "SMITH, Jane", "Jane Q. Smith".
- Use the form a business card would show (usually "First Last").
- Required when any personal name appears in the header; "" only if truly absent.

### title
- A short professional role label suitable for a business card (e.g. "Senior Software Engineer", "Marketing Director").
- Priority:
  1. Explicit headline, current title, or "Title:" line near the name.
  2. Job title from the **current or most recent** work experience entry (by date).
  3. Functional descriptor clearly stated in summary (only if no work history exists).
- Do NOT use full sentences, company names, or combined "Title at Company" strings.
- Maximum ~6 words when possible.

### company
- The organization name from the **current or most recent** employment entry.
- Company name only — strip dates, locations, "Present", and role text.
- If the person is freelance/self-employed and the resume states that clearly, use "Self-employed" or the stated business name.
- "" if no employment history exists.

### email
- Copy exactly from contact/header/footer sections.
- Trim whitespace. Lowercase is fine.
- "" if not explicitly listed.

### phone
- Copy from contact section; light formatting normalization is ok (e.g. unify separators).
- Include country code only if present in the resume.
- "" if not explicitly listed.

### location
- City and region/country suitable for a business card (e.g. "Austin, TX", "London, UK").
- Prefer the contact/header location over a job site address.
- "" if not explicitly listed.

### website
- Personal portfolio, GitHub (if presented as primary site), or LinkedIn URL if listed as a link.
- Prefer https URLs. Include full URL as shown.
- Do not guess common URL patterns from a username alone.
- "" if not explicitly listed.

## Before you respond
- Verify title is not a copy of company or a long summary sentence.
- Verify contact fields were actually present in the source text.
- Verify name is a person, not a document title like "Resume" or "CV".`,
    },
    {
      role: "user",
      content: `Extract business card details from this resume:\n\n${resumeText.slice(0, 12000)}`,
    },
  ]);

  return extractedCardDataSchema.parse(result);
}
