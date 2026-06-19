import "server-only";

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export class ResumeExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResumeExtractionError";
  }
}

async function extractPdfText(buffer: Buffer) {
  if (!buffer.subarray(0, 4).toString("utf8").startsWith("%PDF")) {
    throw new ResumeExtractionError(
      "Downloaded file is not a valid PDF. Please upload again.",
    );
  }

  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  const normalized = text.trim();

  if (!normalized) {
    throw new ResumeExtractionError(
      "We couldn't read any text from this PDF. Try a text-based PDF instead of a scanned image.",
    );
  }

  return normalized;
}

async function extractDocxText(buffer: Buffer) {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value.trim();

  if (!text) {
    throw new ResumeExtractionError(
      "We couldn't read any text from this DOCX file.",
    );
  }

  return text;
}

export async function extractResumeText(buffer: Buffer, extension: string) {
  const normalized = extension.toLowerCase().replace(".", "");

  if (normalized === "pdf") {
    return extractPdfText(buffer);
  }

  if (normalized === "docx") {
    return extractDocxText(buffer);
  }

  if (normalized === "doc") {
    throw new ResumeExtractionError(
      "Legacy .doc files aren't supported yet. Please upload a PDF or DOCX file.",
    );
  }

  throw new ResumeExtractionError("Unsupported resume file type.");
}
