"use client";

import type { CardData } from "@/lib/card-data";
import type { CardLayout, CardTheme } from "@/lib/card-themes";
import { isFieldEnabled } from "@/lib/card-field-utils";
import {
  CardBrandMark,
} from "@/features/builder/components/card-brand-elements";
import { FieldText } from "@/features/builder/components/field-text";
import { NameTitleStack } from "@/features/builder/components/card-name-title";
import {
  ContactList,
  type LinkClickPayload,
} from "@/features/builder/components/card-layouts";
import {
  useLayoutShell,
  tx,
} from "@/features/builder/components/card-layout-utils";
import { DecorativeQrPlaceholder } from "@/features/builder/components/card-layout-marks";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

type ProLayoutProps = {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  compact?: boolean;
  className?: string;
};

type ProBackProps = ProLayoutProps & {
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
};

function companyWord(data: CardData) {
  return data.company?.trim() || data.name.trim().split(/\s+/)[0] || "Brand";
}

function BrandLockup({
  data,
  theme,
  styles,
  compact,
  className,
  markClassName,
  nameClassName,
}: {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  compact?: boolean;
  className?: string;
  markClassName?: string;
  nameClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <CardBrandMark
        data={data}
        theme={theme}
        styles={styles}
        compact={compact}
        className={cn(tx(compact, "h-7 w-7", "h-10 w-10"), markClassName)}
      />
      <FieldText
        data={data}
        fieldKey="company"
        className={cn(
          "mt-2 font-bold uppercase tracking-wide",
          tx(compact, "text-[8px]", "text-sm"),
          nameClassName,
        )}
      >
        {data.company || companyWord(data)}
      </FieldText>
    </div>
  );
}

export function ProCardFront({
  data,
  theme,
  styles,
  compact,
  className,
}: ProLayoutProps) {
  const shell = useLayoutShell();
  const layout = theme.layout;

  switch (layout) {
    case "mod-slate-wedge":
      return (
        <div className={shell(styles, theme, compact, "front", className)}>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/[0.03]"
            aria-hidden
          />
          <div
            className="absolute inset-y-0 right-0 w-[38%] bg-[#1A1A1A] text-white"
            style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }}
          >
            <div className="flex h-full flex-col items-center justify-center px-[12%] text-center">
              <BrandLockup
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                nameClassName="text-white"
              />
            </div>
          </div>
        </div>
      );

    case "mod-wilson-split":
      return (
        <div
          className={shell(
            styles,
            theme,
            compact,
            "front",
            cn("flex flex-row overflow-hidden", className),
          )}
        >
          <div className="flex w-[42%] flex-col justify-between bg-black p-[8%] text-white">
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              className="gap-2 [&_svg]:text-white/80"
            />
            <DecorativeQrPlaceholder
              className={cn(
                "mt-3 self-start invert",
                tx(compact, "h-10 w-10", "h-14 w-14"),
              )}
            />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center bg-[#4A4A4A] p-[8%] text-white">
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              align="center"
              nameClassName={cn(
                "font-bold uppercase tracking-wide",
                tx(compact, "text-[9px]", "text-sm"),
              )}
              titleClassName={cn("opacity-80", tx(compact, "text-[6px]", "text-[10px]"))}
            />
            <BrandLockup
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              className="mt-4"
            />
          </div>
        </div>
      );

    case "mod-fluid-noir":
      return (
        <div className={shell(styles, theme, compact, "front", className)}>
          <div
            className="pointer-events-none absolute -left-[10%] -top-[15%] h-[45%] w-[50%] rounded-[999px] bg-white"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-[20%] -right-[8%] h-[55%] w-[60%] rounded-tl-[999px] bg-white"
            aria-hidden
          />
          <div className="relative flex flex-1 flex-col items-end justify-center px-[10%] py-[12%] text-right">
            <FieldText
              data={data}
              fieldKey="name"
              className={cn(
                "font-bold uppercase tracking-wide",
                tx(compact, "text-[11px]", "text-lg"),
              )}
            >
              {data.name}
            </FieldText>
          </div>
        </div>
      );

    case "mod-argentum":
      return (
        <div className={shell(styles, theme, compact, "front", className)}>
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-[70%] w-[55%] opacity-30"
            style={{
              background:
                "repeating-linear-gradient(135deg, #C0C0C0 0 2px, transparent 2px 14px)",
              clipPath: "polygon(0 100%, 0 20%, 100% 100%)",
            }}
            aria-hidden
          />
          <div className="relative flex flex-1 items-center justify-end p-[10%]">
            <div className="rounded-xl border border-white/10 bg-black/40 px-[8%] py-[6%] shadow-lg backdrop-blur-sm">
              <FieldText
                data={data}
                fieldKey="company"
                className={cn(
                  "font-serif font-semibold",
                  tx(compact, "text-[10px]", "text-base"),
                )}
              >
                {data.company || companyWord(data)}
              </FieldText>
            </div>
          </div>
        </div>
      );

    case "mod-ribbon-noir":
      return (
        <div className={shell(styles, theme, compact, "front", className)}>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-white/[0.06] via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative flex flex-1 flex-col justify-center px-[10%]">
            <BrandLockup
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              className="items-start text-left"
            />
          </div>
          <div
            className="absolute bottom-[12%] right-0 flex items-center bg-white px-[6%] py-[2%] text-black shadow-md"
            style={{ transform: "skewX(-12deg)" }}
          >
            <span
              className={cn(
                "uppercase tracking-wider",
                tx(compact, "text-[5px]", "text-[8px]"),
              )}
              style={{ transform: "skewX(12deg)" }}
            >
              design | brand | studio
            </span>
          </div>
        </div>
      );

    case "mod-crimson-pill":
      return (
        <div className={shell(styles, theme, compact, "front", className)}>
          <div className="pointer-events-none absolute bottom-0 left-[22%] h-[38%] w-[5%] rounded-full bg-[#E31E24]" aria-hidden />
          <div className="pointer-events-none absolute right-[22%] top-0 h-[28%] w-[5%] rounded-full bg-neutral-600" aria-hidden />
          <div className="relative flex flex-1 items-center justify-center">
            <BrandLockup data={data} theme={theme} styles={styles} compact={compact} />
          </div>
        </div>
      );

    case "mod-ampere":
      return (
        <div
          className={shell(
            styles,
            theme,
            compact,
            "front",
            cn("flex flex-row overflow-hidden", className),
          )}
        >
          <div className="relative flex w-[42%] items-center justify-center bg-black text-white">
            <div className="absolute inset-y-[12%] right-0 w-[85%] rounded-l-[999px] border-2 border-white/20 bg-black" />
            <div className="relative z-10 px-[10%]">
              <BrandLockup
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                markClassName="text-white"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-3 p-[8%]">
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              nameClassName={cn(
                "font-bold uppercase",
                tx(compact, "text-[9px]", "text-sm"),
              )}
              titleClassName={cn("uppercase opacity-70", tx(compact, "text-[6px]", "text-[10px]"))}
            />
            <ContactList data={data} styles={styles} compact={compact} />
          </div>
        </div>
      );

    case "mod-taupe-geo":
      return (
        <div className={shell(styles, theme, compact, "front", className)}>
          <div
            className="absolute left-0 top-0 h-[55%] w-[48%] bg-[#2D2D2D] text-[#C4A882]"
            style={{ borderBottomRightRadius: "999px" }}
          >
            <div className="flex h-full flex-col justify-center px-[10%]">
              <FieldText
                data={data}
                fieldKey="company"
                className={cn(
                  "font-bold uppercase",
                  tx(compact, "text-[9px]", "text-sm"),
                )}
              >
                {data.company || companyWord(data)}
              </FieldText>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-[10%] left-[8%] grid grid-cols-8 gap-1 opacity-40" aria-hidden>
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="size-1 rounded-full bg-[#2D2D2D]" />
            ))}
          </div>
          <div className="pointer-events-none absolute right-[8%] top-[18%] flex gap-1" aria-hidden>
            <span className="size-2 bg-[#2D2D2D]" />
            <span className="size-2 rounded-full bg-[#2D2D2D]" />
            <span className="size-2 rounded-bl-full bg-[#2D2D2D]" />
          </div>
        </div>
      );

    case "mod-block-dark":
      return (
        <div className={shell(styles, theme, compact, "front", className)}>
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-[65%] w-[55%] bg-neutral-700"
            style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-[22%] w-[22%] bg-white"
            style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
            aria-hidden
          />
          <div className="relative flex flex-1 flex-col p-[9%]">
            <div className="self-end text-right">
              <FieldText
                data={data}
                fieldKey="name"
                className={cn(
                  "font-bold uppercase",
                  tx(compact, "text-[10px]", "text-base"),
                )}
              >
                {data.name}
              </FieldText>
              {isFieldEnabled(data, "title") && (
                <FieldText
                  data={data}
                  fieldKey="title"
                  className={cn(
                    "mt-1 uppercase opacity-75",
                    tx(compact, "text-[6px]", "text-[10px]"),
                  )}
                >
                  {data.title}
                </FieldText>
              )}
              <div className="mx-auto mt-1 h-px w-full max-w-[80%] bg-current opacity-40" />
            </div>
            <div className="mt-auto flex items-end justify-between gap-3">
              <BrandLockup
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                className="items-start text-left"
                markClassName="opacity-90"
              />
              <ContactList
                data={data}
                styles={styles}
                compact={compact}
                className="max-w-[48%] text-right"
              />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function ProCardBack({
  data,
  theme,
  styles,
  compact,
  className,
  interactive,
  onLinkClick,
}: ProBackProps) {
  const shell = useLayoutShell();
  const layout = theme.layout;

  switch (layout) {
    case "mod-slate-wedge":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/[0.03]"
            aria-hidden
          />
          <div className="relative flex flex-1 flex-col p-[9%]">
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              nameClassName={cn(
                "font-bold uppercase",
                tx(compact, "text-[11px]", "text-lg"),
              )}
              titleClassName={cn("opacity-75", tx(compact, "text-[7px]", "text-[11px]"))}
            />
            <div className="mt-2 h-px w-[35%] bg-current opacity-30" />
            <div className="relative mt-auto flex items-stretch gap-3">
              <div
                className="flex w-[18%] flex-col items-center justify-center gap-3 bg-[#1A1A1A] py-[6%] text-white"
                style={{ clipPath: "polygon(0 0, 100% 8%, 100% 92%, 0 100%)" }}
              >
                <span className="size-1.5 rounded-full bg-white/80" aria-hidden />
                <span className="size-1.5 rounded-full bg-white/80" aria-hidden />
                <span className="size-1.5 rounded-full bg-white/80" aria-hidden />
                <span className="size-1.5 rounded-full bg-white/80" aria-hidden />
              </div>
              <ContactList
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
                className="flex-1 justify-center py-[4%]"
              />
            </div>
          </div>
        </div>
      );

    case "mod-wilson-split":
      return (
        <div
          className={shell(
            styles,
            theme,
            compact,
            "back",
            cn("flex overflow-hidden", className),
          )}
        >
          <div className="w-[6%] bg-[#4A4A4A]" aria-hidden />
          <div className="flex flex-1 items-center justify-center bg-black">
            <BrandLockup
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              markClassName="text-white"
              nameClassName="text-white"
            />
          </div>
        </div>
      );

    case "mod-fluid-noir":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <div
            className="pointer-events-none absolute -right-[5%] -top-[10%] h-[70%] w-[55%] rounded-bl-[999px] bg-black"
            aria-hidden
          />
          <div className="relative flex flex-1 flex-col justify-center px-[10%] py-[12%]">
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
              className="gap-2 uppercase tracking-wide"
            />
          </div>
        </div>
      );

    case "mod-argentum":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <div
            className="pointer-events-none absolute right-0 top-0 h-[55%] w-[50%] opacity-25"
            style={{
              background:
                "repeating-linear-gradient(-135deg, #C0C0C0 0 2px, transparent 2px 14px)",
              clipPath: "polygon(100% 0, 20% 0, 100% 100%)",
            }}
            aria-hidden
          />
          <div className="relative flex flex-1 flex-col gap-3 p-[9%]">
            <div className="rounded-xl border border-white/10 bg-black/40 px-[7%] py-[5%] shadow-lg">
              <NameTitleStack
                data={data}
                compact={compact}
                styles={styles}
                nameClassName={cn(
                  "font-serif font-semibold",
                  tx(compact, "text-[9px]", "text-sm"),
                )}
                titleClassName={cn("opacity-75", tx(compact, "text-[6px]", "text-[10px]"))}
              />
            </div>
            <div className="mt-auto flex gap-2">
              <div className="flex-1 rounded-xl border border-white/10 bg-black/40 px-[7%] py-[5%] shadow-lg">
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
        </div>
      );

    case "mod-ribbon-noir":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <div className="relative flex flex-1 flex-row items-center justify-between gap-4 p-[9%]">
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              nameClassName={cn(
                "font-bold uppercase",
                tx(compact, "text-[10px]", "text-base"),
              )}
              titleClassName={cn("opacity-80", tx(compact, "text-[7px]", "text-[11px]"))}
            />
            <div className="flex flex-col gap-2">
              {(["phone", "email", "website"] as const).map((key) => {
                const value = data[key];
                if (!isFieldEnabled(data, key) || !value) return null;
                return (
                  <div
                    key={key}
                    className="flex min-w-[42%] items-center bg-white px-[5%] py-[3%] text-black shadow-md"
                    style={{ transform: "skewX(-10deg)" }}
                  >
                    <span style={{ transform: "skewX(10deg)" }}>
                      <FieldText
                        data={data}
                        fieldKey={key}
                        className={cn(
                          "truncate",
                          tx(compact, "text-[5.5px]", "text-[9px]"),
                        )}
                      >
                        {value}
                      </FieldText>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );

    case "mod-crimson-pill":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <DecorativeQrPlaceholder
            className={cn(
              "absolute right-[8%] top-[8%] invert",
              tx(compact, "h-9 w-9", "h-12 w-12"),
            )}
          />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-[68%] w-[6%] -translate-x-1/2 rounded-full bg-[#E31E24]" aria-hidden />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[24%] w-[6%] -translate-x-1/2 rounded-full bg-neutral-600" aria-hidden />
          <div className="relative flex flex-1 flex-row items-end justify-between p-[9%]">
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              nameClassName={cn(
                "font-bold uppercase",
                tx(compact, "text-[10px]", "text-base"),
              )}
              titleClassName={cn("opacity-80", tx(compact, "text-[7px]", "text-[11px]"))}
            />
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
              className="max-w-[46%] pb-[6%]"
            />
          </div>
        </div>
      );

    case "mod-ampere":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, #000 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden
          />
          <div className="relative flex flex-1 items-center justify-center">
            <div className="absolute inset-[10%] rounded-[999px] border-[3px] border-black" />
            <BrandLockup
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              markClassName="text-white"
              nameClassName="text-white"
            />
          </div>
        </div>
      );

    case "mod-taupe-geo":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <div
            className="absolute left-0 top-0 h-[38%] w-[42%] bg-[#C4A882] text-[#2D2D2D]"
            style={{ borderBottomRightRadius: "999px" }}
          >
            <div className="flex h-full flex-col justify-center px-[10%]">
              <FieldText
                data={data}
                fieldKey="company"
                className={cn(
                  "font-bold uppercase",
                  tx(compact, "text-[8px]", "text-xs"),
                )}
              >
                {data.company || companyWord(data)}
              </FieldText>
            </div>
          </div>
          <div className="relative flex flex-1 flex-col p-[9%]">
            <div className="self-end text-right">
              <NameTitleStack
                data={data}
                compact={compact}
                styles={styles}
                align="end"
                nameClassName={cn(
                  "font-bold uppercase",
                  tx(compact, "text-[9px]", "text-sm"),
                )}
                titleClassName={cn("uppercase opacity-75", tx(compact, "text-[6px]", "text-[10px]"))}
              />
            </div>
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
              className="mt-auto gap-2"
            />
            <div className="pointer-events-none absolute bottom-[8%] right-[8%] flex gap-1" aria-hidden>
              <span className="size-3 rounded-tr-full bg-[#C4A882]" />
              <span className="size-2 rounded-full bg-[#C4A882]" />
            </div>
          </div>
        </div>
      );

    case "mod-block-dark":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <div className="pointer-events-none absolute left-[8%] top-1/2 flex -translate-y-1/2 flex-col gap-1" aria-hidden>
            <span className="h-[28%] w-2 bg-white" />
            <span className="h-[22%] w-2 bg-neutral-400" />
            <span className="h-[18%] w-2 bg-neutral-600" />
          </div>
          <div className="relative flex flex-1 items-center justify-end px-[12%]">
            <BrandLockup
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              className="text-right"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}

export const PRO_LAYOUTS = new Set<CardLayout>([
  "mod-slate-wedge",
  "mod-wilson-split",
  "mod-fluid-noir",
  "mod-argentum",
  "mod-ribbon-noir",
  "mod-crimson-pill",
  "mod-ampere",
  "mod-taupe-geo",
  "mod-block-dark",
]);

export function isProLayout(layout: CardLayout): boolean {
  return PRO_LAYOUTS.has(layout);
}
