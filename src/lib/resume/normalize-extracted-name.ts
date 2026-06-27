const SECTION_HEADING =
  /^(experience|education|skills|summary|about|profile|contact|work history|employment|projects|certifications|objective|references)/i;

const CONTACT_LINE = /[@/]|https?:|www\.|linkedin|github|\+?\d[\d\s().-]{7,}/i;

const BLOCKLIST = new Set([
  "resume",
  "cv",
  "curriculum",
  "vitae",
  "profile",
  "contact",
  "email",
  "phone",
]);

function formatDisplayName(raw: string): string {
  const word = raw.trim();
  if (!word) return "";

  if (/^[A-Z]{2,}$/.test(word)) {
    return word.charAt(0) + word.slice(1).toLowerCase();
  }

  if (/^[a-z]+$/.test(word)) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  if (/^[A-Z][a-z]+$/.test(word)) {
    return word;
  }

  return word
    .split(/([\s-'])/)
    .map((part) => {
      if (!part || /[\s-']/.test(part)) return part;
      if (/^[A-Z]{2,}$/.test(part)) {
        return part.charAt(0) + part.slice(1).toLowerCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}

function isNameToken(token: string): boolean {
  const cleaned = token.replace(/[.,;:]+$/, "");
  if (cleaned.length < 2) return false;
  if (BLOCKLIST.has(cleaned.toLowerCase())) return false;
  if (/^\d/.test(cleaned)) return false;
  return /^[\p{L}][\p{L}'-]*$/u.test(cleaned) || /^[A-Z]{2,}$/.test(cleaned);
}

/** Split PDF-glued tokens like NEERAJProfile or NeerajProfile. */
function peelLeadingNameToken(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // ALL CAPS name glued to TitleCase word: NEERAJProfile
  const allCapsGlued = trimmed.match(/^([A-Z]{2,})(?=[A-Z][a-z])/);
  if (allCapsGlued?.[1] && isNameToken(allCapsGlued[1])) {
    return allCapsGlued[1];
  }

  // TitleCase name glued to another word: NeerajProfile
  const titleGlued = trimmed.match(/^([A-Z][a-z]{1,})(?=[A-Z][a-z])/);
  if (titleGlued?.[1] && isNameToken(titleGlued[1])) {
    return titleGlued[1];
  }

  // Name followed by space and a stray single letter: NEERAJP R, NEERAJ P
  const spaced = trimmed.match(/^([A-Za-z]{2,})\s+[A-Za-z]?$/);
  if (spaced?.[1]) {
    const peeled = peelLeadingNameToken(spaced[1]) ?? spaced[1];
    if (isNameToken(peeled)) return peeled;
  }

  // Single token line with trailing letter from next PDF word: NEERAJP
  const trailingLetter = trimmed.match(/^([A-Z]{2,})[A-Z]$/);
  if (trailingLetter?.[1] && isNameToken(trailingLetter[1])) {
    return trailingLetter[1];
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length >= 2 && words.length <= 4) {
    const first = words[0]?.replace(/[.,;:]+$/, "") ?? "";
    const peeledFirst = peelLeadingNameToken(first) ?? first;

    if (
      isNameToken(peeledFirst.split(/\s+/)[0] ?? peeledFirst) &&
      words.slice(1).every((word) => word.replace(/[.,;:]+$/, "").length <= 1)
    ) {
      return peeledFirst.split(/\s+/)[0] ?? peeledFirst;
    }

    if (words.every((word) => isNameToken(word.replace(/[.,;:]+$/, "")))) {
      return words
        .map((word) => peelLeadingNameToken(word.replace(/[.,;:]+$/, "")) ?? word)
        .join(" ");
    }

    if (isNameToken(peeledFirst.split(/\s+/)[0] ?? peeledFirst)) {
      return peeledFirst.split(/\s+/)[0] ?? peeledFirst;
    }
  }

  if (words.length === 1) {
    const word = words[0].replace(/[.,;:]+$/, "");
    const trailing = word.match(/^([A-Z]{2,})[A-Z]$/);
    if (trailing?.[1] && isNameToken(trailing[1])) {
      return trailing[1];
    }
    if (isNameToken(word)) return word;
    return null;
  }

  return null;
}

function isHeaderLine(line: string): boolean {
  if (!line.trim()) return false;
  if (line.length > 80) return false;
  if (CONTACT_LINE.test(line)) return false;
  if (SECTION_HEADING.test(line.trim())) return false;
  return true;
}

/** Best-effort name read from the resume header (handles PDF glue). */
export function findNameInHeader(resumeText: string): string | null {
  const lines = resumeText
    .slice(0, 1500)
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 12)) {
    if (!isHeaderLine(line)) continue;

    const candidate = peelLeadingNameToken(line);
    if (candidate && isNameToken(candidate.split(/\s+/)[0] ?? candidate)) {
      return formatDisplayName(candidate);
    }
  }

  return null;
}

function compactAlpha(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function extractedLooksCorrupted(extracted: string, headerName: string): boolean {
  const extractedCompact = compactAlpha(extracted);
  const headerCompact = compactAlpha(headerName);

  if (!extractedCompact || !headerCompact) return false;
  if (extractedCompact === headerCompact) return false;

  // NEERAJP R vs Neeraj — header is a clean prefix of the glued extraction.
  if (
    extractedCompact.startsWith(headerCompact) &&
    extractedCompact.length > headerCompact.length
  ) {
    return true;
  }

  const extractedWords = extracted.trim().split(/\s+/);
  if (
    extractedWords.length >= 2 &&
    (extractedWords[extractedWords.length - 1]?.length ?? 0) <= 1
  ) {
    return true;
  }

  // Single glued token longer than header mononym, sharing prefix.
  if (
    extractedWords.length === 1 &&
    extractedCompact.startsWith(headerCompact) &&
    extractedCompact.length - headerCompact.length <= 2
  ) {
    return true;
  }

  return false;
}

/** Normalize name against source text — prefers header, drops PDF glue / hallucinations. */
export function normalizeExtractedName(
  name: string,
  resumeText: string,
): string {
  const trimmed = name.trim().replace(/\s+/g, " ");
  const headerName = findNameInHeader(resumeText);

  if (headerName) {
    if (!trimmed) return headerName;

    const trimmedCompact = compactAlpha(trimmed);
    const headerCompact = compactAlpha(headerName);

    if (trimmedCompact === headerCompact) {
      return headerName;
    }

    if (extractedLooksCorrupted(trimmed, headerName)) {
      return headerName;
    }

    const header = resumeText.slice(0, 1200);
    if (!header.toLowerCase().includes(trimmed.toLowerCase())) {
      if (header.toLowerCase().includes(headerName.toLowerCase())) {
        return headerName;
      }
    }
  }

  if (!trimmed) return headerName ?? "";

  const header = resumeText.slice(0, 1200);
  const headerLower = header.toLowerCase();

  if (headerLower.includes(trimmed.toLowerCase())) {
    return formatDisplayName(trimmed);
  }

  const words = trimmed.split(" ");

  for (let count = words.length; count >= 1; count -= 1) {
    const candidate = words.slice(0, count).join(" ");
    if (headerLower.includes(candidate.toLowerCase())) {
      return formatDisplayName(candidate);
    }
  }

  const peeled = peelLeadingNameToken(trimmed);
  if (peeled && headerLower.includes(peeled.toLowerCase())) {
    return formatDisplayName(peeled);
  }

  if (headerName) return headerName;

  return formatDisplayName(trimmed);
}
