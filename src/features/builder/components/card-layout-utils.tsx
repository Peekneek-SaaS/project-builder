"use client";

import type { CardTheme } from "@/lib/card-themes";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { getThemeSizeClasses } from "@/lib/card-theme-utils";
import { useCardPrintExport } from "@/features/builder/components/card-print-export-context";
import { cn } from "@/lib/utils";

export function tx(compact: boolean | undefined, sm: string, lg: string) {
  return compact ? sm : lg;
}

/** Shared outer chrome — single subtle edge + soft layered depth (no stacked ring). */
export function cardShellChrome(isLight: boolean, forPrint?: boolean) {
  return cn(
    "@container/card [container-type:size]",
    "relative flex flex-col overflow-hidden antialiased",
    // Crisp, consistent text rendering across every theme.
    "[text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]",
    forPrint ? "rounded-none" : "rounded-2xl",
    isLight
      ? "border border-black/[0.06] shadow-[0_1px_1px_rgba(17,17,17,0.04),0_3px_8px_-2px_rgba(17,17,17,0.06),0_16px_32px_-12px_rgba(17,17,17,0.10)]"
      : "border border-white/[0.10] shadow-[0_1px_1px_rgba(0,0,0,0.30),0_4px_12px_-2px_rgba(0,0,0,0.40),0_16px_36px_-12px_rgba(0,0,0,0.55)]",
  );
}

export function cardShellClasses(
  styles: ThemeStyleClasses,
  side: "front" | "back",
  className?: string,
  sizeClass?: string,
  forPrint?: boolean,
) {
  const isFront = side === "front";
  const isLight = isFront ? styles.isLightFront : styles.isLightSurface;

  return cn(
    cardShellChrome(isLight, forPrint),
    isFront ? styles.frontSurface : styles.surface,
    isFront ? styles.frontText : styles.text,
    className,
    sizeClass,
  );
}

export function layoutShell(
  styles: ThemeStyleClasses,
  theme: CardTheme,
  compact: boolean | undefined,
  side: "front" | "back",
  className?: string,
  forPrint?: boolean,
) {
  return cardShellClasses(
    styles,
    side,
    className,
    getThemeSizeClasses(theme, compact),
    forPrint,
  );
}

/** Layout shell that respects print-export context (square corners off-screen). */
export function useLayoutShell() {
  const forPrint = useCardPrintExport();

  return (
    styles: ThemeStyleClasses,
    theme: CardTheme,
    compact: boolean | undefined,
    side: "front" | "back",
    className?: string,
  ) => layoutShell(styles, theme, compact, side, className, forPrint);
}

/** Card shell classes that respect print-export context (legacy layouts). */
export function useCardShellClasses() {
  const forPrint = useCardPrintExport();

  return (
    styles: ThemeStyleClasses,
    side: "front" | "back",
    className?: string,
    sizeClass?: string,
  ) => cardShellClasses(styles, side, className, sizeClass, forPrint);
}
