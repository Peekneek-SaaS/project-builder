import "server-only";

import {
  extractedCardDataSchema,
  type ExtractedCardData,
} from "@/features/create/types";
import { clampProfileFields, PROFILE_WORD_LIMITS } from "@/lib/profile-limits";
import { normalizeExtractedName } from "@/lib/resume/normalize-extracted-name";
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
      content: `You are an expert resume parser. Extract structured business-card and profile fields from raw resume text with maximum accuracy.

## Output fields
name, title, company, email, phone, location, website, aboutYou, experience, skills

Every field must appear in the response. Use "" or [] when a value cannot be determined confidently (except where inference is explicitly allowed below).

## Non-negotiable rules (contact fields)
1. **Never fabricate contact information.** email, phone, location, and website must come from explicit text in the resume. If not clearly present, return "".
2. **Prefer explicit over inferred** for name, title, company, and contact fields.
3. **Use the most recent information** when the resume spans many years.
4. **Return clean, display-ready values** — no markdown, labels, or bullet characters in contact/name fields.
5. Profile fields (aboutYou, experience, skills) **may be inferred** when absent, following the fallback rules below.

## Field instructions

### name
- PDF text may run words together (e.g. "NEERAJProfile", "NEERAJP"). Output **only** the person's name token — never merge in "Profile", initials, or letters from the next word/line.
- Copy the person's name from the **first header line(s)** — trim only extra whitespace. Use normal capitalization in output (e.g. "Neeraj", not "NEERAJP R").
- **Never invent, guess, split, or add** a missing first name, last name, middle name, or initial.
- If the resume shows **only one name** (mononym), return **that single name only**.
- Only use multiple words when **each word is clearly part of the person's name** in the header.
- Do **NOT** derive name parts from email usernames (e.g. neerajp@… → "Neeraj" only if "Neeraj" appears as the header name, not "Neerajp").
- Do **NOT** use document titles ("Resume", "CV") or section headings as the name.
- "" only if no personal name appears in the header area.

### title
- A short professional role label suitable for a business card (e.g. "Senior Software Engineer").
- Priority: explicit headline → most recent job title → summary descriptor.
- Maximum ~6 words when possible.

### company
- The organization from the **current or most recent** employment entry.
- Company name only — strip dates, locations, and role text.
- "" if no employment history exists.

### email, phone, location, website
- Copy from contact sections only. Never invent.
- "" if not explicitly listed.

### aboutYou
- Extract a professional summary from Profile, Summary, or About sections.
- **Hard limit: ${PROFILE_WORD_LIMITS.aboutYou} words maximum.** Prefer 2–3 short sentences.
- **Fallback:** if no summary section exists, write a concise paragraph synthesizing skills and experience within the word limit. Do not invent employers or credentials not supported by the resume.

### experience
- Summarize work history as multiline plain text (use \\n between roles).
- Each line: "Title at Company (Start – End)" or a short role summary with dates when available.
- Most recent roles first. Include only as many roles as fit in **${PROFILE_WORD_LIMITS.experience} words maximum**.
- **Fallback:** if no work history exists but **title** is known, suggest 2–3 short generic experience lines typical for that title (no fake company names), within the word limit.
- "" only if neither work history nor title is available.

### skills
- Extract from Skills, Technologies, or Competencies sections as short labels (${PROFILE_WORD_LIMITS.skillLabelMaxWords} words max each).
- **Hard limit: ${PROFILE_WORD_LIMITS.skillsMaxCount} skills maximum.**
- **Fallback order:**
  1. If skills section is missing but **title** is known → infer up to ${PROFILE_WORD_LIMITS.skillsMaxCount} skills typical for that title.
  2. If title is also missing → infer from **experience** text.
- Return [] only if nothing can be inferred.

## Before you respond
- Verify the name matches the header **verbatim** — if only one name is shown, output one name only.
- Verify contact fields were actually present in the source text.
- Verify title is not a copy of company or a long summary sentence.
- Verify aboutYou, experience, and skills are coherent with each other.
- **Verify aboutYou ≤ ${PROFILE_WORD_LIMITS.aboutYou} words, experience ≤ ${PROFILE_WORD_LIMITS.experience} words, skills ≤ ${PROFILE_WORD_LIMITS.skillsMaxCount} items.**`,
    },
    {
      role: "user",
      content: `Extract business card and profile details from this resume:\n\n${resumeText.slice(0, 12000)}`,
    },
  ]);

  const parsed = extractedCardDataSchema.parse(result);
  const profile = clampProfileFields({
    bio: parsed.aboutYou,
    experience: parsed.experience,
    skills: parsed.skills,
  });

  return {
    ...parsed,
    name: normalizeExtractedName(parsed.name, resumeText),
    aboutYou: profile.bio,
    experience: profile.experience,
    skills: profile.skills,
  };
}
