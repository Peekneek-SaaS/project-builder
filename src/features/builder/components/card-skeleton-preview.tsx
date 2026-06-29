import type { CardData } from "@/lib/card-data";
import { createDefaultFieldSettings } from "@/lib/card-field-utils";
import type { CardTheme } from "@/lib/card-themes";
import {
  getThemeSizeClasses,
  type ThemeStyleClasses,
} from "@/lib/card-theme-utils";
import { cardShellClasses } from "@/features/builder/components/card-layout-utils";
import { cn } from "@/lib/utils";
import {
  CardBrandMark,
  CardLogo,
  CardWatermarkLogo,
} from "@/features/builder/components/card-brand-elements";
import { isFreeLayout } from "@/features/builder/components/card-free-layouts";
import { isJobLayout } from "@/features/builder/components/card-job-layouts";
import { isModernLayout } from "@/features/builder/components/card-modern-layouts";
import { isStudioLayout } from "@/features/builder/components/card-studio-layouts";

export function SkeletonBar({
  className,
  opacity = "opacity-25",
}: {
  className?: string;
  opacity?: string;
}) {
  return (
    <span
      className={cn("block h-2 rounded-full bg-current", opacity, className)}
    />
  );
}

export function SkeletonContactList({
  styles,
  compact,
  count = 4,
}: {
  styles: ThemeStyleClasses;
  compact?: boolean;
  count?: number;
}) {
  return (
    <div className={cn("grid gap-2", styles.subtext)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="size-3 shrink-0 rounded-full bg-current opacity-20" />
          <SkeletonBar
            className={cn("h-1.5", compact ? "w-16" : i % 2 === 0 ? "w-36" : "w-28")}
            opacity="opacity-20"
          />
        </div>
      ))}
    </div>
  );
}

export function CardFrontSkeleton({
  data,
  theme,
  styles,
  className,
}: {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  className?: string;
}) {
  const sizeClass = getThemeSizeClasses(theme, false);
  const shell = cardShellClasses(styles, "front", className, sizeClass);

  if (
    isJobLayout(theme.layout) ||
    isModernLayout(theme.layout) ||
    isFreeLayout(theme.layout) ||
    isStudioLayout(theme.layout)
  ) {
    return (
      <div className={shell}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <CardBrandMark
            data={data}
            theme={theme}
            styles={styles}
            markSize="md"
            className={styles.frontText}
          />
          <SkeletonBar className="h-2.5 w-24" />
          <SkeletonBar className="h-1.5 w-28 opacity-20" />
        </div>
      </div>
    );
  }

  if (theme.layout === "brand-bar") {
    return (
      <div className={shell}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <CardLogo data={data} styles={styles} />
          <div className="flex w-full max-w-[140px] flex-col items-center gap-2">
            <SkeletonBar className="h-2.5 w-24" />
            <SkeletonBar className="h-1.5 w-32 opacity-20" />
          </div>
        </div>
        <div className={cn("flex justify-center px-4 py-3", styles.accent)}>
          <SkeletonBar className="h-6 w-28 opacity-40" />
        </div>
      </div>
    );
  }

  if (theme.layout === "minimal-dark") {
    return (
      <div className={shell}>
        <div className="absolute top-1/2 left-2 flex -translate-y-1/2 flex-col gap-1.5 opacity-40">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1 rounded-full bg-current" />
          ))}
        </div>
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 flex-col gap-1.5 opacity-40">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1 rounded-full bg-current" />
          ))}
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <CardLogo data={data} styles={styles} />
          <SkeletonBar className="h-2 w-20" />
          <SkeletonBar className="h-1.5 w-28 opacity-20" />
        </div>
      </div>
    );
  }

  if (theme.layout === "minimal-hatch") {
    return (
      <div className={shell}>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent" />
        <div className="relative flex flex-1 items-center justify-center p-6">
          <CardBrandMark data={data} theme={theme} styles={styles} markSize="lg" />
        </div>
      </div>
    );
  }

  if (theme.layout === "minimal-botanical") {
    return (
      <div className={shell}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-10 pt-6 text-center">
          <CardBrandMark data={data} theme={theme} styles={styles} markSize="md" />
          <div className="flex w-full max-w-[140px] flex-col items-center gap-2">
            <SkeletonBar className="h-2.5 w-24" />
            <SkeletonBar className="h-1.5 w-28 opacity-20" />
          </div>
        </div>
        <div className={cn("absolute inset-x-8 bottom-6 h-px", styles.accent)} />
      </div>
    );
  }

  if (theme.layout === "minimal-studio") {
    return (
      <div className={shell}>
        <div className="absolute top-1/2 left-2 flex -translate-y-1/2 flex-col gap-1.5 opacity-40">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1 rounded-full bg-current" />
          ))}
        </div>
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 flex-col gap-1.5 opacity-40">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1 rounded-full bg-current" />
          ))}
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <CardBrandMark data={data} theme={theme} styles={styles} markSize="md" />
          <SkeletonBar className="h-2 w-20" />
          <SkeletonBar className="h-1.5 w-28 opacity-20" />
        </div>
      </div>
    );
  }

  if (theme.layout === "arc-frame") {
    return (
      <div className={shell}>
        <div
          className={cn(
            "pointer-events-none absolute -left-6 -top-6 size-24 rounded-full border-8 opacity-30",
            styles.accent,
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -bottom-8 -right-8 size-28 rounded-full border-8 opacity-30",
            styles.accent,
          )}
        />
        <div className="relative flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <CardLogo data={data} styles={styles} />
          <SkeletonBar className="h-2.5 w-24" />
          <SkeletonBar className="h-1.5 w-32 opacity-20" />
        </div>
      </div>
    );
  }

  return (
    <div className={shell}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <CardLogo data={data} styles={styles} />
        <div className="flex w-full max-w-[150px] flex-col items-center gap-2">
          <SkeletonBar className="h-2.5 w-24" />
          <SkeletonBar className="h-1.5 w-32 opacity-20" />
        </div>
        <div className="flex gap-1.5">
          <span className={cn("h-1 w-10 rounded-full", styles.accent)} />
          <span
            className={cn("h-1 w-5 rounded-full opacity-50", styles.accentBarMuted)}
          />
        </div>
      </div>
    </div>
  );
}

export function CardBackSkeleton({
  data,
  theme,
  styles,
  className,
}: {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  className?: string;
}) {
  const sizeClass = getThemeSizeClasses(theme, false);
  const shell = cardShellClasses(styles, "back", className, sizeClass);

  if (
    isJobLayout(theme.layout) ||
    isModernLayout(theme.layout) ||
    isFreeLayout(theme.layout) ||
    isStudioLayout(theme.layout)
  ) {
    return (
      <div className={shell}>
        <div className="flex flex-1 flex-col justify-center gap-3 p-6">
          <SkeletonBar className="h-3 w-32" />
          <SkeletonBar className="h-2 w-24 opacity-20" />
          <SkeletonContactList styles={styles} count={3} />
        </div>
      </div>
    );
  }

  if (theme.layout === "split-sidebar") {
    return (
      <div className={cn(shell, "flex-row")}>
        <div
          className={cn(
            "flex w-[33%] flex-col items-center justify-center gap-2 p-3",
            styles.accent,
            styles.initialsText,
          )}
        >
          <CardLogo data={data} styles={styles} compact />
          <SkeletonBar className="h-1 w-12 opacity-40" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 p-4">
          <div>
            <p className="text-lg font-bold">{data.name}</p>
            <SkeletonBar className="mt-1.5 h-2 w-28 opacity-20" />
          </div>
          <SkeletonContactList styles={styles} count={3} />
        </div>
      </div>
    );
  }

  if (theme.layout === "skyline") {
    return (
      <div className={shell}>
        <div className={cn("relative h-[38%] shrink-0", styles.accent)}>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-0.5 px-2 pb-0">
            {[40, 64, 48, 72, 36, 56, 44].map((h, i) => (
              <span
                key={i}
                className={cn("w-3 bg-current opacity-20", styles.text)}
                style={{ height: h / 2 }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between gap-3 p-4">
          <div>
            <p className="text-sm font-bold uppercase">{data.name}</p>
            <SkeletonBar className="mt-1 h-1.5 w-20 opacity-20" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <SkeletonBar className="h-1.5 w-24 opacity-20" />
            <SkeletonBar className="h-1.5 w-20 opacity-20" />
            <SkeletonBar className="h-1.5 w-16 opacity-20" />
          </div>
        </div>
      </div>
    );
  }

  if (theme.layout === "band-header") {
    return (
      <div className={shell}>
        <div className="border-b border-black/10 bg-white px-4 py-4">
          <p className="text-sm font-bold uppercase text-slate-900">{data.name}</p>
          <SkeletonBar className="mt-1.5 h-2 w-28 bg-slate-300/60" opacity="" />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-4 p-4">
          <div className="space-y-2">
            <SkeletonBar className="h-2 w-full opacity-15" />
            <SkeletonBar className="h-2 w-[80%] opacity-15" />
          </div>
          <SkeletonContactList styles={styles} count={3} />
        </div>
      </div>
    );
  }

  if (theme.layout === "watermark") {
    return (
      <div className={shell}>
        <div className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.07]">
          <CardLogo data={data} styles={styles} />
        </div>
        <div className="relative flex flex-1 flex-col justify-between gap-4 p-4">
          <div>
            <p className="text-base font-semibold">{data.name}</p>
            <SkeletonBar className="mt-1.5 h-2 w-28 opacity-20" />
          </div>
          <SkeletonContactList styles={styles} count={3} />
          <div className="flex flex-wrap gap-1.5">
            <SkeletonBar className="h-5 w-16 rounded-md opacity-15" />
            <SkeletonBar className="h-5 w-20 rounded-md opacity-15" />
            <SkeletonBar className="h-5 w-14 rounded-md opacity-15" />
          </div>
        </div>
      </div>
    );
  }

  if (theme.layout === "horizontal") {
    return (
      <div className={cn(shell, "flex-row items-stretch")}>
        <div
          className={cn(
            "flex w-[35%] items-center justify-center p-3",
            styles.accent,
            styles.initialsText,
          )}
        >
          <CardLogo data={data} styles={styles} compact />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 p-4">
          <div>
            <p className="text-sm font-bold uppercase">{data.name}</p>
            <SkeletonBar className="mt-1.5 h-2 w-24 opacity-20" />
          </div>
          <SkeletonContactList styles={styles} count={3} />
        </div>
      </div>
    );
  }

  if (theme.layout === "minimal-hatch") {
    return (
      <div className={shell}>
        <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 text-neutral-900 opacity-[0.08]">
          <CardWatermarkLogo
            data={data}
            theme={theme}
            className="text-neutral-900"
            opacity={0.08}
          />
        </div>
        <div className="relative flex flex-1 flex-col justify-between p-5">
          <div>
            <p className="text-lg font-bold uppercase">{data.name}</p>
            <SkeletonBar className="mt-1.5 h-2 w-20 opacity-20" />
          </div>
          <div className="flex items-end justify-between gap-4">
            <SkeletonBar className="h-1.5 w-24 opacity-20" />
            <div className="flex flex-col items-end gap-1.5">
              <SkeletonBar className="h-1.5 w-24 opacity-20" />
              <SkeletonBar className="h-1.5 w-20 opacity-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (theme.layout === "minimal-botanical") {
    return (
      <div className={shell}>
        <div className="pointer-events-none absolute -right-8 bottom-0 top-6 text-lime-900 opacity-[0.07]">
          <CardWatermarkLogo
            data={data}
            theme={theme}
            className="text-lime-900"
            opacity={0.07}
          />
        </div>
        <div className="relative flex flex-1 flex-col justify-between gap-4 p-4">
          <div>
            <p className="text-base font-semibold">{data.name}</p>
            <SkeletonBar className="mt-1.5 h-2 w-28 opacity-20" />
          </div>
          <div className="flex items-end justify-between gap-3">
            <SkeletonContactList styles={styles} count={3} />
            <SkeletonBar className="size-14 rounded-sm opacity-15" opacity="" />
          </div>
        </div>
      </div>
    );
  }

  if (theme.layout === "minimal-studio") {
    return (
      <div className={cn(shell, "flex-row")}>
        <div className="flex w-[32%] items-center justify-center border-r border-neutral-900 p-4">
          <CardBrandMark
            data={data}
            theme={theme}
            styles={styles}
            markSize="lg"
            className={styles.text}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 p-4">
          <div>
            <p className="text-lg font-bold uppercase">{data.name}</p>
            <SkeletonBar className="mt-1.5 h-2 w-28 opacity-20" />
          </div>
          <SkeletonContactList styles={styles} count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className={shell}>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold tracking-tight">{data.name}</h3>
            <SkeletonBar className="mt-2 h-2 w-32 opacity-20" />
          </div>
          <SkeletonBar className="h-5 w-16 shrink-0 rounded-full opacity-15" />
        </div>

        <div className="space-y-2">
          <SkeletonBar className="h-2 w-full opacity-15" />
          <SkeletonBar className="h-2 w-[80%] opacity-15" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <SkeletonBar className="h-5 w-20 rounded-md opacity-15" />
          <SkeletonBar className="h-5 w-16 rounded-md opacity-15" />
          <SkeletonBar className="h-5 w-24 rounded-md opacity-15" />
        </div>

        <SkeletonContactList styles={styles} />

        <div className="flex gap-2 border-t border-current/10 pt-3">
          <SkeletonBar className="h-7 w-20 rounded-full opacity-15" />
          <SkeletonBar className="h-7 w-16 rounded-full opacity-15" />
        </div>
      </div>
    </div>
  );
}

export function skeletonPreviewData(name: string): CardData {
  return {
    name,
    builderLabel: "",
    title: "",
    company: "",
    logoUrl: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    bio: "",
    experience: "",
    skills: [],
    links: [],
    fieldSettings: createDefaultFieldSettings(),
  };
}
