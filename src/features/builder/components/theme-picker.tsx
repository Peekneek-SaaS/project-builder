"use client";

import {
  CheckIcon,
  LockPasswordIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import type { CardTheme } from "@/lib/card-themes";
import { getThemeStyleClasses } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

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

export function ThemePickerCard({
  theme,
  previewName,
  previewInitials,
  selected,
  onSelect,
}: {
  theme: CardTheme;
  previewName: string;
  previewInitials: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const styles = getThemeStyleClasses(theme.id);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl border-2 text-left transition-all",
        selected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/40",
      )}
    >
      <div
        className={cn(
          "relative px-4 pb-4 pt-4",
          styles.frontSurface,
          styles.frontText,
          styles.isLightFront && "ring-1 ring-inset ring-black/10",
        )}
      >
        <div className="flex flex-col gap-2.5">
          <div
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold leading-none",
              styles.accent,
              styles.initialsText,
            )}
          >
            {previewInitials}
          </div>
          <p
            className={cn(
              "truncate text-sm font-semibold leading-tight",
              styles.frontText,
            )}
          >
            {previewName}
          </p>
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
        </div>

        {selected ? (
          <span className="absolute right-2.5 top-2.5 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <HugeiconsIcon icon={CheckIcon} size={14} />
          </span>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-2 border-t border-border bg-card px-4 py-3 text-card-foreground">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{theme.name}</p>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
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
    </button>
  );
}

export function ThemePickerGrid({
  themes,
  previewName,
  previewInitials,
  selected,
  onToggle,
}: {
  themes: CardTheme[];
  previewName: string;
  previewInitials: string;
  selected: string[];
  onToggle: (theme: CardTheme) => void;
}) {
  return (
    <div className="max-h-[520px] overflow-x-hidden overflow-y-auto pb-2">
      <div className="mx-auto grid w-full min-w-0 grid-cols-2 gap-3 sm:max-w-3xl sm:gap-4 md:grid-cols-3">
        {themes.map((theme) => (
          <ThemePickerCard
            key={theme.id}
            theme={theme}
            previewName={previewName}
            previewInitials={previewInitials}
            selected={selected.includes(theme.id)}
            onSelect={() => onToggle(theme)}
          />
        ))}
      </div>
    </div>
  );
}
