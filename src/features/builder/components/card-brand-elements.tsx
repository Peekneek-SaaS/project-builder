import type { CardData } from "@/lib/card-data";
import type { CardTheme } from "@/lib/card-themes";
import { isFieldEnabled, getFieldSettings, getFieldInlineStyle, getLogoMarkSizeStyle } from "@/lib/card-field-utils";
import {
  layoutHasBrandMark,
  ThemeBrandMark,
} from "@/features/builder/components/card-layout-marks";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

type MarkSize = "sm" | "md" | "lg" | "watermark";

const logoHeights: Record<MarkSize, string> = {
  sm: "h-8 max-w-[72px]",
  md: "h-12 max-w-[104px]",
  lg: "h-16 max-w-[140px]",
  watermark: "h-36 max-w-[240px] sm:h-44 sm:max-w-[280px]",
};

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** First letter of every name word — used for Serif Monogram front. */
export function getMonogramInitials(name: string, lowercase = true) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("");

  return lowercase ? initials.toLowerCase() : initials.toUpperCase();
}

export function CardLogo({
  data,
  styles,
  compact,
  size = "md",
  className,
}: {
  data: CardData;
  styles: ThemeStyleClasses;
  compact?: boolean;
  size?: MarkSize;
  className?: string;
}) {
  if (!isFieldEnabled(data, "logo")) return null;

  const logoSettings = getFieldSettings(data, "logo");
  const logoSizeStyle = getLogoMarkSizeStyle(logoSettings.fontSize);
  const resolvedSize = compact ? "sm" : size;
  const dimension = logoHeights[resolvedSize];

  if (data.logoUrl) {
    return (
      <img
        src={data.logoUrl}
        alt={data.company || data.name}
        className={cn("object-contain", !logoSizeStyle && dimension, className)}
        style={logoSizeStyle}
      />
    );
  }

  const avatarSize =
    logoSettings.fontSize > 0
      ? undefined
      : resolvedSize === "sm"
        ? "size-8 text-[9px]"
        : resolvedSize === "lg" || resolvedSize === "watermark"
          ? "size-16 text-lg"
          : "size-12 text-sm";

  const initialsStyle = getFieldInlineStyle(logoSettings);

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold",
        avatarSize,
        logoSettings.fontSize > 0 && "size-auto min-h-0 min-w-0 px-2 py-1",
        styles.accent,
        styles.initialsText,
        className,
      )}
      style={initialsStyle}
    >
      {getInitials(data.name) || "?"}
    </div>
  );
}

/** Primary brand mark: uploaded logo, themed SVG, or initials avatar. */
export function CardBrandMark({
  data,
  theme,
  styles,
  compact,
  markSize = "md",
  className,
}: {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  compact?: boolean;
  markSize?: MarkSize;
  className?: string;
}) {
  const resolvedSize = compact ? "sm" : markSize;

  if (isFieldEnabled(data, "logo") && data.logoUrl) {
    return (
      <CardLogo
        data={data}
        styles={styles}
        compact={compact}
        size={resolvedSize}
        className={className}
      />
    );
  }

  if (layoutHasBrandMark(theme.layout)) {
    return (
      <ThemeBrandMark
        layout={theme.layout}
        size={resolvedSize}
        className={cn(styles.frontText, className)}
      />
    );
  }

  return (
    <CardLogo
      data={data}
      styles={styles}
      compact={compact}
      size={resolvedSize}
      className={className}
    />
  );
}

/** Faded background logo — uses uploaded logo when available, otherwise themed mark. */
export function CardWatermarkLogo({
  data,
  theme,
  className,
  markSize = "watermark",
  opacity = 0.08,
}: {
  data: CardData;
  theme: CardTheme;
  className?: string;
  markSize?: MarkSize;
  opacity?: number;
}) {
  if (isFieldEnabled(data, "logo") && data.logoUrl) {
    return (
      <img
        src={data.logoUrl}
        alt=""
        aria-hidden
        className={cn(
          "pointer-events-none object-contain select-none",
          logoHeights[markSize],
          className,
        )}
        style={{ opacity }}
      />
    );
  }

  if (!layoutHasBrandMark(theme.layout)) return null;

  return (
    <span
      className={cn("inline-flex pointer-events-none select-none", className)}
      style={{ opacity }}
    >
      <ThemeBrandMark layout={theme.layout} size={markSize} />
    </span>
  );
}

/** Large faded brand: uploaded logo or typographic fallback (company/name). */
export function CardBrandWatermark({
  data,
  theme,
  fallbackText,
  className,
  textClassName,
  logoClassName,
  opacity = 0.1,
}: {
  data: CardData;
  theme: CardTheme;
  fallbackText: string;
  className?: string;
  textClassName?: string;
  logoClassName?: string;
  opacity?: number;
}) {
  if (isFieldEnabled(data, "logo") && data.logoUrl) {
    return (
      <img
        src={data.logoUrl}
        alt=""
        aria-hidden
        className={cn(
          "pointer-events-none object-contain select-none",
          logoHeights.watermark,
          className,
          logoClassName,
        )}
        style={{ opacity }}
      />
    );
  }

  return (
    <p
      aria-hidden
      className={cn(
        "pointer-events-none select-none font-black uppercase leading-none",
        textClassName,
        className,
      )}
      style={{ opacity }}
    >
      {fallbackText}
    </p>
  );
}
