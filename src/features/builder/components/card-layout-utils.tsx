"use client";

import type { CardTheme } from "@/lib/card-themes";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { getThemeSizeClasses } from "@/lib/card-theme-utils";
import { useCardPrintExport } from "@/features/builder/components/card-print-export-context";
import { cn } from "@/lib/utils";

export function tx(compact: boolean | undefined, sm: string, lg: string) {
  return compact ? sm : lg;
}

/** Shared outer chrome — single subtle edge + soft depth (no stacked ring). */
export function cardShellChrome(isLight: boolean, forPrint?: boolean) {
  return cn(
    "@container/card [container-type:size]",
    "relative flex flex-col overflow-hidden antialiased",
    forPrint ? "rounded-none" : "rounded-2xl",
    isLight
      ? "border border-black/[0.07] shadow-[0_1px_1px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.04),0_12px_28px_-10px_rgba(0,0,0,0.07)]"
      : "border border-white/[0.09] shadow-[0_1px_1px_rgba(0,0,0,0.28),0_10px_28px_-8px_rgba(0,0,0,0.55)]",
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
