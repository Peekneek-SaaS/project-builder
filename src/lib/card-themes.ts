import type { ThemeCategory, ThemePreviewConfig } from "@/lib/theme-categories";

export type CardLayout =
  | "classic"
  | "brand-center"
  | "brand-bar"
  | "split-sidebar"
  | "minimal-dark"
  | "minimal-hatch"
  | "minimal-botanical"
  | "minimal-studio"
  | "band-header"
  | "skyline"
  | "watermark"
  | "arc-frame"
  | "horizontal"
  | "job-hi"
  | "job-chevron"
  | "job-art-frame"
  | "job-photo-split"
  | "job-zing-brand"
  | "job-zing-dark"
  | "job-notice"
  | "job-organic"
  | "job-arch-split"
  | "job-electric-plug"
  | "job-electric-service"
  | "job-electric-split"
  | "job-type-stack"
  | "job-diagonal"
  | "job-legal"
  | "job-rocket-pattern"
  | "job-terra"
  | "job-terra-law"
  | "job-restaurant"
  | "job-agency"
  | "job-hello-stack"
  | "job-vibrant"
  | "mod-rexora"
  | "mod-codai"
  | "mod-rollux"
  | "mod-taylor"
  | "mod-dentist"
  | "mod-vitvio"
  | "mod-solara"
  | "mod-solara-brand"
  | "mod-zight"
  | "mod-wedding"
  | "mod-cara"
  | "mod-alpha"
  | "mod-caleb"
  | "mod-naturopathy"
  | "mod-maya"
  | "mod-southern"
  | "mod-riwo";

export type CardOrientation = "portrait" | "landscape";
export type CardSize = "sm" | "md" | "lg";

export type CardTheme = {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  /** Override category default preview structure, layout, and fields. */
  preview?: ThemePreviewConfig;
  layout: CardLayout;
  orientation: CardOrientation;
  size: CardSize;
  /** @deprecated Use getThemeStyleClasses(theme.id) */
  surface: string;
  text: string;
  subtext: string;
  accent: string;
  accentText: string;
  pro?: boolean;
};

const base = (
  theme: Omit<
    CardTheme,
    "surface" | "text" | "subtext" | "accent" | "accentText"
  > &
    Partial<
      Pick<CardTheme, "surface" | "text" | "subtext" | "accent" | "accentText">
    >,
): CardTheme => ({
  surface: "bg-slate-900",
  text: "text-white",
  subtext: "text-slate-400",
  accent: "bg-blue-500",
  accentText: "text-blue-400",
  ...theme,
});

export const cardThemes: CardTheme[] = [
  base({
    id: "rob-hatch",
    name: "Rob Hatch",
    description: "Dark hatched mark front with editorial watermark back.",
    category: "minimalist",
    preview: {
      layout: "geometric",
      fields: ["pattern", "name", "accentBar"],
    },
    layout: "minimal-hatch",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-neutral-900",
    subtext: "text-neutral-500",
    accent: "bg-neutral-900",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "sage-botanical",
    name: "Sage Botanical",
    description: "Sage front with botanical mark and cream contact back.",
    category: "minimalist",
    preview: {
      layout: "centered",
      fields: ["pattern", "name", "title", "band"],
    },
    layout: "minimal-botanical",
    orientation: "landscape",
    size: "md",
    surface: "bg-stone-100",
    text: "text-stone-800",
    subtext: "text-stone-600",
    accent: "bg-amber-500",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "studio-split",
    name: "Studio Split",
    description: "Monochrome brand front with split logo back.",
    category: "minimalist",
    preview: {
      layout: "split",
      fields: ["sidebar", "name", "title", "accentBar"],
    },
    layout: "minimal-studio",
    orientation: "landscape",
    size: "lg",
    surface: "bg-stone-200",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),

  // Former job themes — recategorized
  base({
    id: "hi-greeting",
    name: "Hi Greeting",
    description: "Bold hi! front with structured contact and social back.",
    category: "dark",
    layout: "job-hi",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#1a1d21]",
    text: "text-white",
    subtext: "text-neutral-400",
    accent: "bg-white",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "electrician-plug",
    name: "Electrician Plug",
    description: "Black front with plug icon and service details back.",
    category: "professional",
    layout: "job-electric-plug",
    orientation: "landscape",
    size: "lg",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "electrician-split",
    name: "Electrician Split",
    description: "Plus/minus split card for electrical trades.",
    category: "professional",
    layout: "job-electric-split",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "electrician-service",
    name: "Electrician Service",
    description: "Trade-focused layout with bold plug mark.",
    category: "professional",
    layout: "job-electric-service",
    orientation: "landscape",
    size: "lg",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-500",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "art-director",
    name: "Art Director",
    description: "Framed ART branding with split name and contact back.",
    category: "creative",
    layout: "job-art-frame",
    orientation: "landscape",
    size: "lg",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-500",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "graphic-designer",
    name: "Graphic Designer",
    description: "Typographic stack front with contact grid back.",
    category: "typography-focused",
    layout: "job-type-stack",
    orientation: "landscape",
    size: "lg",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-500",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "interior-hello",
    name: "Interior Hello",
    description: "Layered hello front with diagonal contact split back.",
    category: "creative",
    layout: "job-diagonal",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-500",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "photographer",
    name: "Photographer",
    description: "Split cream and black with camera silhouette.",
    category: "creative",
    layout: "job-photo-split",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#f2f0e9]",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "architect-nirman",
    name: "Architect Nirman",
    description: "Forest green front with stylized N and contact back.",
    category: "professional",
    layout: "job-arch-split",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-[#1e7e58]",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "restaurant-coast",
    name: "Restaurant Coast",
    description: "Fish logo with two-column contact layout.",
    category: "creative",
    layout: "job-restaurant",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#f2f2f2]",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "legal-dantas",
    name: "Legal Dantas",
    description: "Chocolate brown law firm branding with pattern strip.",
    category: "professional",
    layout: "job-legal",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#f5f0e8]",
    text: "text-[#3d2b1f]",
    subtext: "text-[#6b5344]",
    accent: "bg-[#3d2b1f]",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "accounting-nathalia",
    name: "Accounting Nathalia",
    description: "Vibrant orange card with watermark logo back.",
    category: "bold",
    layout: "job-terra",
    orientation: "landscape",
    size: "lg",
    surface: "bg-[#f5f5f5]",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-[#FF5A1F]",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "law-tera",
    name: "Law Consultant TERA",
    description: "Cream brand front with geometric law consultant styling.",
    category: "professional",
    layout: "job-terra-law",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#f5f5f5]",
    text: "text-[#FF5A1F]",
    subtext: "text-[#FF5A1F]/80",
    accent: "bg-[#FF5A1F]",
    accentText: "text-white",
    pro: true,
  }),

  // Professional
  base({
    id: "company-chevron",
    name: "Company Chevron",
    description: "Patterned dark front with cropped logo contact back.",
    category: "professional",
    layout: "job-chevron",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#f5f0e8]",
    text: "text-[#1a2e28]",
    subtext: "text-[#1a2e28]/70",
    accent: "bg-[#1a2e28]",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "rocket-square",
    name: "Rocket Square",
    description: "Green circle pattern with QR contact block.",
    category: "professional",
    layout: "job-rocket-pattern",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-[#00332B]",
    subtext: "text-[#00332B]/70",
    accent: "bg-[#00332B]",
    accentText: "text-white",
    pro: true,
  }),

  // Bold
  base({
    id: "zing-orange",
    name: "Zing Orange",
    description: "Textured orange brand front with centered wordmark.",
    category: "bold",
    layout: "job-zing-brand",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#E87735]",
    text: "text-black",
    subtext: "text-black/70",
    accent: "bg-black",
    accentText: "text-black",
    pro: true,
  }),
  base({
    id: "zing-dark",
    name: "Zing Dark",
    description: "Charcoal card with gradient letter watermarks.",
    category: "bold",
    layout: "job-zing-dark",
    orientation: "landscape",
    size: "lg",
    surface: "bg-[#1a1d21]",
    text: "text-white",
    subtext: "text-neutral-400",
    accent: "bg-orange-500",
    accentText: "text-orange-400",
    pro: true,
  }),
  base({
    id: "notice-mustard",
    name: "Notice Mustard",
    description: "Mustard yellow with oversized N and contact blocks.",
    category: "bold",
    layout: "job-notice",
    orientation: "landscape",
    size: "lg",
    surface: "bg-[#E5C033]",
    text: "text-[#2D2D2D]",
    subtext: "text-[#2D2D2D]/70",
    accent: "bg-[#2D2D2D]",
    accentText: "text-[#2D2D2D]",
    pro: true,
  }),

  // Dark
  base({
    id: "hi-minimal",
    name: "Hi Minimal",
    description: "Dark charcoal hi! greeting card.",
    category: "dark",
    layout: "job-hi",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#1a1d21]",
    text: "text-white",
    subtext: "text-neutral-400",
    accent: "bg-white",
    accentText: "text-white",
    pro: true,
  }),

  // Creative
  base({
    id: "agency-clever",
    name: "Agency Clever",
    description: "Centered chevron logo for creative agencies.",
    category: "creative",
    layout: "job-agency",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),

  // Abstract
  base({
    id: "organic-kevin",
    name: "Organic Kevin",
    description: "Black and white organic blob shapes.",
    category: "abstract",
    layout: "job-organic",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),

  // Monochrome
  base({
    id: "hello-stack",
    name: "Hello Stack",
    description: "Layered HELLO typography on black.",
    category: "monochrome",
    layout: "job-hello-stack",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-500",
    accent: "bg-black",
    accentText: "text-white",
    pro: true,
  }),

  // Modern
  base({
    id: "vibrant-pro",
    name: "Vibrant Pro",
    description: "Clean vibrant layout for modern professionals.",
    category: "modern",
    layout: "job-vibrant",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-slate-900",
    subtext: "text-slate-500",
    accent: "bg-blue-600",
    accentText: "text-blue-600",
    pro: true,
  }),
  base({
    id: "rexora-avenix",
    name: "Rexora Avenix",
    description: "Black and yellow contrast with bold brand back.",
    category: "modern",
    layout: "mod-rexora",
    orientation: "landscape",
    size: "md",
    surface: "bg-black",
    text: "text-white",
    subtext: "text-neutral-400",
    accent: "bg-[#FEE101]",
    accentText: "text-[#FEE101]",
    pro: true,
  }),
  base({
    id: "codai-lime",
    name: "Codai Lime",
    description: "Chartreuse card with faded logo watermark.",
    category: "modern",
    layout: "mod-codai",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#D4F56A]",
    text: "text-black",
    subtext: "text-black/70",
    accent: "bg-black",
    accentText: "text-black",
    pro: true,
  }),
  base({
    id: "codai-slate",
    name: "Codai Slate",
    description: "Cool gray tech card with watermark logo.",
    category: "modern",
    layout: "mod-codai",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#E8EAED]",
    text: "text-black",
    subtext: "text-black/65",
    accent: "bg-black",
    accentText: "text-black",
    pro: true,
  }),
  base({
    id: "codai-forest",
    name: "Codai Forest",
    description: "Deep green tech layout with accent square.",
    category: "modern",
    layout: "mod-codai",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#1B3D2F]",
    text: "text-white",
    subtext: "text-white/75",
    accent: "bg-[#D4F56A]",
    accentText: "text-[#D4F56A]",
    pro: true,
  }),
  base({
    id: "rollux-mint",
    name: "Rollux Mint",
    description: "Mint brand front with matte black contact back.",
    category: "modern",
    layout: "mod-rollux",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#1A1A1A]",
    text: "text-white",
    subtext: "text-neutral-400",
    accent: "bg-[#98D8A0]",
    accentText: "text-[#98D8A0]",
    pro: true,
  }),
  base({
    id: "taylor-green",
    name: "Taylor Green",
    description: "Forest green serif wordmark with corner contact back.",
    category: "minimalist",
    layout: "mod-taylor",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#2d4c3b]",
    text: "text-white",
    subtext: "text-white/75",
    accent: "bg-white",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "dentist-sage",
    name: "Dentist Sage",
    description: "Sage clinical front with services contact back.",
    category: "professional",
    layout: "mod-dentist",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#7BA08D]",
    text: "text-white",
    subtext: "text-white/85",
    accent: "bg-white",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "vitvio-mint",
    name: "VitVio Mint",
    description: "Mint name block with large logo icon.",
    category: "modern",
    layout: "mod-vitvio",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#F2F2F2]",
    text: "text-black",
    subtext: "text-black/60",
    accent: "bg-[#00D18B]",
    accentText: "text-black",
    pro: true,
  }),
  base({
    id: "solara-dark",
    name: "Solara Dark",
    description: "Matte black card with corner-aligned contact grid.",
    category: "modern",
    layout: "mod-solara",
    orientation: "landscape",
    size: "md",
    surface: "bg-black",
    text: "text-white",
    subtext: "text-neutral-400",
    accent: "bg-white",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "solara-lime",
    name: "Solara Lime",
    description: "Electric lime brand front with dark contact back.",
    category: "modern",
    layout: "mod-solara-brand",
    orientation: "landscape",
    size: "md",
    surface: "bg-black",
    text: "text-white",
    subtext: "text-neutral-400",
    accent: "bg-[#BFFF00]",
    accentText: "text-black",
    pro: true,
  }),
  base({
    id: "zight-orange",
    name: "Zight Orange",
    description: "Textured orange contact front with centered wordmark back.",
    category: "modern",
    layout: "mod-zight",
    orientation: "landscape",
    size: "md",
    surface: "bg-black",
    text: "text-white",
    subtext: "text-neutral-400",
    accent: "bg-[#E85C24]",
    accentText: "text-black",
    pro: true,
  }),
  base({
    id: "wedding-sage",
    name: "Wedding Sage",
    description: "Script name over debossed keyword with star-rated back.",
    category: "vintage",
    layout: "mod-wedding",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#A8B093]",
    text: "text-black",
    subtext: "text-black/70",
    accent: "bg-black",
    accentText: "text-black",
    pro: true,
  }),
  base({
    id: "cara-banks",
    name: "Cara Banks",
    description: "Olive monogram front with diagonal green accent back.",
    category: "professional",
    layout: "mod-cara",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-black",
    subtext: "text-neutral-600",
    accent: "bg-[#4A5340]",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "alpha-studio",
    name: "Alpha Studio",
    description: "Architectural studio layout with arrow accent.",
    category: "professional",
    layout: "mod-alpha",
    orientation: "landscape",
    size: "lg",
    surface: "bg-[#F5F5F5]",
    text: "text-black",
    subtext: "text-neutral-500",
    accent: "bg-black",
    accentText: "text-black",
    pro: true,
  }),
  base({
    id: "caleb-director",
    name: "Caleb Director",
    description: "Luxury green brand front with cream contact grid back.",
    category: "luxury",
    layout: "mod-caleb",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#F5F2E7]",
    text: "text-[#3E4839]",
    subtext: "text-[#3E4839]/70",
    accent: "bg-[#C5B38F]",
    accentText: "text-[#C5B38F]",
    pro: true,
  }),
  base({
    id: "naturopathy",
    name: "For You Naturopathy",
    description: "Serif wellness brand with organic shape contact back.",
    category: "professional",
    layout: "mod-naturopathy",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#F5F5DC]",
    text: "text-black",
    subtext: "text-black/70",
    accent: "bg-[#3B592D]",
    accentText: "text-[#3B592D]",
    pro: true,
  }),
  base({
    id: "maya-events",
    name: "Maya Events",
    description: "Terracotta script front with QR and contact split back.",
    category: "creative",
    layout: "mod-maya",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#F2EDE4]",
    text: "text-[#2D2926]",
    subtext: "text-[#2D2926]/75",
    accent: "bg-[#70291D]",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "southern-geo",
    name: "Southern Geo",
    description: "Two-tone geometric split with architectural lines.",
    category: "modern",
    layout: "mod-southern",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#6B5344]",
    text: "text-white",
    subtext: "text-white/75",
    accent: "bg-[#4A3728]",
    accentText: "text-white",
    pro: true,
  }),
  base({
    id: "riwo-health",
    name: "Riwo Health",
    description: "Sage QR front with centered forest logo back.",
    category: "modern",
    layout: "mod-riwo",
    orientation: "landscape",
    size: "md",
    surface: "bg-[#00331F]",
    text: "text-[#D1E2C4]",
    subtext: "text-[#D1E2C4]/80",
    accent: "bg-[#D1E2C4]",
    accentText: "text-[#00331F]",
    pro: true,
  }),
];

export function getTheme(id: string): CardTheme {
  return cardThemes.find((theme) => theme.id === id) ?? cardThemes[0];
}

export function parseThemeIds(raw: string | null): string[] {
  const fallback = cardThemes[0]?.id ?? "rob-hatch";
  if (!raw) return [fallback];

  const ids = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const valid = ids.filter((id) => cardThemes.some((theme) => theme.id === id));
  return valid.length > 0 ? valid : [fallback];
}
