import type { CardTheme } from "@/lib/card-themes";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { getThemeSizeClasses } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

export function tx(compact: boolean | undefined, sm: string, lg: string) {
  return compact ? sm : lg;
}

export function layoutShell(
  styles: ThemeStyleClasses,
  theme: CardTheme,
  compact: boolean | undefined,
  side: "front" | "back",
  className?: string,
) {
  const isFront = side === "front";
  return cn(
    "relative flex flex-col overflow-hidden rounded-2xl border border-black/5 shadow-xl shadow-black/5 ring-1 ring-black/5 antialiased",
    isFront ? styles.frontSurface : styles.surface,
    isFront ? styles.frontText : styles.text,
    isFront
      ? styles.isLightFront && "ring-black/10"
      : styles.isLightSurface && "ring-black/10",
    className,
    getThemeSizeClasses(theme, compact),
  );
}
