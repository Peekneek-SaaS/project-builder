import {
  ArrowUpRight01Icon,
  CallIcon,
  Globe02Icon,
  Location01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { CardData } from "@/lib/card-data";
import type { CardTheme } from "@/lib/card-themes";
import {
  getFieldClassName,
  getFieldInlineStyle,
  getFieldSettings,
  isFieldEnabled,
} from "@/lib/card-field-utils";
import { FieldText } from "@/features/builder/components/field-text";
import {
  getThemeSizeClasses,
  type ThemeStyleClasses,
} from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CardLogo({
  data,
  styles,
  compact,
}: {
  data: CardData;
  styles: ThemeStyleClasses;
  compact?: boolean;
}) {
  if (!isFieldEnabled(data, "logo")) return null;

  const size = compact ? "size-8 text-[9px]" : "size-16 text-lg";

  if (data.logoUrl) {
    return (
      <img
        src={data.logoUrl}
        alt={data.company || data.name}
        className={cn(
          "object-contain",
          compact ? "h-8 max-w-[72px]" : "h-16 max-w-[140px]",
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold",
        size,
        styles.accent,
        styles.initialsText,
      )}
    >
      {getInitials(data.name) || "?"}
    </div>
  );
}

function BrandingName({
  data,
  className,
  compact,
}: {
  data: CardData;
  className?: string;
  compact?: boolean;
}) {
  const companyVisible = isFieldEnabled(data, "company") && data.company;
  const nameVisible = isFieldEnabled(data, "name") && data.name;

  if (companyVisible) {
    return (
      <FieldText
        data={data}
        fieldKey="company"
        as="p"
        className={cn(
          "font-bold uppercase tracking-wide",
          compact ? "text-[10px]" : "text-sm",
          className,
        )}
      >
        {data.company}
      </FieldText>
    );
  }

  if (nameVisible) {
    return (
      <FieldText
        data={data}
        fieldKey="name"
        as="p"
        className={cn(
          "font-bold uppercase tracking-wide",
          compact ? "text-[10px]" : "text-sm",
          className,
        )}
      >
        {data.name}
      </FieldText>
    );
  }

  return null;
}

function BrandingTagline({
  data,
  className,
  compact,
}: {
  data: CardData;
  className?: string;
  compact?: boolean;
}) {
  if (!data.tagline) return null;

  return (
    <FieldText
      data={data}
      fieldKey="tagline"
      as="p"
      className={cn(compact ? "text-[8px]" : "text-xs", className)}
    >
      {data.tagline}
    </FieldText>
  );
}

export function CardFront({
  data,
  theme,
  styles,
  compact,
  className,
}: {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  compact?: boolean;
  className?: string;
}) {
  const sizeClass = getThemeSizeClasses(theme, compact);

  const shell = cn(
    "relative flex flex-col overflow-hidden rounded-2xl border border-black/5 shadow-xl shadow-black/5 ring-1 ring-black/5",
    styles.frontSurface,
    styles.frontText,
    styles.isLightFront && "ring-black/10",
    className,
    sizeClass,
  );

  switch (theme.layout) {
    case "brand-bar":
      return (
        <div className={shell}>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <CardLogo data={data} styles={styles} compact={compact} />
            <div>
              <BrandingName data={data} compact={compact} />
              <BrandingTagline
                data={data}
                compact={compact}
                className="mt-1 opacity-80"
              />
            </div>
          </div>
          <div className={cn("relative px-4 py-3", styles.accent)}>
            {isFieldEnabled(data, "website") && data.website ? (
              <FieldText
                data={data}
                fieldKey="website"
                as="span"
                className={cn(
                  "mx-auto block w-fit rounded-full border border-white/30 px-4 py-1 text-center font-medium",
                  compact ? "text-[7px]" : "text-[11px]",
                  styles.initialsText,
                )}
              >
                {data.website}
              </FieldText>
            ) : null}
          </div>
        </div>
      );

    case "minimal-dark":
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
            <CardLogo data={data} styles={styles} compact={compact} />
            <BrandingName
              data={data}
              compact={compact}
              className="tracking-[0.2em]"
            />
            <BrandingTagline
              data={data}
              compact={compact}
              className="uppercase tracking-widest opacity-70"
            />
          </div>
        </div>
      );

    case "arc-frame":
      return (
        <div className={shell}>
          <div className={cn("pointer-events-none absolute -left-6 -top-6 size-24 rounded-full border-8 opacity-30", styles.accent)} />
          <div className={cn("pointer-events-none absolute -bottom-8 -right-8 size-28 rounded-full border-8 opacity-30", styles.accent)} />
          <div className="relative flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <CardLogo data={data} styles={styles} compact={compact} />
            <BrandingName data={data} compact={compact} />
            <BrandingTagline data={data} compact={compact} className="opacity-80" />
          </div>
        </div>
      );

    case "skyline":
    case "split-sidebar":
    case "band-header":
    case "watermark":
    case "horizontal":
    case "classic":
    case "brand-center":
    default:
      return (
        <div className={shell}>
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <CardLogo data={data} styles={styles} compact={compact} />
            <div>
              <BrandingName
                data={data}
                compact={compact}
                className={compact ? "text-[10px]" : "text-base"}
              />
              <BrandingTagline
                data={data}
                compact={compact}
                className="mt-1.5 opacity-75"
              />
            </div>
            {!compact ? (
              <div className="flex gap-1.5">
                <span className={cn("h-1 w-10 rounded-full", styles.accent)} />
                <span className={cn("h-1 w-5 rounded-full opacity-50", styles.accentBarMuted)} />
              </div>
            ) : null}
          </div>
        </div>
      );
  }
}

export type LinkClickPayload = {
  label: string;
  href?: string;
};

export function CardBack({
  data,
  theme,
  styles,
  compact,
  className,
  interactive = false,
  onLinkClick,
}: {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  compact?: boolean;
  className?: string;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
}) {
  const sizeClass = getThemeSizeClasses(theme, compact);

  const shell = cn(
    "relative flex flex-col overflow-hidden rounded-2xl border border-black/5 shadow-xl shadow-black/5 ring-1 ring-black/5",
    styles.surface,
    styles.text,
    styles.isLightSurface && "ring-black/10",
    className,
    sizeClass,
  );

  switch (theme.layout) {
    case "split-sidebar":
      return (
        <div className={cn(shell, "flex-row")}>
          <div className={cn("flex w-[33%] flex-col items-center justify-center p-3", styles.accent, styles.initialsText)}>
            <CardLogo data={data} styles={styles} compact />
            {isFieldEnabled(data, "company") && data.company ? (
              <FieldText
                data={data}
                fieldKey="company"
                as="p"
                className={cn("mt-2 text-center font-bold uppercase", compact ? "text-[6px]" : "text-[9px]")}
              >
                {data.company.slice(0, 12)}
              </FieldText>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2 p-4">
            <div>
              <FieldText
                data={data}
                fieldKey="name"
                as="p"
                className={cn("font-bold", compact ? "text-[10px]" : "text-lg")}
              >
                {data.name}
              </FieldText>
              <FieldText
                data={data}
                fieldKey="title"
                as="p"
                className={cn(styles.subtext, compact ? "text-[8px]" : "text-xs")}
              >
                {data.title}
              </FieldText>
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

    case "skyline":
      return (
        <div className={shell}>
          <div className={cn("relative h-[38%] shrink-0", styles.accent)}>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-0.5 px-2 pb-0">
              {[40, 64, 48, 72, 36, 56, 44].map((h, i) => (
                <span
                  key={i}
                  className={cn("w-3 bg-current opacity-20", styles.text)}
                  style={{ height: compact ? h / 3 : h / 2 }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between gap-3 p-4">
            <div>
              <FieldText
                data={data}
                fieldKey="name"
                as="p"
                className={cn("font-bold uppercase", compact ? "text-[9px]" : "text-sm")}
              >
                {data.name}
              </FieldText>
              <FieldText
                data={data}
                fieldKey="title"
                as="p"
                className={cn("text-[10px] uppercase", styles.subtext)}
              >
                {data.title}
              </FieldText>
            </div>
            <div className={cn("space-y-0.5 text-right", compact ? "text-[7px]" : "text-[10px]", styles.subtext)}>
              {isFieldEnabled(data, "website") && data.website ? (
                <FieldText data={data} fieldKey="website" as="p">
                  {data.website}
                </FieldText>
              ) : null}
              {isFieldEnabled(data, "email") && data.email ? (
                <FieldText data={data} fieldKey="email" as="p">
                  {data.email}
                </FieldText>
              ) : null}
              {isFieldEnabled(data, "phone") && data.phone ? (
                <FieldText data={data} fieldKey="phone" as="p">
                  {data.phone}
                </FieldText>
              ) : null}
            </div>
          </div>
        </div>
      );

    case "band-header":
      return (
        <div className={shell}>
          <div className={cn("border-b border-black/10 bg-white px-4 py-3", compact ? "py-2" : "py-4")}>
            <FieldText
              data={data}
              fieldKey="name"
              as="p"
              className={cn("font-bold uppercase text-slate-900", compact ? "text-[9px]" : "text-sm")}
            >
              {data.name}
            </FieldText>
            <FieldText
              data={data}
              fieldKey="title"
              as="p"
              className={cn("text-slate-600", compact ? "text-[7px]" : "text-xs")}
            >
              {data.title}
            </FieldText>
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            {data.bio && !compact ? (
              <FieldText
                data={data}
                fieldKey="bio"
                as="p"
                className={cn("text-sm leading-relaxed", styles.subtext)}
              >
                {data.bio}
              </FieldText>
            ) : null}
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

    case "watermark":
      return (
        <div className={shell}>
          <div className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.07]">
            <CardLogo data={data} styles={styles} compact={false} />
          </div>
          <div className="relative flex flex-1 flex-col justify-between p-4">
            <div>
              <FieldText
                data={data}
                fieldKey="name"
                as="p"
                className={cn("font-semibold", compact ? "text-[10px]" : "text-base")}
              >
                {data.name}
              </FieldText>
              <FieldText
                data={data}
                fieldKey="title"
                as="p"
                className={cn("uppercase tracking-wide", styles.subtext, compact ? "text-[7px]" : "text-[10px]")}
              >
                {data.title}
              </FieldText>
            </div>
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />
            {!compact && isFieldEnabled(data, "skills") && data.skills.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {data.skills.slice(0, 4).map((skill) => {
                  const skillSettings = getFieldSettings(data, "skills");
                  return (
                    <span
                      key={skill}
                      className={cn(
                        "rounded bg-black/5 px-1.5 py-0.5 text-[10px]",
                        styles.subtext,
                        getFieldClassName(skillSettings),
                      )}
                      style={getFieldInlineStyle(skillSettings)}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      );

    case "horizontal":
      return (
        <div className={cn(shell, "flex-row items-stretch")}>
          <div className={cn("flex w-[35%] items-center justify-center p-3", styles.accent, styles.initialsText)}>
            <CardLogo data={data} styles={styles} compact />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2 p-4">
            <div>
              <FieldText
                data={data}
                fieldKey="name"
                as="p"
                className={cn("font-bold uppercase tracking-wide", compact ? "text-[9px]" : "text-sm")}
              >
                {data.name}
              </FieldText>
              <FieldText
                data={data}
                fieldKey="title"
                as="p"
                className={cn("uppercase", styles.subtext, compact ? "text-[7px]" : "text-[10px]")}
              >
                {data.title}
              </FieldText>
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

    case "minimal-dark":
    case "brand-bar":
    case "arc-frame":
    case "brand-center":
    case "classic":
    default:
      return (
        <div className={shell}>
          <div className={cn("flex flex-1 flex-col", compact ? "gap-2 p-3" : "gap-4 p-6")}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <FieldText
                  data={data}
                  fieldKey="name"
                  as="h3"
                  className={cn("font-semibold tracking-tight", compact ? "text-[11px]" : "text-xl")}
                >
                  {data.name}
                </FieldText>
                <FieldText
                  data={data}
                  fieldKey="title"
                  as="p"
                  className={cn(compact ? "text-[9px]" : "text-sm", styles.subtext)}
                >
                  {data.title}
                </FieldText>
              </div>
              {isFieldEnabled(data, "company") && data.company ? (
                <FieldText
                  data={data}
                  fieldKey="company"
                  as="span"
                  className={cn(
                    "rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-medium uppercase",
                    styles.subtext,
                  )}
                >
                  {compact ? data.company.slice(0, 8) : data.company}
                </FieldText>
              ) : null}
            </div>

            {!compact && data.bio ? (
              <FieldText
                data={data}
                fieldKey="bio"
                as="p"
                className={cn("text-sm leading-relaxed", styles.subtext)}
              >
                {data.bio}
              </FieldText>
            ) : null}

            {!compact && isFieldEnabled(data, "skills") && data.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.skills.slice(0, 5).map((skill) => {
                  const skillSettings = getFieldSettings(data, "skills");
                  return (
                    <span
                      key={skill}
                      className={cn(
                        "rounded-md bg-black/10 px-2 py-1 text-[11px] font-medium",
                        styles.subtext,
                        getFieldClassName(skillSettings),
                      )}
                      style={getFieldInlineStyle(skillSettings)}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            ) : null}

            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
            />

            {!compact && isFieldEnabled(data, "links") && data.links.length > 0 ? (
              <div className="flex flex-wrap gap-2 border-t border-current/10 pt-3">
                {data.links.map((link) => {
                  const linkSettings = getFieldSettings(data, "links");
                  const classNames = cn(
                    "inline-flex items-center gap-1 rounded-full bg-black/10 px-3 py-1 text-xs font-medium",
                    styles.text,
                    getFieldClassName(linkSettings),
                    interactive && "transition-opacity hover:opacity-80",
                  );

                  if (interactive) {
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={classNames}
                        style={getFieldInlineStyle(linkSettings)}
                        onClick={() =>
                          onLinkClick?.({
                            label: link.label,
                            href: link.href,
                          })
                        }
                      >
                        {link.label}
                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} />
                      </a>
                    );
                  }

                  return (
                    <span
                      key={link.label}
                      className={classNames}
                      style={getFieldInlineStyle(linkSettings)}
                    >
                      {link.label}
                      <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} />
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      );
  }
}

function ContactList({
  data,
  styles,
  compact,
  interactive = false,
  onLinkClick,
}: {
  data: CardData;
  styles: ThemeStyleClasses;
  compact?: boolean;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
}) {
  const rows = (
    [
      ["email", Mail01Icon, data.email, "Email"] as const,
      ["phone", CallIcon, data.phone, "Phone"] as const,
      ["location", Location01Icon, data.location, "Location"] as const,
      ["website", Globe02Icon, data.website, "Website"] as const,
    ] satisfies readonly [
      keyof CardData,
      IconSvgElement,
      string,
      string,
    ][]
  )
    .filter(([key, , value]) =>
      isFieldEnabled(data, key as "email" | "phone" | "location" | "website") &&
      value,
    )
    .map(([key, icon, value, label]) => ({
      key: key as "email" | "phone" | "location" | "website",
      icon,
      value,
      label,
    }));

  if (rows.length === 0) return null;

  function getHref(key: (typeof rows)[number]["key"], value: string) {
    if (key === "email") return `mailto:${value}`;
    if (key === "phone") return `tel:${value}`;
    if (key === "website") {
      return value.startsWith("http") ? value : `https://${value}`;
    }
    return undefined;
  }

  return (
    <div className={cn("grid gap-1.5", compact ? "text-[8px]" : "text-sm", styles.subtext)}>
      {rows.map(({ key, icon, value, label }) => {
        const href = getHref(key, value);
        const content = (
          <>
            <HugeiconsIcon icon={icon} size={compact ? 10 : 14} />
            <FieldText data={data} fieldKey={key} className="truncate">
              {value}
            </FieldText>
          </>
        );

        if (interactive && href && key !== "location") {
          return (
            <a
              key={value}
              href={href}
              target={key === "website" ? "_blank" : undefined}
              rel={key === "website" ? "noreferrer" : undefined}
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              onClick={() => onLinkClick?.({ label, href: value })}
            >
              {content}
            </a>
          );
        }

        return (
          <div key={value} className="flex items-center gap-2">
            {content}
          </div>
        );
      })}
    </div>
  );
}
