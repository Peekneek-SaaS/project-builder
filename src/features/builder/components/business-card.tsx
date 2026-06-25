import type { CardData, CardDisplayMode } from "@/lib/card-data";
import type { CardTheme } from "@/lib/card-themes";
import { CARD_EXPORT_ATTR } from "@/lib/card-export";
import { getThemeStyleClasses } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";
import {
  CardBack,
  CardFront,
  type LinkClickPayload,
} from "@/features/builder/components/card-layouts";

export type { LinkClickPayload };

export function BusinessCard({
  data,
  theme,
  className,
  compact = false,
  displayMode = "pair",
  showSideLabels = true,
  interactive = false,
  onLinkClick,
}: {
  data: CardData;
  theme: CardTheme;
  className?: string;
  compact?: boolean;
  displayMode?: CardDisplayMode;
  /** Show Front / Back labels above each side in pair mode. */
  showSideLabels?: boolean;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
}) {
  const styles = getThemeStyleClasses(theme.id);

  if (displayMode === "front") {
    return (
      <div className="w-fit max-w-full" {...{ [CARD_EXPORT_ATTR]: "front" }}>
        <CardFront
          data={data}
          theme={theme}
          styles={styles}
          compact={compact}
          className={className}
        />
      </div>
    );
  }

  if (displayMode === "back") {
    return (
      <div className="w-fit max-w-full" {...{ [CARD_EXPORT_ATTR]: "back" }}>
        <CardBack
          data={data}
          theme={theme}
          styles={styles}
          compact={compact}
          className={className}
          interactive={interactive}
          onLinkClick={onLinkClick}
        />
      </div>
    );
  }

  if (compact) {
    return (
      <div {...{ [CARD_EXPORT_ATTR]: "front" }}>
        <CardFront
          data={data}
          theme={theme}
          styles={styles}
          compact
          className={className}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2">
        {showSideLabels ? (
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Front
          </span>
        ) : null}
        <div {...{ [CARD_EXPORT_ATTR]: "front" }}>
          <CardFront data={data} theme={theme} styles={styles} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        {showSideLabels ? (
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Back
          </span>
        ) : null}
        <div {...{ [CARD_EXPORT_ATTR]: "back" }}>
          <CardBack
            data={data}
            theme={theme}
            styles={styles}
            interactive={interactive}
            onLinkClick={onLinkClick}
          />
        </div>
      </div>
    </div>
  );
}
