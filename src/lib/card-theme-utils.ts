import type { CardSize, CardTheme } from "@/lib/card-themes";
import { THEME_STYLES } from "@/lib/card-theme-styles";
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

const FALLBACK_STYLES: ThemeStyleClasses = THEME_STYLES.midnight;

export function getThemeStyleClasses(themeId: string): ThemeStyleClasses {
  return THEME_STYLES[themeId] ?? FALLBACK_STYLES;
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
