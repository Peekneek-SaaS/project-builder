export type CardLayout =
  | "classic"
  | "brand-center"
  | "brand-bar"
  | "split-sidebar"
  | "minimal-dark"
  | "band-header"
  | "skyline"
  | "watermark"
  | "arc-frame"
  | "horizontal";

export type CardOrientation = "portrait" | "landscape";
export type CardSize = "sm" | "md" | "lg";

export type CardTheme = {
  id: string;
  name: string;
  description: string;
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
  theme: Omit<CardTheme, "surface" | "text" | "subtext" | "accent" | "accentText"> &
    Partial<Pick<CardTheme, "surface" | "text" | "subtext" | "accent" | "accentText">>,
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
    id: "midnight",
    name: "Midnight",
    description: "Deep ink with a calm blue accent.",
    layout: "classic",
    orientation: "landscape",
    size: "sm",
    surface: "bg-slate-900",
    text: "text-white",
    subtext: "text-slate-400",
    accent: "bg-blue-500",
    accentText: "text-blue-400",
  }),
  base({
    id: "paper",
    name: "Paper",
    description: "Clean, minimal and editorial.",
    layout: "classic",
    orientation: "landscape",
    size: "md",
    surface: "bg-white",
    text: "text-slate-900",
    subtext: "text-slate-500",
    accent: "bg-slate-900",
    accentText: "text-slate-900",
  }),
  base({
    id: "azure",
    name: "Azure",
    description: "Confident blue, bold and modern.",
    layout: "brand-center",
    orientation: "landscape",
    size: "md",
    surface: "bg-blue-600",
    text: "text-white",
    subtext: "text-blue-100",
    accent: "bg-white",
    accentText: "text-blue-50",
  }),
  base({
    id: "sand",
    name: "Sand",
    description: "Warm neutral with a soft feel.",
    layout: "classic",
    orientation: "landscape",
    size: "md",
    surface: "bg-stone-100",
    text: "text-stone-900",
    subtext: "text-stone-500",
    accent: "bg-stone-900",
    accentText: "text-stone-700",
    pro: true,
  }),
  base({
    id: "forest",
    name: "Forest",
    description: "Grounded green for a natural look.",
    layout: "watermark",
    orientation: "landscape",
    size: "md",
    surface: "bg-emerald-900",
    text: "text-white",
    subtext: "text-emerald-200/70",
    accent: "bg-emerald-400",
    accentText: "text-emerald-300",
    pro: true,
  }),
  base({
    id: "mono",
    name: "Mono",
    description: "High-contrast monochrome statement.",
    layout: "minimal-dark",
    orientation: "landscape",
    size: "md",
    surface: "bg-black",
    text: "text-white",
    subtext: "text-neutral-400",
    accent: "bg-white",
    accentText: "text-neutral-300",
    pro: true,
  }),
  base({
    id: "teal-split",
    name: "Teal Split",
    description: "Light front with bold teal footer bar.",
    layout: "brand-bar",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "design-point",
    name: "Design Point",
    description: "Dark branding front, structured details back.",
    layout: "minimal-dark",
    orientation: "landscape",
    size: "lg",
    pro: true,
  }),
  base({
    id: "sage-clinical",
    name: "Sage Clinical",
    description: "Calm sage front with gold accent line.",
    layout: "watermark",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "hatch-mono",
    name: "Hatch Mono",
    description: "Dark geometric front, clean typographic back.",
    layout: "horizontal",
    orientation: "landscape",
    size: "lg",
    pro: true,
  }),
  base({
    id: "skyline-estate",
    name: "Skyline Estate",
    description: "Real-estate skyline split with bold name.",
    layout: "skyline",
    orientation: "landscape",
    size: "lg",
    pro: true,
  }),
  base({
    id: "morton-olive",
    name: "Morton Olive",
    description: "Olive monogram front, editorial back layout.",
    layout: "brand-center",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "shapeiva-arc",
    name: "Shapeiva Arc",
    description: "Arc-framed branding with teal confidence.",
    layout: "arc-frame",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "crimson-bold",
    name: "Crimson Bold",
    description: "Executive crimson with strong presence.",
    layout: "brand-center",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "sunset-warm",
    name: "Sunset Warm",
    description: "Warm orange branding, soft details back.",
    layout: "brand-bar",
    orientation: "landscape",
    size: "sm",
    pro: true,
  }),
  base({
    id: "ocean-deep",
    name: "Ocean Deep",
    description: "Deep cyan nautical professional style.",
    layout: "classic",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "lavender-soft",
    name: "Lavender Soft",
    description: "Soft violet creative with gentle contrast.",
    layout: "arc-frame",
    orientation: "landscape",
    size: "sm",
    pro: true,
  }),
  base({
    id: "copper-luxe",
    name: "Copper Luxe",
    description: "Premium copper tones on dark surfaces.",
    layout: "band-header",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "slate-corporate",
    name: "Slate Corporate",
    description: "Corporate slate with sidebar logo back.",
    layout: "split-sidebar",
    orientation: "landscape",
    size: "lg",
    pro: true,
  }),
  base({
    id: "berry-creative",
    name: "Berry Creative",
    description: "Vibrant fuchsia for creative professionals.",
    layout: "brand-center",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "pine-nordic",
    name: "Pine Nordic",
    description: "Nordic pine green, clean and grounded.",
    layout: "watermark",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "ivory-gold",
    name: "Ivory Gold",
    description: "Ivory canvas with gold accent details.",
    layout: "classic",
    orientation: "landscape",
    size: "sm",
    pro: true,
  }),
  base({
    id: "navy-gold",
    name: "Navy Gold",
    description: "Executive navy paired with gold accents.",
    layout: "band-header",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "rose-modern",
    name: "Rose Modern",
    description: "Modern rose palette, friendly and bold.",
    layout: "brand-bar",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
  base({
    id: "charcoal-minimal",
    name: "Charcoal Minimal",
    description: "Wide minimal charcoal landscape card.",
    layout: "horizontal",
    orientation: "landscape",
    size: "lg",
    pro: true,
  }),
  base({
    id: "emerald-luxe",
    name: "Emerald Luxe",
    description: "Rich emerald luxury with bright accents.",
    layout: "split-sidebar",
    orientation: "landscape",
    size: "md",
    pro: true,
  }),
];

export function getTheme(id: string): CardTheme {
  return cardThemes.find((theme) => theme.id === id) ?? cardThemes[0];
}

export function parseThemeIds(raw: string | null): string[] {
  if (!raw) return ["midnight"];

  const ids = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const valid = ids.filter((id) => cardThemes.some((theme) => theme.id === id));
  return valid.length > 0 ? valid : ["midnight"];
}
