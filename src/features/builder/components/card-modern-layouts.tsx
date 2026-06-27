import type { CardData } from "@/lib/card-data";
import type { CardLayout, CardTheme } from "@/lib/card-themes";
import { isFieldEnabled } from "@/lib/card-field-utils";
import {
  CardBrandMark,
  CardBrandWatermark,
  CardLogo,
  CardWatermarkLogo,
} from "@/features/builder/components/card-brand-elements";
import { FieldText } from "@/features/builder/components/field-text";
import { NameTitleStack } from "@/features/builder/components/card-name-title";
import {
  ContactList,
  type LinkClickPayload,
} from "@/features/builder/components/card-layouts";
import { layoutShell, tx } from "@/features/builder/components/card-layout-utils";
import {
  CirclePattern,
  DecorativeQrPlaceholder,
  ToothMark,
} from "@/features/builder/components/card-layout-marks";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

type ModernLayoutProps = {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  compact?: boolean;
  className?: string;
};

type ModernBackProps = ModernLayoutProps & {
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0]?.toLowerCase() ?? name;
}

function companyWord(data: CardData) {
  return data.company?.trim() || data.name.trim().split(/\s+/)[0] || "Brand";
}

function contactSize(compact: boolean | undefined) {
  return tx(compact, "text-[6px] leading-relaxed", "text-[10px] leading-relaxed");
}

function ContactBlock({
  data,
  styles,
  compact,
  interactive,
  onLinkClick,
  className,
  align = "left",
}: {
  data: CardData;
  styles: ThemeStyleClasses;
  compact?: boolean;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <div className={cn(align === "right" && "text-right", contactSize(compact), className)}>
      <ContactList
        data={data}
        styles={styles}
        compact={compact}
        interactive={interactive}
        onLinkClick={onLinkClick}
      />
    </div>
  );
}

function PrefixedContact({
  data,
  compact,
  className,
}: {
  data: CardData;
  compact?: boolean;
  className?: string;
}) {
  const rows = (
    [
      ["T", "phone", data.phone] as const,
      ["M", "email", data.email] as const,
      ["W", "website", data.website] as const,
    ] satisfies readonly [string, "phone" | "email" | "website", string][]
  ).filter(([, key, value]) => isFieldEnabled(data, key) && value);

  if (rows.length === 0) return null;

  return (
    <div className={cn("space-y-0.5 font-medium tabular-nums", contactSize(compact), className)}>
      {rows.map(([prefix, key, value]) => (
        <FieldText key={key} data={data} fieldKey={key} className="flex gap-2">
          <span className="opacity-50">{prefix}</span>
          <span>{value}</span>
        </FieldText>
      ))}
    </div>
  );
}

function LabelGridContact({
  data,
  compact,
  className,
}: {
  data: CardData;
  compact?: boolean;
  className?: string;
}) {
  const cells = (
    [
      ["Email", "email", data.email],
      ["Website", "website", data.website],
      ["Phone", "phone", data.phone],
      ["Address", "location", data.location],
    ] as const
  ).filter(([, key, value]) => isFieldEnabled(data, key) && value);

  if (cells.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-5 gap-y-3 border-t border-current/12 pt-4",
        tx(compact, "text-[5.5px]", "text-[9px]"),
        className,
      )}
    >
      {cells.map(([label, key, value]) => (
        <div key={key}>
          <p className="mb-0.5 font-medium uppercase tracking-[0.22em] opacity-45">{label}</p>
          <FieldText data={data} fieldKey={key} className="leading-snug">
            {value}
          </FieldText>
        </div>
      ))}
    </div>
  );
}

// ─── Front ───────────────────────────────────────────────────────────────────

export function ModernCardFront({
  data,
  theme,
  styles,
  compact,
  className,
}: ModernLayoutProps) {
  const layout = theme.layout;

  switch (layout) {
    case "mod-rexora":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <div className="flex flex-1 flex-col justify-between p-[9%]">
            <div className="max-w-[72%]">
              <NameTitleStack
                data={data}
                compact={compact}
                styles={styles}
                nameClassName={cn(
                  "font-semibold uppercase tracking-[0.14em]",
                  tx(compact, "text-[9px]", "text-sm"),
                )}
                titleClassName={cn(
                  "uppercase tracking-[0.2em] opacity-75",
                  tx(compact, "text-[6px]", "text-[10px]"),
                )}
              />
            </div>
            <div className="flex items-end justify-between gap-4">
              <PrefixedContact data={data} compact={compact} className="opacity-90" />
              <div className="flex flex-col items-end gap-2.5">
                <CardBrandMark
                  data={data}
                  theme={theme}
                  styles={styles}
                  compact={compact}
                  className={cn("text-[#FEE101]", tx(compact, "h-5 w-5", "h-8 w-8"))}
                />
                <div
                  className={cn(
                    "flex items-center justify-center rounded-[3px] bg-[#FEE101] p-1.5",
                    tx(compact, "h-6 w-6", "h-9 w-9"),
                  )}
                >
                  <CardBrandMark
                    data={data}
                    theme={theme}
                    styles={styles}
                    compact={compact}
                    className="h-full w-full text-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "mod-codai":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <CardWatermarkLogo
            data={data}
            theme={theme}
            className="pointer-events-none absolute -right-[6%] top-1/2 h-[90%] w-[58%] -translate-y-1/2"
            opacity={0.07}
          />
          <div className="relative flex flex-1 flex-col justify-between p-[9%]">
            <FieldText
              data={data}
              fieldKey="name"
              className={cn(
                "font-bold uppercase tracking-[0.12em]",
                tx(compact, "text-[10px]", "text-base"),
              )}
            >
              {data.name}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="company"
              className={cn(
                "font-black uppercase tracking-tight",
                tx(compact, "text-[11px]", "text-lg"),
              )}
            >
              {data.company || companyWord(data)}
            </FieldText>
          </div>
        </div>
      );

    case "mod-rollux":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <div className="flex flex-1 flex-col p-[9%]">
            <div className="flex justify-end">
              <CardBrandMark
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                className={cn(tx(compact, "h-5 w-5", "h-7 w-7"))}
              />
            </div>
            <div className="flex flex-1 items-center">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <FieldText
                  data={data}
                  fieldKey="company"
                  className={cn(
                    "font-bold lowercase tracking-tight",
                    tx(compact, "text-[15px]", "text-[1.75rem]"),
                  )}
                >
                  {companyWord(data).toLowerCase()}
                </FieldText>
                {isFieldEnabled(data, "title") && (
                  <FieldText
                    data={data}
                    fieldKey="title"
                    className={cn(
                      "uppercase tracking-[0.28em] opacity-65",
                      tx(compact, "text-[5px]", "text-[9px]"),
                    )}
                  >
                    {data.title}
                  </FieldText>
                )}
              </div>
            </div>
          </div>
        </div>
      );

    case "mod-taylor":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "front",
            cn("items-center justify-center", className),
          )}
        >
          <FieldText
            data={data}
            fieldKey="company"
            className={cn(
              "font-serif lowercase tracking-tight",
              tx(compact, "text-[20px]", "text-[2.75rem]"),
            )}
          >
            {(data.company || companyWord(data)).toLowerCase()}
          </FieldText>
        </div>
      );

    case "mod-dentist":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "front",
            cn("items-center justify-center bg-[length:4px_4px]", className),
          )}
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
          }}
        >
          <div className="flex flex-col items-center px-[10%] text-center">
            <ToothMark className={cn("mb-4", tx(compact, "h-9 w-9", "h-14 w-14"))} />
            <FieldText
              data={data}
              fieldKey="name"
              className={cn("font-serif", tx(compact, "text-[11px]", "text-lg"))}
            >
              {data.name}
            </FieldText>
            {isFieldEnabled(data, "title") && (
              <FieldText
                data={data}
                fieldKey="title"
                className={cn(
                  "mt-2.5 uppercase tracking-[0.24em] opacity-90",
                  tx(compact, "text-[5.5px]", "text-[9px]"),
                )}
              >
                {data.title}
              </FieldText>
            )}
          </div>
        </div>
      );

    case "mod-vitvio":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <div className="relative flex flex-1 flex-col p-[8%]">
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(
                  "rounded-[2px] bg-[#00D18B] px-2.5 py-2 text-black shadow-sm",
                  tx(compact, "max-w-[58%]", "max-w-[52%]"),
                )}
              >
                <FieldText
                  data={data}
                  fieldKey="name"
                  className={cn("font-semibold leading-tight", tx(compact, "text-[7px]", "text-xs"))}
                >
                  {data.name}
                </FieldText>
                {isFieldEnabled(data, "title") && (
                  <FieldText
                    data={data}
                    fieldKey="title"
                    className={cn("mt-0.5 opacity-75", tx(compact, "text-[6px]", "text-[10px]"))}
                  >
                    {data.title}
                  </FieldText>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <CardBrandMark
                  data={data}
                  theme={theme}
                  styles={styles}
                  compact={compact}
                  className={cn(tx(compact, "h-4 w-4", "h-5 w-5"))}
                />
                <FieldText
                  data={data}
                  fieldKey="company"
                  className={cn("font-semibold", tx(compact, "text-[7px]", "text-xs"))}
                >
                  {data.company || companyWord(data)}
                </FieldText>
              </div>
            </div>
            <div className="mt-auto flex items-end justify-between gap-3 pt-4">
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                className="uppercase tracking-[0.14em] opacity-75 [&_svg]:hidden"
              />
              <CardBrandMark
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                className={cn("opacity-95", tx(compact, "h-11 w-11", "h-[4.5rem] w-[4.5rem]"))}
              />
            </div>
          </div>
        </div>
      );

    case "mod-solara":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <div className="flex flex-1 flex-col justify-between p-[9%]">
            <div className="flex items-start justify-between gap-3">
              <NameTitleStack
                data={data}
                compact={compact}
                styles={styles}
                nameClassName={cn("font-semibold leading-tight", tx(compact, "text-[9px]", "text-sm"))}
                titleClassName={cn("opacity-70", tx(compact, "text-[6.5px]", "text-[10px]"))}
              />
              <CardBrandMark
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                className={cn(tx(compact, "h-5 w-5", "h-8 w-8"))}
              />
            </div>
            <div className="flex items-end justify-between gap-4">
              <ContactBlock data={data} styles={styles} compact={compact} className="opacity-85" />
              {isFieldEnabled(data, "location") && (
                <FieldText
                  data={data}
                  fieldKey="location"
                  className={cn(
                    "max-w-[44%] text-right leading-snug opacity-70",
                    tx(compact, "text-[5.5px]", "text-[9px]"),
                  )}
                >
                  {data.location}
                </FieldText>
              )}
            </div>
          </div>
        </div>
      );

    case "mod-solara-brand":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <div className="flex flex-1 flex-col justify-between p-[9%]">
            <div className="flex items-center gap-2.5">
              <CardBrandMark
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                className={cn(tx(compact, "h-5 w-5", "h-7 w-7"))}
              />
              <FieldText
                data={data}
                fieldKey="company"
                className={cn("font-bold tracking-tight", tx(compact, "text-[11px]", "text-lg"))}
              >
                {data.company || companyWord(data)}
              </FieldText>
            </div>
            {isFieldEnabled(data, "tagline") && (
              <FieldText
                data={data}
                fieldKey="tagline"
                className={cn(
                  "max-w-[68%] self-end text-right font-medium leading-snug",
                  tx(compact, "text-[6.5px]", "text-[11px]"),
                )}
              >
                {data.tagline}
              </FieldText>
            )}
          </div>
        </div>
      );

    case "mod-zight":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <div className="relative flex flex-1 flex-col justify-between p-[9%]">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              className={cn(
                "absolute right-[9%] top-[9%]",
                tx(compact, "h-5 w-5", "h-7 w-7"),
              )}
            />
            <FieldText
              data={data}
              fieldKey="name"
              className={cn("font-medium", tx(compact, "text-[10px]", "text-base"))}
            >
              {data.name}
            </FieldText>
            <div className="flex items-end justify-between gap-4">
              <ContactBlock data={data} styles={styles} compact={compact} className="opacity-90" />
              <div
                className={cn(
                  "rounded-full bg-current",
                  tx(compact, "mb-1 h-0.5 w-10", "mb-1.5 h-1 w-16"),
                )}
              />
            </div>
          </div>
        </div>
      );

    case "mod-wedding":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "front",
            cn("items-center justify-center", className),
          )}
        >
          <p
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-center select-none font-bold uppercase tracking-[0.18em] opacity-[0.09]",
              tx(compact, "text-[24px]", "text-[3.25rem]"),
            )}
          >
            {data.title?.split(/\s+/)[0] || "EVENT"}
          </p>
          <div className="relative z-10 px-[12%] text-center">
            <FieldText
              data={data}
              fieldKey="name"
              className={cn("font-serif italic", tx(compact, "text-[13px]", "text-2xl"))}
            >
              {data.name}
            </FieldText>
            {isFieldEnabled(data, "title") && (
              <FieldText
                data={data}
                fieldKey="title"
                className={cn(
                  "mt-2.5 uppercase tracking-[0.3em] opacity-75",
                  tx(compact, "text-[5px]", "text-[9px]"),
                )}
              >
                {data.title}
              </FieldText>
            )}
          </div>
        </div>
      );

    case "mod-cara":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "front",
            cn("items-center justify-center", className),
          )}
        >
          <div className="flex items-center gap-5 px-[10%]">
            <span className={cn("font-serif font-bold leading-none", tx(compact, "text-[18px]", "text-4xl"))}>
              {initials(data.name)}.
            </span>
            <div className="h-12 w-px bg-current opacity-25" />
            <div>
              <FieldText
                data={data}
                fieldKey="name"
                className={cn("uppercase tracking-[0.16em]", tx(compact, "text-[7px]", "text-xs"))}
              >
                {data.name}
              </FieldText>
              {isFieldEnabled(data, "title") && (
                <FieldText
                  data={data}
                  fieldKey="title"
                  className={cn(
                    "mt-1.5 font-bold uppercase tracking-[0.16em]",
                    tx(compact, "text-[7px]", "text-xs"),
                  )}
                >
                  {data.title}
                </FieldText>
              )}
            </div>
          </div>
        </div>
      );

    case "mod-alpha":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <div className="relative flex flex-1 flex-col p-[8%]">
            <div className="flex items-start justify-between">
              <div>
                <FieldText
                  data={data}
                  fieldKey="company"
                  className={cn("font-bold lowercase", tx(compact, "text-[11px]", "text-lg"))}
                >
                  {companyWord(data).toLowerCase()}
                </FieldText>
                <p className={cn("mt-0.5 opacity-45", tx(compact, "text-[6px]", "text-[10px]"))}>
                  Architecture Studio
                </p>
              </div>
              <span className={cn("font-extralight leading-none opacity-40", tx(compact, "text-xl", "text-3xl"))}>
                ↗
              </span>
            </div>
            <div className="absolute right-[8%] top-[42%] max-w-[46%] text-right">
              <FieldText
                data={data}
                fieldKey="name"
                className={cn("font-medium leading-snug", tx(compact, "text-[8px]", "text-sm"))}
              >
                {data.name}
              </FieldText>
              {isFieldEnabled(data, "location") && (
                <FieldText
                  data={data}
                  fieldKey="location"
                  className={cn(
                    "mt-1 leading-snug opacity-55",
                    tx(compact, "text-[5.5px]", "text-[9px]"),
                  )}
                >
                  {data.location}
                </FieldText>
              )}
            </div>
            <div className="mt-auto max-w-[52%]">
              {isFieldEnabled(data, "title") && (
                <FieldText
                  data={data}
                  fieldKey="title"
                  className={cn("mb-2 font-medium", tx(compact, "text-[6.5px]", "text-[10px]"))}
                >
                  {data.title}
                </FieldText>
              )}
              <ContactBlock data={data} styles={styles} compact={compact} className="opacity-75" />
            </div>
          </div>
        </div>
      );

    case "mod-caleb":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "front",
            cn("items-center justify-center px-[10%] text-center", className),
          )}
        >
          <CardBrandMark
            data={data}
            theme={theme}
            styles={styles}
            compact={compact}
            className={cn("mx-auto mb-4", tx(compact, "h-9 w-9", "h-14 w-14"))}
          />
          <FieldText
            data={data}
            fieldKey="company"
            className={cn(
              "font-serif uppercase tracking-[0.22em]",
              tx(compact, "text-[8px]", "text-sm"),
            )}
          >
            {(data.company || companyWord(data)).toUpperCase()}
          </FieldText>
          {isFieldEnabled(data, "tagline") && (
            <FieldText
              data={data}
              fieldKey="tagline"
              className={cn("mt-2 italic opacity-70", tx(compact, "text-[6px]", "text-[10px]"))}
            >
              {data.tagline}
            </FieldText>
          )}
          <div className="mx-auto mt-4 flex items-center gap-2 opacity-50">
            <div className="h-px w-10 bg-current" />
            <div className="size-1 rotate-45 bg-current" />
            <div className="h-px w-10 bg-current" />
          </div>
        </div>
      );

    case "mod-naturopathy":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "front",
            cn("items-center justify-center px-[8%] text-center", className),
          )}
        >
          {isFieldEnabled(data, "tagline") && (
            <FieldText
              data={data}
              fieldKey="tagline"
              className={cn(
                "uppercase tracking-[0.28em] opacity-80",
                tx(compact, "text-[5px]", "text-[9px]"),
              )}
            >
              {data.tagline.split(/\s+/).slice(0, 2).join(" ").toUpperCase()}
            </FieldText>
          )}
          <FieldText
            data={data}
            fieldKey="company"
            className={cn(
              "my-2 font-serif uppercase tracking-wide",
              tx(compact, "text-[13px]", "text-[1.65rem]"),
            )}
          >
            {(data.company || "FOR YOU").toUpperCase()}
          </FieldText>
          {isFieldEnabled(data, "title") && (
            <FieldText
              data={data}
              fieldKey="title"
              className={cn(
                "uppercase tracking-[0.32em] opacity-75",
                tx(compact, "text-[5px]", "text-[9px]"),
              )}
            >
              {data.title}
            </FieldText>
          )}
        </div>
      );

    case "mod-maya":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "front",
            cn("items-center justify-center px-[10%] text-center", className),
          )}
        >
          <FieldText
            data={data}
            fieldKey="name"
            className={cn("font-serif italic", tx(compact, "text-[15px]", "text-[1.75rem]"))}
          >
            {data.name}
          </FieldText>
          {isFieldEnabled(data, "title") && (
            <FieldText
              data={data}
              fieldKey="title"
              className={cn(
                "mt-3 uppercase tracking-[0.24em] opacity-90",
                tx(compact, "text-[5.5px]", "text-[9px]"),
              )}
            >
              {`• ${data.title.toUpperCase()} •`}
            </FieldText>
          )}
        </div>
      );

    case "mod-southern":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <div className="absolute inset-y-0 right-0 w-[30%] bg-black/18" />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[70%] top-[10%] h-[80%] w-px bg-white/30" />
            <div className="absolute left-[10%] top-[36%] h-px w-[60%] bg-white/22" />
            <div className="absolute left-[70%] top-[36%] h-px w-[18%] bg-white/22" />
            <div className="absolute left-[10%] top-[10%] h-[28%] w-px bg-white/22" />
          </div>
          <div className="relative flex flex-1">
            <div className="flex w-[70%] flex-col justify-end p-[9%]">
              <FieldText
                data={data}
                fieldKey="name"
                className={cn("font-serif font-semibold", tx(compact, "text-[9px]", "text-sm"))}
              >
                {data.name}
              </FieldText>
              {isFieldEnabled(data, "title") && (
                <FieldText
                  data={data}
                  fieldKey="title"
                  className={cn("mt-1 opacity-75", tx(compact, "text-[6.5px]", "text-[10px]"))}
                >
                  {data.title}
                </FieldText>
              )}
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                className="mt-3 opacity-80"
              />
            </div>
            <div className="flex w-[30%] flex-col items-center justify-center px-[2%] text-center">
              <CardBrandMark
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                className={cn("mb-2", tx(compact, "h-5 w-5", "h-8 w-8"))}
              />
              <FieldText
                data={data}
                fieldKey="company"
                className={cn("font-medium lowercase", tx(compact, "text-[6px]", "text-[10px]"))}
              >
                {(data.company || companyWord(data)).toLowerCase()}
              </FieldText>
            </div>
          </div>
        </div>
      );

    case "mod-riwo":
      return (
        <div className={layoutShell(styles, theme, compact, "front", className)}>
          <div className="flex flex-1">
            <div className="flex w-[36%] flex-col justify-between p-[8%]">
              <DecorativeQrPlaceholder className={cn(tx(compact, "h-11 w-11", "h-16 w-16"))} />
              <FieldText
                data={data}
                fieldKey="company"
                className={cn("font-bold tracking-tight", tx(compact, "text-[10px]", "text-base"))}
              >
                {data.company || companyWord(data)}
              </FieldText>
            </div>
            <div className="flex w-[64%] flex-col justify-between p-[8%] text-right">
              {isFieldEnabled(data, "location") && (
                <FieldText
                  data={data}
                  fieldKey="location"
                  className={cn(
                    "uppercase tracking-[0.12em] opacity-85",
                    tx(compact, "text-[5px]", "text-[8px]"),
                  )}
                >
                  {data.location}
                </FieldText>
              )}
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                align="right"
                className="uppercase tracking-[0.1em] opacity-85"
              />
              {isFieldEnabled(data, "tagline") && (
                <FieldText
                  data={data}
                  fieldKey="tagline"
                  className={cn(
                    "leading-snug opacity-70",
                    tx(compact, "text-[5px]", "text-[8px]"),
                  )}
                >
                  {data.tagline}
                </FieldText>
              )}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─── Back ────────────────────────────────────────────────────────────────────

export function ModernCardBack({
  data,
  theme,
  styles,
  compact,
  className,
  interactive,
  onLinkClick,
}: ModernBackProps) {
  const layout = theme.layout;

  switch (layout) {
    case "mod-rexora":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "back",
            cn("items-center justify-center", className),
          )}
        >
          <div className="flex items-center gap-5 px-[8%]">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              className={cn("shrink-0 text-[#FEE101]", tx(compact, "h-14 w-14", "h-24 w-24"))}
            />
            <FieldText
              data={data}
              fieldKey="company"
              className={cn(
                "max-w-[9rem] font-bold uppercase leading-[1.15] tracking-[0.1em]",
                tx(compact, "text-[7px]", "text-xs"),
              )}
            >
              {(data.company || companyWord(data)).toUpperCase()}
            </FieldText>
          </div>
        </div>
      );

    case "mod-codai":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <CardWatermarkLogo
            data={data}
            theme={theme}
            className="pointer-events-none absolute -right-[6%] top-1/2 h-[90%] w-[58%] -translate-y-1/2"
            opacity={0.06}
          />
          <div className="relative flex flex-1 flex-col justify-between p-[9%]">
            <div className="self-end text-right">
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                align="right"
                interactive={interactive}
                onLinkClick={onLinkClick}
                className="opacity-90"
              />
            </div>
            <FieldText
              data={data}
              fieldKey="company"
              className={cn(
                "font-black uppercase tracking-tight opacity-90",
                tx(compact, "text-[10px]", "text-base"),
              )}
            >
              {data.company || companyWord(data)}
            </FieldText>
          </div>
        </div>
      );

    case "mod-rollux":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <div className="flex flex-1 flex-col justify-between p-[9%]">
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              nameClassName={cn(
                "font-medium tracking-wide opacity-30",
                tx(compact, "text-[10px]", "text-base"),
              )}
              titleClassName={cn("opacity-90", tx(compact, "text-[6.5px]", "text-[10px]"))}
            />
            <div className="flex items-end justify-between gap-4">
              <CardBrandMark
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                className={cn("text-[#98D8A0]", tx(compact, "h-12 w-12", "h-[4.5rem] w-[4.5rem]"))}
              />
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                align="right"
                interactive={interactive}
                onLinkClick={onLinkClick}
                className="opacity-90"
              />
            </div>
          </div>
        </div>
      );

    case "mod-taylor":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <div className="flex flex-1 items-end justify-between gap-6 p-[9%]">
            <div className="flex max-w-[48%] flex-col gap-0.5 text-left">
              <FieldText
                data={data}
                fieldKey="name"
                as="p"
                className={cn(
                  "font-medium leading-tight",
                  tx(compact, "text-[8px]", "text-sm"),
                )}
              >
                {data.name}
              </FieldText>
              {isFieldEnabled(data, "title") && (
                <FieldText
                  data={data}
                  fieldKey="title"
                  as="p"
                  className={cn(
                    "leading-tight opacity-70",
                    tx(compact, "text-[6px]", "text-[10px]"),
                  )}
                >
                  {data.title}
                </FieldText>
              )}
            </div>
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
              className={cn(
                "text-right opacity-90 [&>a]:justify-end [&>div]:justify-end",
                tx(compact, "text-[5px] leading-relaxed", "text-[8px] leading-relaxed"),
              )}
            />
          </div>
        </div>
      );

    case "mod-dentist":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <div className="flex flex-1 flex-col justify-between p-[9%]">
            <div>
              <FieldText
                data={data}
                fieldKey="name"
                className={cn("font-serif", tx(compact, "text-[9px]", "text-sm"))}
              >
                {data.name}
              </FieldText>
              {isFieldEnabled(data, "title") && (
                <FieldText
                  data={data}
                  fieldKey="title"
                  className={cn("mt-1 capitalize opacity-85", tx(compact, "text-[6.5px]", "text-[10px]"))}
                >
                  {data.title}
                </FieldText>
              )}
            </div>
            <div className="flex items-end justify-between gap-5">
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
                className="opacity-90"
              />
            </div>
          </div>
        </div>
      );

    case "mod-vitvio":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "back",
            cn("items-center justify-center", className),
          )}
        >
          <div className="flex items-center gap-3">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              className={cn(tx(compact, "h-10 w-10", "h-16 w-16"))}
            />
            <FieldText
              data={data}
              fieldKey="company"
              className={cn("font-bold tracking-tight", tx(compact, "text-[11px]", "text-xl"))}
            >
              {data.company || companyWord(data)}
            </FieldText>
          </div>
        </div>
      );

    case "mod-solara":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "back",
            cn("items-center justify-center", className),
          )}
        >
          <div className="flex flex-col items-center gap-3 px-[10%] text-center">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              className={cn(tx(compact, "h-10 w-10", "h-16 w-16"))}
            />
            <FieldText
              data={data}
              fieldKey="company"
              className={cn("font-bold tracking-tight", tx(compact, "text-[12px]", "text-xl"))}
            >
              {data.company || companyWord(data)}
            </FieldText>
            {isFieldEnabled(data, "tagline") && (
              <FieldText
                data={data}
                fieldKey="tagline"
                className={cn(
                  "max-w-[85%] font-medium leading-snug opacity-80",
                  tx(compact, "text-[6px]", "text-[10px]"),
                )}
              >
                {data.tagline}
              </FieldText>
            )}
          </div>
        </div>
      );

    case "mod-solara-brand":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <div className="flex flex-1 flex-col justify-between p-[9%]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <FieldText
                  data={data}
                  fieldKey="name"
                  className={cn("font-semibold", tx(compact, "text-[9px]", "text-sm"))}
                >
                  {data.name}
                </FieldText>
                {isFieldEnabled(data, "title") && (
                  <FieldText
                    data={data}
                    fieldKey="title"
                    className={cn("mt-1 opacity-70", tx(compact, "text-[6.5px]", "text-[10px]"))}
                  >
                    {data.title}
                  </FieldText>
                )}
              </div>
              <CardBrandMark
                data={data}
                theme={theme}
                styles={styles}
                compact={compact}
                className={cn(tx(compact, "h-5 w-5", "h-8 w-8"))}
              />
            </div>
            <div className="flex items-end justify-between gap-4">
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
                className="opacity-90"
              />
              {isFieldEnabled(data, "location") && (
                <FieldText
                  data={data}
                  fieldKey="location"
                  className={cn(
                    "max-w-[44%] text-right leading-snug opacity-70",
                    tx(compact, "text-[5.5px]", "text-[9px]"),
                  )}
                >
                  {data.location}
                </FieldText>
              )}
            </div>
          </div>
        </div>
      );

    case "mod-zight":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "back",
            cn("items-center justify-center", className),
          )}
        >
          <FieldText
            data={data}
            fieldKey="company"
            className={cn(
              "font-bold lowercase tracking-tight",
              tx(compact, "text-[16px]", "text-[2rem]"),
            )}
          >
            {(data.company || companyWord(data)).toLowerCase()}
          </FieldText>
        </div>
      );

    case "mod-wedding":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <div className="flex flex-1 flex-col p-[9%]">
            <div className="flex items-start gap-4">
              <span className={cn("font-serif font-bold leading-none", tx(compact, "text-[16px]", "text-3xl"))}>
                {initials(data.name)}.
              </span>
              <div>
                <FieldText
                  data={data}
                  fieldKey="name"
                  className={cn("font-semibold tracking-[0.14em]", tx(compact, "text-[7px]", "text-xs"))}
                >
                  {data.name.toUpperCase()}
                </FieldText>
                {isFieldEnabled(data, "title") && (
                  <FieldText
                    data={data}
                    fieldKey="title"
                    className={cn("mt-1 tracking-[0.14em] opacity-75", tx(compact, "text-[6px]", "text-[10px]"))}
                  >
                    {data.title.toUpperCase()}
                  </FieldText>
                )}
                <p className={cn("mt-1.5 tracking-[0.35em] opacity-60", tx(compact, "text-[5px]", "text-[8px]"))}>
                  ★★★★★
                </p>
              </div>
            </div>
            <ContactBlock
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
              className="mt-auto opacity-90"
            />
          </div>
        </div>
      );

    case "mod-cara":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <div
            aria-hidden
            className="absolute bottom-0 right-0 h-[44%] w-[40%] bg-[#4A5340]"
            style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
          />
          <div className="relative flex flex-1 flex-col justify-between p-[9%]">
            <div className="max-w-[68%]">
              <FieldText
                data={data}
                fieldKey="name"
                className={cn("uppercase tracking-[0.14em]", tx(compact, "text-[7px]", "text-xs"))}
              >
                {data.name.toUpperCase()}
              </FieldText>
              {isFieldEnabled(data, "title") && (
                <FieldText
                  data={data}
                  fieldKey="title"
                  className={cn(
                    "mt-1 font-bold uppercase tracking-[0.14em]",
                    tx(compact, "text-[7px]", "text-xs"),
                  )}
                >
                  {data.title.toUpperCase()}
                </FieldText>
              )}
              {isFieldEnabled(data, "location") && (
                <FieldText
                  data={data}
                  fieldKey="location"
                  className={cn(
                    "mt-3 leading-snug opacity-75",
                    tx(compact, "text-[5.5px]", "text-[9px]"),
                  )}
                >
                  {data.location}
                </FieldText>
              )}
            </div>
            <div className="flex items-end justify-between gap-4">
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
                className="opacity-90"
              />
              <span
                className={cn(
                  "relative z-10 font-serif font-bold text-white",
                  tx(compact, "text-[14px]", "text-2xl"),
                )}
              >
                {initials(data.name)}.
              </span>
            </div>
            {isFieldEnabled(data, "website") && (
              <FieldText
                data={data}
                fieldKey="website"
                className={cn(
                  "mt-3 uppercase tracking-[0.22em] opacity-70",
                  tx(compact, "text-[5.5px]", "text-[9px]"),
                )}
              >
                {data.website}
              </FieldText>
            )}
          </div>
        </div>
      );

    case "mod-alpha":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "back",
            cn("items-center justify-center px-[10%] text-center", className),
          )}
        >
          {isFieldEnabled(data, "tagline") && (
            <FieldText
              data={data}
              fieldKey="tagline"
              className={cn(
                "mb-4 uppercase tracking-[0.22em] opacity-35",
                tx(compact, "text-[5px]", "text-[8px]"),
              )}
            >
              {data.tagline}
            </FieldText>
          )}
          <div className="flex items-center justify-center gap-3">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              className={cn(tx(compact, "h-8 w-8", "h-12 w-12"))}
            />
            <div className="text-left">
              <FieldText
                data={data}
                fieldKey="company"
                className={cn("font-bold lowercase", tx(compact, "text-[12px]", "text-xl"))}
              >
                {companyWord(data).toLowerCase()}
              </FieldText>
              <p className={cn("opacity-45", tx(compact, "text-[6px]", "text-[10px]"))}>
                Architecture Studio
              </p>
            </div>
          </div>
        </div>
      );

    case "mod-caleb":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <CardBrandWatermark
            data={data}
            theme={theme}
            fallbackText={companyWord(data)}
            className="pointer-events-none absolute right-[7%] top-[7%]"
            opacity={0.18}
          />
          <div className="flex flex-1 flex-col p-[9%]">
            <div className="flex items-start justify-between gap-4">
              <CardLogo
                data={data}
                styles={styles}
                compact={compact}
                size="sm"
                className="opacity-35"
              />
              <div className="text-right">
                <FieldText
                  data={data}
                  fieldKey="name"
                  className={cn(
                    "font-serif font-bold tracking-[0.1em]",
                    tx(compact, "text-[9px]", "text-sm"),
                  )}
                >
                  {data.name.toUpperCase()}
                </FieldText>
                {isFieldEnabled(data, "title") && (
                  <FieldText
                    data={data}
                    fieldKey="title"
                    className={cn(
                      "mt-1 tracking-[0.16em] opacity-75",
                      tx(compact, "text-[6px]", "text-[10px]"),
                    )}
                  >
                    {data.title.toUpperCase()}
                  </FieldText>
                )}
              </div>
            </div>
            <LabelGridContact data={data} compact={compact} className="mt-auto" />
          </div>
        </div>
      );

    case "mod-naturopathy":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <div className="relative flex flex-1 overflow-hidden">
            <div className="flex w-[64%] flex-col justify-between p-[9%]">
              <div>
                <FieldText
                  data={data}
                  fieldKey="name"
                  className={cn("tracking-[0.12em]", tx(compact, "text-[8px]", "text-sm"))}
                >
                  {data.name.toUpperCase()}
                </FieldText>
                {isFieldEnabled(data, "title") && (
                  <FieldText
                    data={data}
                    fieldKey="title"
                    className={cn("mt-1 opacity-75", tx(compact, "text-[6.5px]", "text-[10px]"))}
                  >
                    {data.title}
                  </FieldText>
                )}
              </div>
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
                className="opacity-85"
              />
            </div>
            <div className="relative w-[36%]">
              <div
                aria-hidden
                className="absolute inset-y-[6%] right-0 w-full rounded-l-full bg-[#3B592D]"
              />
              <p
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap uppercase tracking-[0.28em] text-black/55",
                  tx(compact, "text-[4.5px]", "text-[7px]"),
                )}
              >
                {data.tagline?.split(/\s+/).slice(0, 2).join(" ") || "WELLNESS"}
              </p>
            </div>
          </div>
        </div>
      );

    case "mod-maya":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <div className="flex flex-1 p-[9%]">
            <div className="flex w-[58%] flex-col justify-between">
              <FieldText
                data={data}
                fieldKey="name"
                className={cn("font-serif italic", tx(compact, "text-[10px]", "text-base"))}
              >
                {data.name}
              </FieldText>
              <ContactBlock
                data={data}
                styles={styles}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
                className="uppercase tracking-[0.12em] opacity-90"
              />
            </div>
            <div className="flex w-[42%] flex-col items-end justify-between">
              <DecorativeQrPlaceholder className={cn(tx(compact, "h-12 w-12", "h-[4.25rem] w-[4.25rem]"))} />
            </div>
          </div>
        </div>
      );

    case "mod-southern":
      return (
        <div className={layoutShell(styles, theme, compact, "back", className)}>
          <CirclePattern className="opacity-[0.15]" color="white" />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[18%] top-[12%] h-[76%] w-px bg-white/28" />
            <div className="absolute left-[18%] top-[12%] h-px w-[62%] bg-white/28" />
            <div className="absolute left-[18%] bottom-[12%] h-px w-[48%] bg-white/28" />
            <div className="absolute left-[18%] top-[12%] h-[22%] w-px bg-white/28" />
          </div>
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[12%] text-center">
            <CardBrandMark
              data={data}
              theme={theme}
              styles={styles}
              compact={compact}
              className={cn("mx-auto mb-3", tx(compact, "h-7 w-7", "h-11 w-11"))}
            />
            <FieldText
              data={data}
              fieldKey="company"
              className={cn("font-medium lowercase", tx(compact, "text-[8px]", "text-sm"))}
            >
              {(data.company || companyWord(data)).toLowerCase()}
            </FieldText>
            {isFieldEnabled(data, "tagline") && (
              <FieldText
                data={data}
                fieldKey="tagline"
                className={cn(
                  "mt-2 max-w-[90%] opacity-60",
                  tx(compact, "text-[5.5px]", "text-[9px]"),
                )}
              >
                {data.tagline}
              </FieldText>
            )}
          </div>
        </div>
      );

    case "mod-riwo":
      return (
        <div
          className={layoutShell(
            styles,
            theme,
            compact,
            "back",
            cn("items-center justify-center", className),
          )}
        >
          <FieldText
            data={data}
            fieldKey="company"
            className={cn(
              "font-bold tracking-tight text-[#D1E2C4]",
              tx(compact, "text-[15px]", "text-[1.75rem]"),
            )}
          >
            {data.company || companyWord(data)}
          </FieldText>
        </div>
      );

    default:
      return null;
  }
}

export const MODERN_LAYOUTS = new Set<CardLayout>([
  "mod-rexora",
  "mod-codai",
  "mod-rollux",
  "mod-taylor",
  "mod-dentist",
  "mod-vitvio",
  "mod-solara",
  "mod-solara-brand",
  "mod-zight",
  "mod-wedding",
  "mod-cara",
  "mod-alpha",
  "mod-caleb",
  "mod-naturopathy",
  "mod-maya",
  "mod-southern",
  "mod-riwo",
]);

export function isModernLayout(layout: CardLayout): boolean {
  return MODERN_LAYOUTS.has(layout);
}
