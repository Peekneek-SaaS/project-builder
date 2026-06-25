import type { CardTheme } from "@/lib/card-themes";

export const THEME_CATEGORY_ORDER = [
  "free",
  "minimalist",
  "modern",
  "professional",
  "luxury",
  "creative",
  "vintage",
  "bold",
  "geometric",
  "pattern-based",
  "tech-futuristic",
  "monochrome",
  "dark",
  "typography-focused",
  "abstract",
  "scandinavian",
] as const;

export type ThemeCategory = (typeof THEME_CATEGORY_ORDER)[number];

export type ThemePreviewField =
  | "initials"
  | "name"
  | "title"
  | "accentBar"
  | "accentDots"
  | "divider"
  | "tagline"
  | "pattern"
  | "sidebar"
  | "band"
  | "grid"
  | "orbit";

export type ThemePreviewLayout =
  | "stacked"
  | "centered"
  | "split"
  | "minimal"
  | "band-top"
  | "band-bottom"
  | "typography"
  | "geometric";

export type ThemePreviewConfig = {
  layout: ThemePreviewLayout;
  fields: ThemePreviewField[];
};

export const CATEGORY_LABELS: Record<ThemeCategory, string> = {
  free: "Free",
  minimalist: "Minimalist",
  modern: "Modern",
  professional: "Professional",
  luxury: "Luxury",
  creative: "Creative",
  vintage: "Vintage",
  bold: "Bold",
  geometric: "Geometric",
  "pattern-based": "Pattern-Based",
  "tech-futuristic": "Tech/Futuristic",
  monochrome: "Monochrome",
  "dark": "Dark",
  "typography-focused": "Typography-Focused",
  abstract: "Abstract",
  scandinavian: "Scandinavian",
};

export const CATEGORY_DESCRIPTIONS: Record<ThemeCategory, string> = {
  free: "Included with every account — pick one to get started.",
  minimalist: "Clean lines, quiet accents, nothing extra.",
  modern: "Contemporary layouts with confident color.",
  professional: "Polished and credible for work.",
  luxury: "Rich materials, premium presence.",
  creative: "Expressive palettes and playful structure.",
  vintage: "Warm, editorial, timeless character.",
  bold: "High contrast and strong typography.",
  geometric: "Shapes, frames, and structured grids.",
  "pattern-based": "Textures and repeating motifs.",
  "tech-futuristic": "Sharp, digital, forward-looking.",
  monochrome: "Black, white, and tonal restraint.",
  "dark": "Deep surfaces with luminous accents.",
  "typography-focused": "Type-led layouts with minimal chrome.",
  abstract: "Artful forms and asymmetric balance.",
  scandinavian: "Light, airy, and quietly refined.",
};

export const DEFAULT_CATEGORY_PREVIEW: Record<
  ThemeCategory,
  ThemePreviewConfig
> = {
  free: { layout: "minimal", fields: ["initials", "name", "divider"] },
  minimalist: { layout: "minimal", fields: ["name", "accentBar"] },
  modern: { layout: "stacked", fields: ["initials", "name", "accentBar"] },
  professional: {
    layout: "stacked",
    fields: ["initials", "name", "title", "accentBar"],
  },
  luxury: {
    layout: "band-top",
    fields: ["band", "initials", "name", "divider", "accentBar"],
  },
  creative: {
    layout: "centered",
    fields: ["initials", "name", "accentDots"],
  },
  vintage: {
    layout: "typography",
    fields: ["name", "title", "divider", "tagline"],
  },
  bold: { layout: "typography", fields: ["name", "accentBar"] },
  geometric: {
    layout: "geometric",
    fields: ["pattern", "initials", "name", "accentBar"],
  },
  "pattern-based": {
    layout: "stacked",
    fields: ["pattern", "name", "accentBar"],
  },
  "tech-futuristic": {
    layout: "split",
    fields: ["grid", "name", "title", "accentBar"],
  },
  monochrome: {
    layout: "minimal",
    fields: ["initials", "name", "divider"],
  },
  "dark": {
    layout: "stacked",
    fields: ["initials", "name", "accentBar"],
  },
  "typography-focused": {
    layout: "typography",
    fields: ["name", "title", "accentBar"],
  },
  abstract: { layout: "centered", fields: ["orbit", "name", "tagline"] },
  scandinavian: {
    layout: "minimal",
    fields: ["initials", "name", "accentBar"],
  },
};

export function getThemePreviewConfig(theme: CardTheme): ThemePreviewConfig {
  return theme.preview ?? DEFAULT_CATEGORY_PREVIEW[theme.category];
}

export function groupThemesByCategory(
  themes: CardTheme[],
): Partial<Record<ThemeCategory, CardTheme[]>> {
  const grouped: Partial<Record<ThemeCategory, CardTheme[]>> = {};

  for (const theme of themes) {
    const list = grouped[theme.category] ?? [];
    list.push(theme);
    grouped[theme.category] = list;
  }

  return grouped;
}

export function filterThemesByQuery(
  themes: CardTheme[],
  query: string,
): CardTheme[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return themes;

  return themes.filter((theme) => {
    const categoryLabel = CATEGORY_LABELS[theme.category].toLowerCase();
    return (
      theme.name.toLowerCase().includes(normalized) ||
      theme.description.toLowerCase().includes(normalized) ||
      theme.id.toLowerCase().includes(normalized) ||
      categoryLabel.includes(normalized)
    );
  });
}
