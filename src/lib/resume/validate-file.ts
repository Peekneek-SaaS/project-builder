import {
  ACCEPTED_RESUME_EXTENSIONS,
  ACCEPTED_RESUME_MIME_TYPES,
  MAX_RESUME_SIZE_BYTES,
} from "@/features/create/types";

export class ResumeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResumeValidationError";
  }
}

function getExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot).toLowerCase();
}

export function validateResumeFile(file: File) {
  const extension = getExtension(file.name);

  if (
    !ACCEPTED_RESUME_EXTENSIONS.includes(
      extension as (typeof ACCEPTED_RESUME_EXTENSIONS)[number],
    )
  ) {
    throw new ResumeValidationError(
      "Unsupported file type. Please upload a PDF, DOC, or DOCX resume.",
    );
  }

  if (
    file.type &&
    file.type !== "application/octet-stream" &&
    !ACCEPTED_RESUME_MIME_TYPES.includes(
      file.type as (typeof ACCEPTED_RESUME_MIME_TYPES)[number],
    )
  ) {
    throw new ResumeValidationError(
      "Unsupported file type. Please upload a PDF, DOC, or DOCX resume.",
    );
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    throw new ResumeValidationError("File is too large. Maximum size is 8MB.");
  }

  if (file.size === 0) {
    throw new ResumeValidationError("The selected file is empty.");
  }

  return { extension, mimeType: file.type || inferMimeType(extension) };
}

function inferMimeType(extension: string) {
  switch (extension) {
    case ".pdf":
      return "application/pdf";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
}

export function extensionFromFileName(fileName: string) {
  return getExtension(fileName).replace(".", "");
}
