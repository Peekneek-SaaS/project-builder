import type { CardData, CardDisplayMode } from "@/lib/card-data";
import type { CardTheme } from "@/lib/card-themes";
import {
  applyColorOverrides,
  cardSideColorVars,
  getThemeStyleClasses,
} from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";
import {
  CardBack,
  CardFront,
  type LinkClickPayload,
} from "@/features/builder/components/card-layouts";
import { CardSideFrame } from "@/features/builder/components/card-plan-watermark";

export type { LinkClickPayload };

export function BusinessCard({
  data,
  theme,
  className,
  compact = false,
  displayMode = "pair",
  showSideLabels = true,
  showWatermark = false,
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
  /** Free-plan edge watermark on each card side. */
  showWatermark?: boolean;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
}) {
  const styles = applyColorOverrides(
    getThemeStyleClasses(theme.id),
    theme,
    data.customColors,
  );
  const frontVars = cardSideColorVars(data.customColors, "front");
  const backVars = cardSideColorVars(data.customColors, "back");

  if (displayMode === "front") {
    return (
      <CardSideFrame
        side="front"
        showWatermark={showWatermark}
        theme={theme}
        style={frontVars}
      >
        <CardFront
          data={data}
          theme={theme}
          styles={styles}
          compact={compact}
          className={className}
        />
      </CardSideFrame>
    );
  }

  if (displayMode === "back") {
    return (
      <CardSideFrame
        side="back"
        showWatermark={showWatermark}
        theme={theme}
        style={backVars}
      >
        <CardBack
          data={data}
          theme={theme}
          styles={styles}
          compact={compact}
          className={className}
          interactive={interactive}
          onLinkClick={onLinkClick}
        />
      </CardSideFrame>
    );
  }

  if (compact) {
    return (
      <CardSideFrame
        side="front"
        showWatermark={showWatermark}
        theme={theme}
        style={frontVars}
      >
        <CardFront
          data={data}
          theme={theme}
          styles={styles}
          compact
          className={className}
        />
      </CardSideFrame>
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
        <CardSideFrame
          side="front"
          showWatermark={showWatermark}
          theme={theme}
          style={frontVars}
        >
          <CardFront data={data} theme={theme} styles={styles} />
        </CardSideFrame>
      </div>
      <div className="flex flex-col items-center gap-2">
        {showSideLabels ? (
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Back
          </span>
        ) : null}
        <CardSideFrame
          side="back"
          showWatermark={showWatermark}
          theme={theme}
          style={backVars}
        >
          <CardBack
            data={data}
            theme={theme}
            styles={styles}
            interactive={interactive}
            onLinkClick={onLinkClick}
          />
        </CardSideFrame>
      </div>
    </div>
  );
}
