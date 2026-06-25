import type { ExtractedCardData } from "@/features/create/types";

export type ResumeHistoryRecord = {
  fileName: string;
  fileUrl: string;
  fileKey?: string;
  rawText?: string | null;
  extractedData: Pick<ExtractedCardData, "name">;
};

/** Resumes created via upload + AI extraction (excludes skip/blank and empty names). */
export function isUploadedResumeHistoryItem(
  resume: ResumeHistoryRecord,
): boolean {
  if (resume.fileKey === "manual") return false;
  if (resume.fileName === "No resume uploaded") return false;
  if (!resume.fileUrl.trim()) return false;
  if (resume.rawText == null || resume.rawText.trim() === "") return false;
  if (!resume.extractedData.name.trim()) return false;
  return true;
}
