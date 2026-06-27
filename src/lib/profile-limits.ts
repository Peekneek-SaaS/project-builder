export const PROFILE_WORD_LIMITS = {
  aboutYou: 75,
  experience: 100,
  skillsMaxCount: 10,
  skillLabelMaxWords: 3,
} as const;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function truncateToWordLimit(text: string, limit: number): string {
  if (!text.trim()) return text;

  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  let count = 0;
  let endIndex = text.length;

  while ((match = regex.exec(text)) !== null) {
    count += 1;
    if (count === limit) {
      endIndex = regex.lastIndex;
      break;
    }
    if (count > limit) {
      endIndex = match.index;
      break;
    }
  }

  if (count <= limit) return text;
  return text.slice(0, endIndex).replace(/[ \t]+$/, "");
}

export function truncateSkillLabel(label: string): string {
  return truncateToWordLimit(label.trim(), PROFILE_WORD_LIMITS.skillLabelMaxWords);
}

export function normalizeSkillsList(skills: string[]): string[] {
  return skills
    .map((skill) => truncateSkillLabel(skill))
    .filter(Boolean)
    .slice(0, PROFILE_WORD_LIMITS.skillsMaxCount);
}

export function skillsToDisplayText(skills: string[]): string {
  return skills.join("\n");
}

export function parseSkillsText(text: string): string[] {
  return normalizeSkillsList(
    text
      .split(/[\n,]+/)
      .map((skill) => skill.trim())
      .filter(Boolean),
  );
}

export function clampProfileFields(fields: {
  bio: string;
  experience: string;
  skills: string[];
}) {
  return {
    bio: truncateToWordLimit(fields.bio, PROFILE_WORD_LIMITS.aboutYou),
    experience: truncateToWordLimit(
      fields.experience,
      PROFILE_WORD_LIMITS.experience,
    ),
    skills: normalizeSkillsList(fields.skills),
  };
}

export function profileLimitHint(
  field: "aboutYou" | "experience" | "skills",
): string {
  switch (field) {
    case "aboutYou":
      return `Up to ${PROFILE_WORD_LIMITS.aboutYou} words`;
    case "experience":
      return `Up to ${PROFILE_WORD_LIMITS.experience} words`;
    case "skills":
      return `Up to ${PROFILE_WORD_LIMITS.skillsMaxCount} skills, ${PROFILE_WORD_LIMITS.skillLabelMaxWords} words each`;
  }
}
