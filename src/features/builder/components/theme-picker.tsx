"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckIcon,
  LockPasswordIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/features/builder/components/business-card";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CardData, CardDisplayMode } from "@/lib/card-data";
import type { CardTheme } from "@/lib/card-themes";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { getThemeStyleClasses } from "@/lib/card-theme-utils";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  THEME_CATEGORY_ORDER,
  getThemePreviewConfig,
  groupThemesByCategory,
  filterThemesByQuery,
  type ThemePreviewField,
  type ThemePreviewLayout,
} from "@/lib/theme-categories";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PREVIEW_TITLE = "Professional";

export function ThemeSwatch({
  theme,
  selected,
  onSelect,
}: {
  theme: CardTheme;
  selected: boolean;
  onSelect: () => void;
}) {
  const styles = getThemeStyleClasses(theme.id);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Select ${theme.name} theme`}
      aria-pressed={selected}
      className={cn(
        "relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-transparent hover:border-border",
      )}
    >
      <span className={cn("flex h-full w-full items-end p-2", styles.surface)}>
        <span className={cn("h-1.5 w-5 rounded-full", styles.accent)} />
      </span>
      {selected ? (
        <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <HugeiconsIcon icon={CheckIcon} size={12} />
        </span>
      ) : null}
    </button>
  );
}

export function ThemeSwatchGrid({
  themes,
  selectedId,
  onSelect,
  columns = 3,
}: {
  themes: CardTheme[];
  selectedId: string;
  onSelect: (themeId: string) => void;
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 3 ? "grid-cols-3" : "grid-cols-4",
      )}
    >
      {themes.map((theme) => (
        <ThemeSwatch
          key={theme.id}
          theme={theme}
          selected={selectedId === theme.id}
          onSelect={() => onSelect(theme.id)}
        />
      ))}
    </div>
  );
}

function ThemePreviewFieldBlock({
  field,
  previewName,
  previewInitials,
  styles,
  layout,
}: {
  field: ThemePreviewField;
  previewName: string;
  previewInitials: string;
  styles: ThemeStyleClasses;
  layout: ThemePreviewLayout;
}) {
  switch (field) {
    case "initials":
      return (
        <div
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold leading-none",
            styles.accent,
            styles.initialsText,
          )}
        >
          {previewInitials}
        </div>
      );
    case "name":
      return (
        <p
          className={cn(
            "truncate font-semibold leading-tight",
            layout === "typography" ? "text-base" : "text-sm",
            styles.frontText,
          )}
        >
          {previewName}
        </p>
      );
    case "title":
      return (
        <p
          className={cn(
            "truncate text-[11px] font-medium uppercase tracking-wide opacity-80",
            styles.frontText,
          )}
        >
          {PREVIEW_TITLE}
        </p>
      );
    case "tagline":
      return (
        <p
          className={cn(
            "truncate text-[10px] italic opacity-70",
            styles.frontText,
          )}
        >
          Design that defines you
        </p>
      );
    case "accentBar":
      return (
        <div className="flex items-center gap-1.5">
          <span
            className={cn("h-1 w-10 shrink-0 rounded-full", styles.accent)}
          />
          <span
            className={cn(
              "h-1 w-5 shrink-0 rounded-full opacity-70",
              styles.accentBarMuted,
            )}
          />
        </div>
      );
    case "accentDots":
      return (
        <div className="flex items-center gap-1">
          <span className={cn("size-1.5 rounded-full", styles.accent)} />
          <span
            className={cn("size-1.5 rounded-full opacity-60", styles.accent)}
          />
          <span
            className={cn("size-1.5 rounded-full opacity-30", styles.accent)}
          />
        </div>
      );
    case "divider":
      return (
        <span
          className={cn("block h-px w-10", styles.accentBarMuted, "opacity-80")}
        />
      );
    case "pattern":
      return (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
            backgroundSize: "8px 8px",
          }}
        />
      );
    case "sidebar":
      return (
        <div
          className={cn(
            "h-full w-3 shrink-0 rounded-sm",
            styles.accent,
            "opacity-90",
          )}
        />
      );
    case "band":
      return (
        <span className={cn("block h-1.5 w-full rounded-sm", styles.accent)} />
      );
    case "grid":
      return (
        <div className="grid shrink-0 grid-cols-2 gap-0.5 opacity-70">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              className={cn("size-2 rounded-[2px]", styles.accentBarMuted)}
            />
          ))}
        </div>
      );
    case "orbit":
      return (
        <span
          className={cn(
            "grid size-10 place-items-center rounded-full border-2 border-dashed opacity-50",
            styles.accentBarMuted,
          )}
        >
          <span className={cn("size-4 rounded-full", styles.accent)} />
        </span>
      );
    default:
      return null;
  }
}

function ThemePreviewContent({
  theme,
  previewName,
  previewInitials,
  styles,
}: {
  theme: CardTheme;
  previewName: string;
  previewInitials: string;
  styles: ThemeStyleClasses;
}) {
  const { layout, fields } = getThemePreviewConfig(theme);

  const fieldNodes = fields.map((field) => (
    <ThemePreviewFieldBlock
      key={field}
      field={field}
      previewName={previewName}
      previewInitials={previewInitials}
      styles={styles}
      layout={layout}
    />
  ));

  switch (layout) {
    case "centered":
      return (
        <div className="relative flex flex-col items-center gap-2 text-center">
          {fieldNodes}
        </div>
      );
    case "split": {
      const sidebar = fields.includes("sidebar");
      const mainFields = fields.filter(
        (field) => field !== "sidebar" && field !== "grid",
      );
      const gridField = fields.includes("grid");

      return (
        <div className="relative flex gap-2.5">
          {sidebar ? (
            <ThemePreviewFieldBlock
              field="sidebar"
              previewName={previewName}
              previewInitials={previewInitials}
              styles={styles}
              layout={layout}
            />
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {gridField ? (
              <ThemePreviewFieldBlock
                field="grid"
                previewName={previewName}
                previewInitials={previewInitials}
                styles={styles}
                layout={layout}
              />
            ) : null}
            {mainFields.map((field) => (
              <ThemePreviewFieldBlock
                key={field}
                field={field}
                previewName={previewName}
                previewInitials={previewInitials}
                styles={styles}
                layout={layout}
              />
            ))}
          </div>
        </div>
      );
    }
    case "minimal":
      return <div className="relative flex flex-col gap-2.5">{fieldNodes}</div>;
    case "band-top":
      return (
        <div className="relative flex flex-col gap-2.5">
          {fields.includes("band") ? (
            <ThemePreviewFieldBlock
              field="band"
              previewName={previewName}
              previewInitials={previewInitials}
              styles={styles}
              layout={layout}
            />
          ) : null}
          <div className="flex flex-col gap-2">
            {fields
              .filter((field) => field !== "band")
              .map((field) => (
                <ThemePreviewFieldBlock
                  key={field}
                  field={field}
                  previewName={previewName}
                  previewInitials={previewInitials}
                  styles={styles}
                  layout={layout}
                />
              ))}
          </div>
        </div>
      );
    case "band-bottom":
      return (
        <div className="relative flex flex-col gap-2.5">
          <div className="flex flex-col gap-2">
            {fields
              .filter((field) => field !== "band")
              .map((field) => (
                <ThemePreviewFieldBlock
                  key={field}
                  field={field}
                  previewName={previewName}
                  previewInitials={previewInitials}
                  styles={styles}
                  layout={layout}
                />
              ))}
          </div>
          {fields.includes("band") ? (
            <ThemePreviewFieldBlock
              field="band"
              previewName={previewName}
              previewInitials={previewInitials}
              styles={styles}
              layout={layout}
            />
          ) : null}
        </div>
      );
    case "typography":
      return <div className="relative flex flex-col gap-1.5">{fieldNodes}</div>;
    case "geometric":
      return (
        <div className="relative flex flex-col gap-2.5">
          {fields.includes("pattern") ? (
            <ThemePreviewFieldBlock
              field="pattern"
              previewName={previewName}
              previewInitials={previewInitials}
              styles={styles}
              layout={layout}
            />
          ) : null}
          <div className="flex flex-col gap-2">
            {fields
              .filter((field) => field !== "pattern")
              .map((field) => (
                <ThemePreviewFieldBlock
                  key={field}
                  field={field}
                  previewName={previewName}
                  previewInitials={previewInitials}
                  styles={styles}
                  layout={layout}
                />
              ))}
          </div>
        </div>
      );
    case "stacked":
    default:
      return <div className="relative flex flex-col gap-2.5">{fieldNodes}</div>;
  }
}

function themeForPickerPreview(theme: CardTheme, isMobile: boolean): CardTheme {
  if (theme.orientation !== "landscape") return theme;

  const targetSize: CardTheme["size"] = isMobile
    ? "sm"
    : theme.size === "lg"
      ? "md"
      : theme.size;

  if (targetSize === theme.size) return theme;
  return { ...theme, size: targetSize };
}

function ThemePickerCardPreview({
  theme,
  previewData,
  side,
}: {
  theme: CardTheme;
  previewData: CardData;
  side: CardDisplayMode;
}) {
  const isMobile = useIsMobile();
  const previewTheme = useMemo(
    () => themeForPickerPreview(theme, isMobile),
    [theme, isMobile],
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    let frame = 0;

    const updateLayout = () => {
      const container = containerRef.current;
      const card = cardRef.current;
      if (!container || !card) return;

      const naturalWidth = card.offsetWidth;
      if (!naturalWidth) return;

      const availableWidth = container.clientWidth;
      if (availableWidth <= 0) {
        frame = requestAnimationFrame(updateLayout);
        return;
      }

      setScale(Math.min(1, availableWidth / naturalWidth));
      setReady(true);
    };

    setReady(false);
    updateLayout();
    frame = requestAnimationFrame(updateLayout);

    const observer = new ResizeObserver(updateLayout);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [previewTheme.id, side, previewData, isMobile]);

  return (
    <div
      ref={containerRef}
      className="flex w-full min-w-0 justify-center px-2 py-3 sm:px-4 sm:py-4"
    >
      <div
        className={cn(
          "mx-auto shrink-0 transition-opacity duration-150",
          !ready && "opacity-0",
        )}
        style={{ zoom: scale < 1 ? scale : undefined }}
      >
        <div ref={cardRef}>
          <BusinessCard
            data={previewData}
            theme={previewTheme}
            displayMode={side}
            showSideLabels={false}
          />
        </div>
      </div>
    </div>
  );
}

export function ThemePickerCard({
  theme,
  previewData,
  selected,
  onSelect,
}: {
  theme: CardTheme;
  previewData: CardData;
  selected: boolean;
  onSelect: () => void;
}) {
  const [side, setSide] = useState<CardDisplayMode>("front");

  function showSide(next: CardDisplayMode, event: MouseEvent) {
    event.stopPropagation();
    setSide(next);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/40",
      )}
    >
      <div className="relative bg-muted/15 pb-11 pt-1 sm:pt-0">
        <ThemePickerCardPreview
          theme={theme}
          previewData={previewData}
          side={side}
        />

        <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-1.5">
          <button
            type="button"
            aria-label={`Show front of ${theme.name}`}
            aria-pressed={side === "front"}
            onClick={(event) => showSide("front", event)}
            className={cn(
              "grid size-7 place-items-center rounded-full border bg-background/95 shadow-sm backdrop-blur-sm transition-colors",
              side === "front"
                ? "border-primary/40 text-primary"
                : "border-border/80 text-muted-foreground hover:text-foreground",
            )}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          <button
            type="button"
            aria-label={`Show back of ${theme.name}`}
            aria-pressed={side === "back"}
            onClick={(event) => showSide("back", event)}
            className={cn(
              "grid size-7 place-items-center rounded-full border bg-background/95 shadow-sm backdrop-blur-sm transition-colors",
              side === "back"
                ? "border-primary/40 text-primary"
                : "border-border/80 text-muted-foreground hover:text-foreground",
            )}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>

        {selected ? (
          <span className="pointer-events-none absolute right-2.5 top-2.5 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <HugeiconsIcon icon={CheckIcon} size={14} />
          </span>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-2 border-t border-border bg-card px-4 py-3 text-card-foreground">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{theme.name}</p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
            {theme.description}
          </p>
        </div>
        {theme.pro ? (
          <Badge variant="secondary" className="shrink-0 gap-1 px-2">
            <HugeiconsIcon icon={LockPasswordIcon} size={12} />
            Pro
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

export function ThemePickerGrid({
  themes,
  previewData,
  selected,
  onToggle,
  searchQuery = "",
  onSearchQueryChange,
  className,
  isProPlan,
  footer,
}: {
  themes: CardTheme[];
  previewData: CardData;
  selected: string[];
  onToggle: (theme: CardTheme) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  className?: string;
  isProPlan: boolean;
  footer?: ReactNode;
}) {
  const filteredThemes = filterThemesByQuery(themes, searchQuery);
  const grouped = groupThemesByCategory(filteredThemes);

  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
    >
      <div className="sticky top-0 z-10 shrink-0 border-b border-border/60 bg-background/95 pb-3 pt-1 backdrop-blur-sm">
        <div className="flex flex-col items-stretch gap-2 sm:gap-3 md:flex-row md:items-center md:justify-end">
          <p className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
            {isProPlan ? (
              <>
                Select one or more themes.{" "}
                <span className="font-medium text-foreground">
                  {selected.length} selected
                </span>
              </>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-2">
                Want to build multiple cards at once?{" "}
                <Link href="/#pricing" className="font-medium text-primary">
                  Upgrade to Pro
                </Link>{" "}
                to select & unlock several themes.
              </div>
            )}
          </p>
          <div className="relative w-full md:max-w-xs">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange?.(event.target.value)}
              placeholder="Search card themes"
              className="h-8 pl-9"
              aria-label="Search card themes"
            />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pt-4 sm:pt-6">
        {filteredThemes.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No themes match &ldquo;{searchQuery}&rdquo;. Try a different name or
            category.
          </div>
        ) : (
          <div className="flex flex-col gap-8 pb-4 sm:gap-10">
            {THEME_CATEGORY_ORDER.map((category) => {
              const categoryThemes = grouped[category];
              if (!categoryThemes?.length) return null;

              return (
                <section
                  key={category}
                  className="w-full min-w-0 shrink-0 px-2 md:px-0"
                >
                  <div className="mb-4 space-y-1">
                    <h2 className="text-base font-semibold tracking-tight">
                      {CATEGORY_LABELS[category]}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {CATEGORY_DESCRIPTIONS[category]}
                    </p>
                  </div>
                  <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {categoryThemes.map((theme) => (
                      <ThemePickerCard
                        key={theme.id}
                        theme={theme}
                        previewData={previewData}
                        selected={selected.includes(theme.id)}
                        onSelect={() => onToggle(theme)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
            {/* {footer ? <div className="shrink-0">{footer}</div> : null} */}
          </div>
        )}
      </div>
    </div>
  );
}
