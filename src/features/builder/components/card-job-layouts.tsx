import type { CardData } from "@/lib/card-data";
import type { CardLayout, CardTheme } from "@/lib/card-themes";
import { isFieldEnabled } from "@/lib/card-field-utils";
import {
  CardBrandMark,
  CardBrandWatermark,
  CardWatermarkLogo,
} from "@/features/builder/components/card-brand-elements";
import { FieldText } from "@/features/builder/components/field-text";
import { NameTitleStack } from "@/features/builder/components/card-name-title";
import { CirclePattern, DecorativeQrPlaceholder } from "@/features/builder/components/card-layout-marks";
import {
  ContactList,
  type LinkClickPayload,
} from "@/features/builder/components/card-layouts";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { getThemeSizeClasses } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

function tx(compact: boolean | undefined, sm: string, lg: string) {
  return compact ? sm : lg;
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return { first: name, last: "" };
  return { first: parts.slice(0, -1).join(" "), last: parts.at(-1) ?? "" };
}

type JobLayoutProps = {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  compact?: boolean;
  className?: string;
};

type JobBackProps = JobLayoutProps & {
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
};

function shell(
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

export function JobCardFront({
  data,
  theme,
  styles,
  compact,
  className,
}: JobLayoutProps) {
  const layout = theme.layout;
  const box = shell(styles, theme, compact, "front", className);

  switch (layout) {
    case "job-hi":
      return (
        <div className={box}>
          <div className="relative flex flex-1 flex-col justify-end p-6">
            <p
              className={cn(
                "absolute right-6 top-1/2 -translate-y-1/2 font-black lowercase leading-[0.85] tracking-tight",
                tx(compact, "text-4xl", "text-7xl"),
              )}
            >
              hi!
            </p>
            <div className="w-[62%] border-t border-current/80 pt-2.5">
              {isFieldEnabled(data, "website") && data.website ? (
                <FieldText
                  data={data}
                  fieldKey="website"
                  className={cn("tracking-wide", tx(compact, "text-[7px]", "text-[11px]"))}
                >
                  {data.website}
                </FieldText>
              ) : (
                <span className={cn("tracking-wide opacity-70", tx(compact, "text-[7px]", "text-[11px]"))}>
                  www.yoursite.com
                </span>
              )}
            </div>
          </div>
        </div>
      );

    case "job-chevron":
      return (
        <div className={cn(box, "flex-row")}>
          <div className={cn("relative w-[38%] shrink-0 overflow-hidden", styles.accent)}>
            <CirclePattern className="absolute inset-0 h-full w-full text-white/30" color="white" />
          </div>
          <div className="relative flex flex-1 flex-col items-center justify-center gap-2.5 p-6 text-center">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              markSize={compact ? "sm" : "md"}
            />
            <FieldText
              data={data}
              fieldKey="company"
              className={cn(
                "font-semibold uppercase tracking-[0.18em]",
                tx(compact, "text-[8px]", "text-xs"),
              )}
            >
              {data.company || data.name}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="title"
              className={cn(
                "uppercase tracking-[0.22em] opacity-75",
                tx(compact, "text-[6px]", "text-[10px]"),
              )}
            >
              {data.title}
            </FieldText>
          </div>
        </div>
      );

    case "job-art-frame":
      return (
        <div className={box}>
          <div className="relative flex flex-1 items-center justify-center p-6">
            <div className="relative flex items-center gap-4">
              <span className={cn("w-px shrink-0 bg-current", tx(compact, "h-10", "h-16"))} />
              <div className="text-center">
                <p className={cn("font-black uppercase tracking-tight", tx(compact, "text-xl", "text-4xl"))}>
                  {data.company?.slice(0, 3).toUpperCase() || "ART"}
                </p>
                <FieldText
                  data={data}
                  fieldKey="title"
                  className={cn(
                    "mt-1.5 uppercase tracking-[0.28em] opacity-80",
                    tx(compact, "text-[6px]", "text-[10px]"),
                  )}
                >
                  {data.title}
                </FieldText>
              </div>
              <span className={cn("w-px shrink-0 bg-current", tx(compact, "h-10", "h-16"))} />
            </div>
            <span
              className={cn(
                "absolute top-1/2 h-px bg-current",
                tx(compact, "right-6 w-1/4", "right-8 w-[38%]"),
              )}
            />
          </div>
        </div>
      );

    case "job-photo-split":
      return (
        <div className={box}>
          <div className="relative flex flex-1 flex-col">
            <div className="flex-[3] px-5 pb-2 pt-5">
              <p className={cn("font-bold uppercase tracking-wide", tx(compact, "text-[8px]", "text-xs"))}>
                Photography
              </p>
              <div className={cn("mt-2.5 space-y-1 uppercase tracking-wide", tx(compact, "text-[6px]", "text-[9px]"))}>
                {isFieldEnabled(data, "company") && data.company ? (
                  <FieldText data={data} fieldKey="company">
                    • {data.company}
                  </FieldText>
                ) : null}
                <FieldText data={data} fieldKey="name">
                  • {data.name}
                </FieldText>
              </div>
            </div>
            <div className={cn("relative flex-[2] min-h-[38%]", styles.accent)}>
              <CardBrandMark
                data={data}
                theme={theme}
                styles={{ ...styles, frontText: "text-white" }}
                compact={compact}
                markSize={compact ? "md" : "lg"}
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[42%] text-white drop-shadow-sm"
              />
            </div>
          </div>
        </div>
      );

    case "job-zing-brand":
      return (
        <div className={box}>
          <CardBrandWatermark
            data={data}
            theme={theme}
            fallbackText={data.company?.slice(0, 4).toUpperCase() || "ZING"}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            textClassName={tx(compact, "text-[64px]", "text-[96px]")}
            opacity={0.06}
          />
          <div className="relative flex flex-1 flex-col items-center justify-center p-6">
            <p className={cn("font-black uppercase tracking-tight", tx(compact, "text-2xl", "text-5xl"))}>
              {data.company?.slice(0, 4).toUpperCase() || "ZING"}
            </p>
          </div>
          {isFieldEnabled(data, "website") && data.website ? (
            <FieldText
              data={data}
              fieldKey="website"
              className={cn(
                "relative pb-5 text-center opacity-90",
                tx(compact, "text-[7px]", "text-[11px]"),
              )}
            >
              {data.website}
            </FieldText>
          ) : null}
        </div>
      );

    case "job-zing-dark": {
      const letters = (data.company || "ZING").slice(0, 3).toUpperCase();
      return (
        <div className={box}>
          <CardBrandWatermark
            data={data}
            theme={theme}
            fallbackText={letters}
            className="absolute right-0 top-0"
            textClassName={cn(
              "bg-linear-to-b from-orange-500 to-red-600 bg-clip-text text-transparent",
              tx(compact, "text-[64px]", "text-[100px]"),
            )}
            opacity={0.28}
          />
          <CardBrandWatermark
            data={data}
            theme={theme}
            fallbackText="NG"
            className="absolute bottom-0 left-0"
            textClassName={cn(
              "bg-linear-to-b from-orange-500 to-red-600 bg-clip-text text-transparent",
              tx(compact, "text-[52px]", "text-[84px]"),
            )}
            opacity={0.28}
          />
          <div className="relative flex flex-1 flex-col justify-end gap-1.5 p-6">
            <FieldText
              data={data}
              fieldKey="name"
              as="p"
              className={cn("font-bold leading-tight tracking-tight", tx(compact, "text-[10px]", "text-lg"))}
            >
              {data.name}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="title"
              as="p"
              className={cn("leading-snug opacity-80", tx(compact, "text-[8px]", "text-sm"))}
            >
              {data.title}
            </FieldText>
          </div>
        </div>
      );
    }

    case "job-notice": {
      const initial = (data.company || "Notice").charAt(0).toUpperCase();
      return (
        <div className={box}>
          <CardBrandWatermark
            data={data}
            theme={theme}
            fallbackText={initial}
            className="absolute left-0 top-1/2 -translate-y-1/2"
            textClassName={tx(compact, "text-[72px]", "text-[132px]")}
            opacity={0.22}
          />
          <div className="relative flex flex-1 items-end justify-end p-6">
            <p className={cn("font-bold tracking-tight", tx(compact, "text-sm", "text-2xl"))}>
              {data.company || "Notice"}
            </p>
          </div>
        </div>
      );
    }

    case "job-organic":
      return (
        <div className={box}>
          <div className="pointer-events-none absolute -left-10 top-6 size-28 rounded-full bg-white/95" />
          <div className="pointer-events-none absolute -right-12 -bottom-2 size-36 rounded-t-full bg-white/95" />
          <div className="relative flex flex-1 flex-col items-center justify-center gap-1.5 p-6 text-center">
            <FieldText
              data={data}
              fieldKey="name"
              className={cn("font-bold uppercase tracking-wide", tx(compact, "text-[10px]", "text-base"))}
            >
              {data.name}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="title"
              className={cn("uppercase tracking-[0.2em] opacity-75", tx(compact, "text-[7px]", "text-[10px]"))}
            >
              {data.title}
            </FieldText>
          </div>
        </div>
      );

    case "job-arch-split":
      return (
        <div className={box}>
          <CardBrandMark
            data={data}
            theme={theme}
            styles={styles}
            compact={compact}
            markSize={compact ? "sm" : "md"}
            className="absolute right-5 top-5"
          />
          <div className="flex flex-1 items-end p-6">
            <p className={cn("leading-snug lowercase opacity-90", tx(compact, "text-[9px]", "text-sm"))}>
              we design
              <br />
              spaces
            </p>
          </div>
        </div>
      );

    case "job-electric-plug":
    case "job-electric-service":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              {(() => {
                const { first, last } = splitName(data.name);
                return (
                  <>
                    <FieldText
                      data={data}
                      fieldKey="name"
                      className={cn("uppercase", tx(compact, "text-[9px]", "text-sm"))}
                    >
                      {first}
                    </FieldText>
                    <p className={cn("font-bold uppercase", tx(compact, "text-[11px]", "text-lg"))}>
                      {last || first}
                    </p>
                  </>
                );
              })()}
              <FieldText
                data={data}
                fieldKey="title"
                className={cn(
                  "mt-1 uppercase tracking-widest opacity-70",
                  tx(compact, "text-[6px]", "text-[10px]"),
                )}
              >
                {data.title}
              </FieldText>
            </div>
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              markSize={compact ? "md" : "lg"}
              className="ml-auto opacity-95"
            />
          </div>
        </div>
      );

    case "job-electric-split":
      return (
        <div className={cn(box, "flex-row")}>
          <div className={cn("flex w-1/2 flex-col justify-between p-5", styles.accent, styles.initialsText)}>
            <FieldText
              data={data}
              fieldKey="name"
              className={cn("font-bold uppercase tracking-wide", tx(compact, "text-[7px]", "text-[10px]"))}
            >
              {data.name}
            </FieldText>
            <p className={cn("mx-auto font-black leading-none", tx(compact, "text-3xl", "text-5xl"))}>+</p>
          </div>
          <div className={cn("flex w-1/2 flex-col justify-between bg-white p-5", styles.text)}>
            <p className={cn("mx-auto font-black leading-none", tx(compact, "text-3xl", "text-5xl"))}>−</p>
            <FieldText
              data={data}
              fieldKey="title"
              className={cn("text-right font-bold uppercase tracking-wide", tx(compact, "text-[6px]", "text-[9px]"))}
            >
              {data.title}
            </FieldText>
          </div>
        </div>
      );

    case "job-type-stack":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center">
            <FieldText
              data={data}
              fieldKey="name"
              className={cn(
                "font-black uppercase leading-none tracking-tighter opacity-20",
                tx(compact, "text-lg", "text-3xl"),
              )}
            >
              {data.name}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="name"
              className={cn(
                "-mt-4 font-black uppercase leading-none tracking-tighter",
                tx(compact, "text-xl", "text-4xl"),
              )}
            >
              {data.name}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="title"
              className={cn("mt-3 italic opacity-90", tx(compact, "text-[8px]", "text-sm"))}
            >
              {data.title}
            </FieldText>
          </div>
        </div>
      );

    case "job-diagonal":
      return (
        <div className={box}>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <p className={cn("absolute font-black uppercase tracking-wider opacity-15", tx(compact, "text-2xl", "text-5xl"))}>
              hello
            </p>
            <p className={cn("absolute translate-y-[-8px] font-black uppercase tracking-wider opacity-25", tx(compact, "text-2xl", "text-5xl"))}>
              hello
            </p>
            <p className={cn("relative font-black uppercase tracking-wider", tx(compact, "text-2xl", "text-5xl"))}>
              hello
            </p>
          </div>
        </div>
      );

    case "job-legal":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col items-center justify-center gap-2.5 p-6 text-center">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              markSize={compact ? "sm" : "md"}
            />
            <p className={cn("font-bold uppercase tracking-[0.15em]", tx(compact, "text-sm", "text-2xl"))}>
              {data.company?.split(" ")[0]?.toUpperCase() || "DANTAS"}
            </p>
            <FieldText
              data={data}
              fieldKey="title"
              className={cn("uppercase tracking-[0.28em] opacity-80", tx(compact, "text-[7px]", "text-[10px]"))}
            >
              {data.title}
            </FieldText>
          </div>
        </div>
      );

    case "job-rocket-pattern":
      return (
        <div className={box}>
          <div className={cn("absolute left-0 top-0 h-full w-[38%]", styles.accent)}>
            <CirclePattern className="h-full w-full text-white/35" color="white" />
          </div>
          <div className="relative flex flex-1 flex-col items-center justify-center gap-2 p-6 pl-[40%] text-center">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              markSize={compact ? "sm" : "md"}
            />
            <FieldText
              data={data}
              fieldKey="company"
              className={cn("font-semibold uppercase tracking-[0.18em]", tx(compact, "text-[8px]", "text-xs"))}
            >
              {data.company || "R-Square"}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="title"
              className={cn("opacity-80", tx(compact, "text-[6px]", "text-[9px]"))}
            >
              {data.title}
            </FieldText>
          </div>
        </div>
      );

    case "job-terra":
      return (
        <div className={box}>
          <CardBrandWatermark
            data={data}
            theme={theme}
            fallbackText={data.company?.slice(0, 4).toUpperCase() || "TERA"}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            textClassName={tx(compact, "text-[56px]", "text-[72px]")}
            opacity={0.12}
          />
          <div className="relative flex flex-1 flex-col justify-between p-6">
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              nameClassName={cn("font-bold uppercase leading-tight tracking-tight", tx(compact, "text-[10px]", "text-xl"))}
              titleClassName={cn("uppercase tracking-wide opacity-80", tx(compact, "text-[7px]", "text-[11px]"))}
            />
          </div>
        </div>
      );

    case "job-terra-law":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <p className={cn("font-black uppercase", tx(compact, "text-2xl", "text-5xl"))}>
              {data.company?.slice(0, 4).toUpperCase() || "TERA"}
            </p>
            <FieldText
              data={data}
              fieldKey="title"
              className={cn("uppercase tracking-[0.25em]", tx(compact, "text-[7px]", "text-[11px]"))}
            >
              {data.title}
            </FieldText>
          </div>
        </div>
      );

    case "job-restaurant":
      return (
        <div className={box}>
          <CardWatermarkLogo
            data={data}
            theme={theme}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            opacity={0.06}
          />
          <div className="relative flex flex-1 items-center justify-between gap-4 p-6">
            <FieldText
              data={data}
              fieldKey="company"
              className={cn("font-medium tracking-tight", tx(compact, "text-[8px]", "text-sm"))}
            >
              {data.company || "Coast Restaurant"}
            </FieldText>
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              markSize={compact ? "sm" : "md"}
            />
          </div>
        </div>
      );

    case "job-agency":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              markSize={compact ? "sm" : "md"}
            />
            <FieldText
              data={data}
              fieldKey="company"
              className={cn("font-semibold uppercase tracking-[0.2em]", tx(compact, "text-[8px]", "text-xs"))}
            >
              {data.company || data.name}
            </FieldText>
          </div>
        </div>
      );

    case "job-hello-stack":
      return (
        <div className={box}>
          <div className="relative flex flex-1 items-center justify-center">
            <p className={cn("absolute -translate-y-2 opacity-25", tx(compact, "text-xl", "text-4xl"))}>
              HELLO
            </p>
            <p className={cn("absolute translate-y-1 opacity-15", tx(compact, "text-xl", "text-4xl"))}>
              HELLO
            </p>
            <p className={cn("relative font-black uppercase", tx(compact, "text-xl", "text-4xl"))}>
              HELLO
            </p>
          </div>
        </div>
      );

    case "job-vibrant":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <FieldText
              data={data}
              fieldKey="name"
              className={cn("font-bold uppercase", tx(compact, "text-[10px]", "text-lg"))}
            >
              {data.name}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="title"
              className={tx(compact, "text-[8px]", "text-sm")}
            >
              {data.title}
            </FieldText>
            <span className={cn("mt-2 h-1 w-12 rounded-full", styles.accent)} />
          </div>
        </div>
      );

    default:
      return (
        <div className={box}>
          <div className="flex flex-1 items-center justify-center p-6">
            <FieldText
              data={data}
              fieldKey="name"
              className={cn("font-bold", tx(compact, "text-[10px]", "text-lg"))}
            >
              {data.name}
            </FieldText>
          </div>
        </div>
      );
  }
}

export function JobCardBack({
  data,
  theme,
  styles,
  compact,
  className,
  interactive = false,
  onLinkClick,
}: JobBackProps) {
  const layout = theme.layout;
  const box = shell(styles, theme, compact, "back", className);

  switch (layout) {
    case "job-hi":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col justify-between p-6">
            <div className="grid grid-cols-2 items-start gap-6">
              <ContactList
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
              />
              <NameTitleStack
                data={data}
                compact={compact}
                styles={styles}
                align="end"
                nameClassName={cn("font-bold leading-tight", tx(compact, "text-[10px]", "text-xl"))}
                titleClassName={cn("opacity-80", tx(compact, "text-[8px]", "text-sm"))}
              />
            </div>
          </div>
        </div>
      );

    case "job-chevron":
      return (
        <div className={box}>
          <CardWatermarkLogo
            data={data}
            theme={theme}
            className="absolute -left-10 bottom-0"
            opacity={0.07}
          />
          <div className="relative flex flex-1 flex-col items-end justify-between p-6 text-right">
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              align="end"
              nameClassName={cn("font-bold uppercase tracking-wide", tx(compact, "text-[10px]", "text-lg"))}
              titleClassName={cn("opacity-80", tx(compact, "text-[8px]", "text-sm"))}
            />
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );

    case "job-art-frame": {
      const { first, last } = splitName(data.name);
      return (
        <div className={cn(box, "flex-row")}>
          <div className="flex w-[45%] flex-col justify-center border-r border-neutral-200 p-4">
            <p className={cn("font-bold uppercase", tx(compact, "text-[10px]", "text-xl"))}>
              {first}
            </p>
            <div className="mt-1 flex items-end gap-2">
              <span className={cn("h-0.5 w-6 bg-current", styles.accent)} />
              <p className={cn("font-bold uppercase", tx(compact, "text-[11px]", "text-2xl"))}>
                {last}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 p-4">
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );
    }

    case "job-photo-split":
      return (
        <div className={box}>
          <div className={cn("relative h-[28%] shrink-0", styles.accent)}>
            <CardBrandMark
              data={data}
              theme={theme}
              styles={{ ...styles, frontText: "text-white" }}
              compact={compact}
              markSize="sm"
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white"
            />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
            <p className={cn("font-bold uppercase tracking-wide", tx(compact, "text-[9px]", "text-sm"))}>
              Photography
            </p>
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );

    case "job-zing-dark":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col items-end justify-end gap-1 p-5 text-right">
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );

    case "job-notice":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <NameTitleStack
                data={data}
                compact={compact}
                styles={styles}
                nameClassName={cn("font-bold", tx(compact, "text-[10px]", "text-lg"))}
                titleClassName={tx(compact, "text-[8px]", "text-sm")}
              />
              <div className={cn("mt-3 space-y-1", tx(compact, "text-[7px]", "text-[11px]"))}>
                {isFieldEnabled(data, "phone") && data.phone ? (
                  <FieldText data={data} fieldKey="phone">
                    <span className="font-bold">T</span> {data.phone}
                  </FieldText>
                ) : null}
                {isFieldEnabled(data, "email") && data.email ? (
                  <FieldText data={data} fieldKey="email">
                    <span className="font-bold">E</span> {data.email}
                  </FieldText>
                ) : null}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className={tx(compact, "text-[7px]", "text-[10px]")}>
                {isFieldEnabled(data, "company") && data.company ? (
                  <FieldText data={data} fieldKey="company" className="font-bold">
                    {data.company}
                  </FieldText>
                ) : null}
              </div>
              <p className={cn("font-bold", tx(compact, "text-sm", "text-2xl"))}>
                {data.company || "Notice"}
              </p>
            </div>
          </div>
        </div>
      );

    case "job-organic":
      return (
        <div className={box}>
          <div className={cn("pointer-events-none absolute right-0 top-0 h-full w-[52%] rounded-l-[88px]", styles.accent)} />
          <div className="relative flex flex-1 flex-col justify-center gap-2 p-6 uppercase tracking-[0.18em]">
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );

    case "job-arch-split":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-row">
            <div className="flex w-[38%] flex-col justify-end p-5">
              <CardBrandMark
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                markSize={compact ? "md" : "lg"}
              />
              <FieldText
                data={data}
                fieldKey="company"
                className={cn("mt-2.5 font-bold leading-snug", tx(compact, "text-[8px]", "text-sm"))}
              >
                {data.company || "Nirman Architecture"}
              </FieldText>
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <ContactList
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
              />
              {isFieldEnabled(data, "website") && data.website ? (
                <FieldText
                  data={data}
                  fieldKey="website"
                  className={cn("font-bold", tx(compact, "text-[8px]", "text-sm"))}
                >
                  {data.website}
                </FieldText>
              ) : null}
            </div>
          </div>
        </div>
      );

    case "job-electric-plug":
    case "job-electric-service":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className={cn("font-medium uppercase", tx(compact, "text-[8px]", "text-xs"))}>
              {data.title} &amp; Lighting Installation
            </p>
            <p className={cn("font-bold uppercase", tx(compact, "text-[7px]", "text-[10px]"))}>
              Contact me at:
            </p>
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
            {isFieldEnabled(data, "website") && data.website ? (
              <FieldText
                data={data}
                fieldKey="website"
                className={tx(compact, "text-[7px]", "text-[11px]")}
              >
                {data.website}
              </FieldText>
            ) : null}
          </div>
        </div>
      );

    case "job-electric-split":
      return (
        <div className={cn(box, "flex-row")}>
          <div className={cn("flex w-1/2 flex-col justify-end p-5", styles.accent, styles.initialsText)}>
            <ContactList
              data={data}
              styles={{ ...styles, subtext: "text-white/75", text: "text-white" }}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
          <div className={cn("flex w-1/2 flex-col justify-start bg-white p-5", styles.text)}>
            <p className={cn("uppercase tracking-wide opacity-80", tx(compact, "text-[6px]", "text-[9px]"))}>
              — Maintenance and repairs
            </p>
          </div>
        </div>
      );

    case "job-type-stack":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );

    case "job-diagonal":
      return (
        <div className={box}>
          <div
            className={cn("absolute inset-0", styles.accent)}
            style={{ clipPath: "polygon(0 0, 58% 0, 48% 100%, 0 100%)" }}
            aria-hidden
          />
          <div className="relative flex flex-1">
            <div className={cn("flex w-[52%] flex-col justify-center gap-1.5 p-6", styles.initialsText)}>
              <FieldText
                data={data}
                fieldKey="name"
                as="p"
                className={cn("font-bold uppercase leading-tight tracking-wide", tx(compact, "text-[9px]", "text-sm"))}
              >
                {data.name}
              </FieldText>
              <FieldText
                data={data}
                fieldKey="title"
                as="p"
                className={cn("leading-snug opacity-85", tx(compact, "text-[7px]", "text-[10px]"))}
              >
                {data.title}
              </FieldText>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-2 p-6">
              <p className={cn("font-bold uppercase tracking-wide", tx(compact, "text-[8px]", "text-xs"))}>
                Contact
              </p>
              <ContactList
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
              />
            </div>
          </div>
        </div>
      );

    case "job-legal":
      return (
        <div className={box}>
          <div className="pointer-events-none absolute left-0 top-0 flex h-full w-10 items-center justify-center overflow-hidden opacity-[0.07]">
            <CardWatermarkLogo
              data={data}
              theme={theme}
              markSize="lg"
              className="rotate-90 scale-150"
              opacity={1}
            />
          </div>
          <div className="relative flex flex-1 flex-col justify-between p-6 pl-12">
            <div className="flex items-start justify-between gap-3">
              <NameTitleStack
                data={data}
                compact={compact}
                styles={styles}
                nameClassName={cn("font-bold uppercase tracking-wide", tx(compact, "text-[9px]", "text-sm"))}
                titleClassName={cn("opacity-80", tx(compact, "text-[7px]", "text-[10px]"))}
              />
              <CardBrandMark
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                markSize="sm"
              />
            </div>
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );

    case "job-rocket-pattern":
      return (
        <div className={box}>
          <div className={cn("absolute left-0 top-0 h-16 w-16", styles.accent)}>
            <CirclePattern className="h-full w-full text-white/40" color="white" />
          </div>
          <div className="flex flex-1 flex-col justify-between p-5 pl-20">
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              align="end"
              nameClassName={cn("font-bold uppercase", tx(compact, "text-[10px]", "text-lg"))}
              titleClassName={tx(compact, "text-[7px]", "text-[10px]")}
            />
            <div className="flex items-end gap-3">
              {!compact ? <DecorativeQrPlaceholder className="size-12" /> : null}
              <ContactList
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
              />
            </div>
          </div>
        </div>
      );

    case "job-restaurant":
      return (
        <div className={box}>
          <CardWatermarkLogo
            data={data}
            theme={theme}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            opacity={0.05}
          />
          <CardBrandMark
            data={data}
            theme={theme}
            styles={styles}
            compact={compact}
            markSize="sm"
            className="absolute left-5 top-5"
          />
          <div className="relative flex flex-1 flex-col justify-end p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <FieldText
                  data={data}
                  fieldKey="name"
                  className={cn("font-semibold", tx(compact, "text-[8px]", "text-sm"))}
                >
                  {data.name}
                </FieldText>
                <ContactList
                  data={data}
                  styles={styles}
                  compact={compact}
                  interactive={interactive}
                  onLinkClick={onLinkClick}
                />
              </div>
              <div className="text-right">
                <FieldText
                  data={data}
                  fieldKey="company"
                  className={cn("font-semibold", tx(compact, "text-[8px]", "text-sm"))}
                >
                  {data.company}
                </FieldText>
              </div>
            </div>
          </div>
        </div>
      );

    case "job-zing-brand":
    case "job-terra-law":
    case "job-agency":
    case "job-vibrant":
    case "job-hello-stack":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col justify-center gap-2 p-5">
            <FieldText
              data={data}
              fieldKey="name"
              className={cn("font-bold", tx(compact, "text-[10px]", "text-lg"))}
            >
              {data.name}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="title"
              className={tx(compact, "text-[8px]", "text-sm")}
            >
              {data.title}
            </FieldText>
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );

    case "job-terra":
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col justify-center gap-2 p-5">
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );

    default:
      return (
        <div className={box}>
          <div className="flex flex-1 flex-col justify-center gap-2 p-5">
            <FieldText
              data={data}
              fieldKey="name"
              className={cn("font-bold", tx(compact, "text-[10px]", "text-lg"))}
            >
              {data.name}
            </FieldText>
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
          </div>
        </div>
      );
  }
}

export const JOB_LAYOUTS = new Set<CardLayout>([
  "job-hi",
  "job-chevron",
  "job-art-frame",
  "job-photo-split",
  "job-zing-brand",
  "job-zing-dark",
  "job-notice",
  "job-organic",
  "job-arch-split",
  "job-electric-plug",
  "job-electric-service",
  "job-electric-split",
  "job-type-stack",
  "job-diagonal",
  "job-legal",
  "job-rocket-pattern",
  "job-terra",
  "job-terra-law",
  "job-restaurant",
  "job-agency",
  "job-hello-stack",
  "job-vibrant",
]);

export function isJobLayout(layout: CardLayout): boolean {
  return JOB_LAYOUTS.has(layout);
}
