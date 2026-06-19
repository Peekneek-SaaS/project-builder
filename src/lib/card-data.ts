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
export function buildThemePreviewData(
  extracted: ExtractedCardData | null,
): CardData {
  if (!extracted) {
    return {
      name: "Jordan Avery",
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
      links: [
        { label: "LinkedIn", href: "#" },
        { label: "Portfolio", href: "#" },
      ],
      fieldSettings: createDefaultFieldSettings(),
    };
  }

  const base = extractedToCardData(extracted);
  const title = extracted.title || "Professional";
  const company = extracted.company || "Your Company";

  return {
    ...base,
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
    links:
      base.links.length > 0
        ? base.links
        : [{ label: "Portfolio", href: "#" }],
  };
}
