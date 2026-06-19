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
      content:
        "You extract business-card details from resume text. Return only information that is clearly present. Use empty strings for missing single-value fields and an empty array when no skills are found. Keep skills concise (max 8).",
    },
    {
      role: "user",
      content: `Extract business card details from this resume:\n\n${resumeText.slice(0, 12000)}`,
    },
  ]);

  return extractedCardDataSchema.parse(result);
}
