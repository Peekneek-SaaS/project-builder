import type { CSSProperties } from "react";

import type { CardColorOverrides } from "@/lib/card-data";
import type { CardSize, CardTheme } from "@/lib/card-themes";
import { THEME_STYLES } from "@/lib/card-theme-styles";
import { usesInvertedCardSides } from "@/lib/card-side-inversion";
import { cn } from "@/lib/utils";

export type ThemeStyleClasses = {
  frontSurface: string;
  frontText: string;
  surface: string;
  text: string;
  subtext: string;
  accent: string;
  accentBarMuted: string;
  initialsText: string;
  isLightFront: boolean;
  isLightSurface: boolean;
};

const FALLBACK_STYLES: ThemeStyleClasses = THEME_STYLES["free-serif-split"];

export function getThemeStyleClasses(themeId: string): ThemeStyleClasses {
  return THEME_STYLES[themeId] ?? FALLBACK_STYLES;
}

export function hasColorOverrides(overrides?: CardColorOverrides): boolean {
  if (!overrides) return false;
  const { front, back, accent } = overrides;
  return Boolean(
    accent ||
      front?.background ||
      front?.text ||
      back?.background ||
      back?.text,
  );
}

/** Rough perceived lightness of a hex color (#rgb or #rrggbb). */
function isLightHexColor(hex: string): boolean {
  const raw = hex.trim().replace(/^#/, "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : raw;
  if (full.length !== 6 || /[^0-9a-fA-F]/.test(full)) return false;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

/**
 * Returns derived style classes that route surface/text/accent through CSS
 * variables when per-card overrides are present. The variables are resolved
 * per visual side via {@link cardSideColorVars} on each side's wrapper, so the
 * same class string yields the correct color on front vs back — even for
 * layouts whose authored front/back are swapped ({@link usesInvertedCardSides}).
 */
export function applyColorOverrides(
  styles: ThemeStyleClasses,
  theme: CardTheme,
  overrides?: CardColorOverrides,
): ThemeStyleClasses {
  if (!hasColorOverrides(overrides)) return styles;

  const inverted = usesInvertedCardSides(theme.layout);
  const next: ThemeStyleClasses = { ...styles };

  // Map each visual side to the style fields the renderer actually reads.
  const frontSurfaceKey = inverted ? "surface" : "frontSurface";
  const backSurfaceKey = inverted ? "frontSurface" : "surface";
  const frontLightKey = inverted ? "isLightSurface" : "isLightFront";
  const backLightKey = inverted ? "isLightFront" : "isLightSurface";
  const frontTextKey = inverted ? "text" : "frontText";
  const backTextKey = inverted ? "frontText" : "text";

  const front = overrides?.front;
  const back = overrides?.back;

  if (front?.background) {
    next[frontSurfaceKey] = cn(styles[frontSurfaceKey], "bg-[var(--card-bg)]");
    next[frontLightKey] = isLightHexColor(front.background);
  }
  if (back?.background) {
    next[backSurfaceKey] = cn(styles[backSurfaceKey], "bg-[var(--card-bg)]");
    next[backLightKey] = isLightHexColor(back.background);
  }
  if (front?.text) {
    next[frontTextKey] = cn(styles[frontTextKey], "text-[var(--card-fg)]");
  }
  if (back?.text) {
    next[backTextKey] = cn(styles[backTextKey], "text-[var(--card-fg)]");
  }
  if (overrides?.accent) {
    next.accent = cn(styles.accent, "bg-[var(--card-accent)]");
  }

  return next;
}

/**
 * Inline CSS custom properties for one visual side, consumed by
 * {@link applyColorOverrides}. Define these on that side's wrapper element.
 */
export function cardSideColorVars(
  overrides: CardColorOverrides | undefined,
  side: "front" | "back",
): CSSProperties | undefined {
  if (!overrides) return undefined;

  const sideColors = side === "front" ? overrides.front : overrides.back;
  const vars: Record<string, string> = {};
  if (sideColors?.background) vars["--card-bg"] = sideColors.background;
  if (sideColors?.text) vars["--card-fg"] = sideColors.text;
  if (overrides.accent) vars["--card-accent"] = overrides.accent;

  return Object.keys(vars).length > 0 ? (vars as CSSProperties) : undefined;
}

/** Light/dark tone for the side actually shown (accounts for inverted front/back layouts). */
export function getWatermarkIsLight(
  theme: CardTheme,
  displaySide: "front" | "back",
): boolean {
  const styles = getThemeStyleClasses(theme.id);
  const inverted = usesInvertedCardSides(theme.layout);

  if (displaySide === "front") {
    return inverted ? styles.isLightSurface : styles.isLightFront;
  }

  return inverted ? styles.isLightFront : styles.isLightSurface;
}

export function accentInitialsClass(theme: CardTheme): string {
  return getThemeStyleClasses(theme.id).initialsText;
}

export function resolveThemeClasses(theme: CardTheme): ThemeStyleClasses {
  return getThemeStyleClasses(theme.id);
}

export function getThemeSizeClasses(theme: CardTheme, compact = false): string {
  if (compact) {
    return theme.orientation === "landscape"
      ? "h-[92px] w-[148px] shrink-0"
      : "h-[160px] w-[100px] shrink-0";
  }

  const portraitSizes: Record<CardSize, string> = {
    sm: "h-[260px] w-[162px]",
    md: "h-[320px] w-[200px]",
    lg: "h-[360px] w-[225px]",
  };

  const landscapeSizes: Record<CardSize, string> = {
    sm: "h-[200px] w-[320px]",
    md: "h-[250px] w-[400px]",
    lg: "h-[300px] w-[480px]",
  };

  return cn(
    "shrink-0",
    theme.orientation === "landscape"
      ? landscapeSizes[theme.size]
      : portraitSizes[theme.size],
  );
}
