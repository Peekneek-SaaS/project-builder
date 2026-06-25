import type { ExtractedCardData } from "@/features/create/types";
import {
  createDefaultFieldSettings,
  type CardFieldSettings,
} from "@/lib/card-field-utils";

export type { CardFieldKey, CardFieldSettings, CardFieldStyle } from "@/lib/card-field-utils";
export { createDefaultFieldSettings, defaultFieldStyle } from "@/lib/card-field-utils";

export type CardLink = {
  label: string;
  href: string;
};

export type CardDisplayMode = "pair" | "front" | "back";

export type CardData = {
  name: string;
  /** Builder-only display name (breadcrumb/tab). Does not appear on the card. */
  builderLabel: string;
  title: string;
  company: string;
  tagline: string;
  logoUrl: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  skills: string[];
  links: CardLink[];
  fieldSettings: CardFieldSettings;
};

export type BuilderCard = {
  id: string;
  themeId: string;
  data: CardData;
  displayMode: CardDisplayMode;
};

export function extractedToCardData(extracted: ExtractedCardData): CardData {
  const links: CardLink[] = [];
  if (extracted.website) {
    links.push({ label: "Website", href: extracted.website });
  }

  return {
    name: extracted.name,
    builderLabel: "",
    title: extracted.title,
    company: extracted.company,
    tagline: "",
    logoUrl: "",
    email: extracted.email,
    phone: extracted.phone,
    location: extracted.location,
    website: extracted.website,
    bio: "",
    skills: [...extracted.skills],
    links,
    fieldSettings: createDefaultFieldSettings(),
  };
}

export function getCardBuilderLabel(
  data: Pick<CardData, "name" | "builderLabel">,
): string {
  const label = data.builderLabel?.trim();
  if (label) return label;
  const name = data.name.trim();
  if (name) return name;
  return "Design";
}

export function cloneCardData(data: CardData): CardData {
  return {
    ...data,
    skills: [...data.skills],
    links: data.links.map((link) => ({ ...link })),
    fieldSettings: Object.fromEntries(
      Object.entries(data.fieldSettings ?? createDefaultFieldSettings()).map(
        ([key, value]) => [key, { ...value }],
      ),
    ) as CardData["fieldSettings"],
  };
}

/** Rich preview data for theme picker — fills gaps so cards look complete. */
const PREVIEW_DEFAULT_LINKS: CardLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Portfolio", href: "https://portfolio.com" },
  { label: "GitHub", href: "https://github.com" },
];

function fillPreviewLinks(links: CardLink[]): CardLink[] {
  if (links.length >= 2) return links;
  const merged = [...links];
  for (const link of PREVIEW_DEFAULT_LINKS) {
    if (merged.length >= 3) break;
    if (!merged.some((item) => item.label === link.label)) {
      merged.push(link);
    }
  }
  return merged;
}

export function buildThemePreviewData(
  extracted: ExtractedCardData | null,
): CardData {
  if (!extracted) {
    return {
      name: "Jordan Avery",
      builderLabel: "",
      title: "Senior Product Designer",
      company: "Northwind Studio",
      tagline: "Design that defines you",
      logoUrl: "",
      email: "jordan@northwind.studio",
      phone: "+1 (415) 555-0142",
      location: "San Francisco, CA",
      website: "jordanavery.design",
      bio: "Designer focused on clear product experiences, design systems, and thoughtful interaction details.",
      skills: ["Product Design", "Design Systems", "Prototyping", "Figma"],
      links: PREVIEW_DEFAULT_LINKS,
      fieldSettings: createDefaultFieldSettings(),
    };
  }

  const base = extractedToCardData(extracted);
  const title = extracted.title || "Professional";
  const company = extracted.company || "Your Company";

  return {
    ...base,
    name: base.name || "Your Name",
    title,
    company,
    tagline: base.tagline || `${company} — professional branding`,
    bio:
      base.bio ||
      `${title} focused on clear product experiences and thoughtful design work.`,
    skills:
      base.skills.length > 0
        ? base.skills
        : ["Product Design", "Collaboration", "Strategy"],
    email: base.email || "you@email.com",
    phone: base.phone || "+1 (555) 000-0000",
    location: base.location || "Your City",
    website: base.website || "yoursite.com",
    links: fillPreviewLinks(base.links),
  };
}
