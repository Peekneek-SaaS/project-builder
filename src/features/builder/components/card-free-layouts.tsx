"use client";

import type { CardData } from "@/lib/card-data";
import type { CardLayout, CardTheme } from "@/lib/card-themes";
import { isFieldEnabled } from "@/lib/card-field-utils";
import { getInitials, getMonogramInitials } from "@/features/builder/components/card-brand-elements";
import {
  ContactList,
  type LinkClickPayload,
} from "@/features/builder/components/card-layouts";
import { FieldText } from "@/features/builder/components/field-text";
import { NameTitleStack } from "@/features/builder/components/card-name-title";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { useLayoutShell, tx } from "@/features/builder/components/card-layout-utils";
import { cn } from "@/lib/utils";

function PrismMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      className={cn("size-14 shrink-0", className)}
      fill="none"
    >
      <path
        d="M32 8c13.255 0 24 10.745 24 24S45.255 56 32 56"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 16c8.837 0 16 7.163 16 16s-7.163 16-16 16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

function MontrealLogoMark({
  data,
  compact,
  inverted = false,
}: {
  data: CardData;
  compact?: boolean;
  inverted?: boolean;
}) {
  const company =
    (isFieldEnabled(data, "company") && data.company.trim()) ||
    getInitials(data.name).slice(0, 1) ||
    "M";
  const word =
    (isFieldEnabled(data, "company") && data.company.trim().split(/\s+/)[0]?.toUpperCase()) ||
    company.toUpperCase();

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "grid place-items-center border font-semibold",
          inverted ? "border-white text-white" : "border-black text-black",
          tx(compact, "size-7 text-[10px]", "size-10 text-sm"),
        )}
      >
        {company.slice(0, 1).toUpperCase()}
      </div>
      <span
        className={cn(
          "font-medium uppercase tracking-[0.22em]",
          inverted ? "text-white" : "text-black",
          tx(compact, "text-[5px]", "text-[7px]"),
        )}
      >
        {word.slice(0, 12)}
      </span>
      {inverted ? (
        <span className={cn("h-px w-full bg-white/70", tx(compact, "max-w-8", "max-w-12"))} />
      ) : null}
    </div>
  );
}

function SplitContactList({
  data,
  compact,
  interactive,
  onLinkClick,
}: {
  data: CardData;
  compact?: boolean;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
}) {
  const rows = (
    [
      ["phone", data.phone] as const,
      ["email", data.email] as const,
      ["website", data.website] as const,
    ] as const
  ).filter(([key, value]) => isFieldEnabled(data, key) && value.trim());

  if (rows.length === 0) return null;

  function hrefFor(key: (typeof rows)[number][0], value: string) {
    if (key === "email") return `mailto:${value}`;
    if (key === "phone") return `tel:${value}`;
    return value.startsWith("http") ? value : `https://${value}`;
  }

  return (
    <div className={cn("grid gap-1.5 font-sans", tx(compact, "text-[7px]", "text-[10px]"))}>
      {rows.map(([key, value]) => {
        const href = hrefFor(key, value);
        const body = (
          <FieldText data={data} fieldKey={key} className="leading-snug">
            {value}
          </FieldText>
        );

        if (interactive && href) {
          return (
            <a
              key={key}
              href={href}
              target={key === "website" ? "_blank" : undefined}
              rel={key === "website" ? "noreferrer" : undefined}
              className="transition-opacity hover:opacity-75"
              onClick={() => onLinkClick?.({ label: key, href })}
            >
              {body}
            </a>
          );
        }

        return <div key={key}>{body}</div>;
      })}
    </div>
  );
}

function MontrealContactBlock({
  data,
  compact,
  interactive,
  onLinkClick,
}: {
  data: CardData;
  compact?: boolean;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
}) {
  const rows = (
    [
      ["phone", "P", data.phone] as const,
      ["email", "E", data.email] as const,
      ["website", "W", data.website] as const,
      ["location", "A", data.location] as const,
    ] as const
  ).filter(([key, , value]) => isFieldEnabled(data, key) && value.trim());

  if (rows.length === 0) return null;

  function hrefFor(key: (typeof rows)[number][0], value: string) {
    if (key === "email") return `mailto:${value}`;
    if (key === "phone") return `tel:${value}`;
    if (key === "website") {
      return value.startsWith("http") ? value : `https://${value}`;
    }
    return undefined;
  }

  return (
    <div className={cn("grid gap-1 font-serif", tx(compact, "text-[6px]", "text-[9px]"))}>
      {rows.map(([key, label, value]) => {
        const href = hrefFor(key, value);
        const content = (
          <>
            <span className="font-semibold">{label}:</span>{" "}
            <FieldText data={data} fieldKey={key}>{value}</FieldText>
          </>
        );

        if (interactive && href) {
          return (
            <a
              key={key}
              href={href}
              target={key === "website" ? "_blank" : undefined}
              rel={key === "website" ? "noreferrer" : undefined}
              className="transition-opacity hover:opacity-75"
              onClick={() => onLinkClick?.({ label: key, href })}
            >
              {content}
            </a>
          );
        }

        return <p key={key}>{content}</p>;
      })}
    </div>
  );
}

export function FreeCardFront({
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
  const shell = useLayoutShell();

  switch (theme.layout) {
    case "free-serif-split":
      return (
        <div className={shell(styles, theme, compact, "front", className)}>
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="flex flex-col items-center text-center">
              <FieldText
                data={data}
                fieldKey="name"
                className={cn(
                  "font-serif font-normal leading-none tracking-tight",
                  tx(compact, "text-3xl", "text-5xl"),
                )}
              >
                {getMonogramInitials(data.name, false) || "ML"}
              </FieldText>
              <FieldText
                data={data}
                fieldKey="company"
                as="p"
                className={cn(
                  "mt-2 font-sans font-medium uppercase tracking-[0.14em]",
                  styles.subtext,
                  tx(compact, "text-[8px]", "text-[11px]"),
                )}
              >
                {data.company}
              </FieldText>
            </div>
          </div>
        </div>
      );

    case "free-montreal-frame":
      return (
        <div
          className={shell(
            styles,
            theme,
            compact,
            "front",
            cn("flex min-h-0 flex-1 flex-col bg-white p-[6%]", className),
          )}
        >
          <div className="relative flex min-h-0 w-full flex-1 flex-col bg-neutral-100 p-[8%]">
            <div className="absolute right-[8%] top-[8%]">
              <MontrealLogoMark data={data} compact={compact} />
            </div>
            <div className="mt-auto min-w-0 max-w-[72%] pr-[4%]">
              <NameTitleStack
                data={data}
                compact={compact}
                styles={styles}
                nameClassName={cn(
                  "min-w-0 break-words font-normal font-sans tracking-tight",
                  tx(compact, "text-[11px]", "text-xl"),
                )}
                titleClassName={cn("font-serif", tx(compact, "text-[8px]", "text-xs"))}
              />
              <span className={cn("mt-2 block h-px w-10 bg-black", tx(compact, "mb-1", "mb-2"))} />
              <MontrealContactBlock
                data={data}
                compact={compact}
              />
            </div>
          </div>
        </div>
      );

    case "free-prism-dark":
      return (
        <div className={shell(styles, theme, compact, "front", className)}>
          <div className="flex flex-1 items-center justify-center">
            {isFieldEnabled(data, "logo") && data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt=""
                className={cn("object-contain", tx(compact, "max-h-10 max-w-20", "max-h-16 max-w-28"))}
              />
            ) : (
              <PrismMark />
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function FreeCardBack({
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
  const shell = useLayoutShell();

  switch (theme.layout) {
    case "free-serif-split":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <div className="flex flex-1">
            <div className="flex w-1/2 flex-col items-end justify-center gap-1.5 border-r border-black/80 px-[8%] text-right">
              <NameTitleStack
                data={data}
                compact={compact}
                styles={styles}
                align="end"
                nameClassName={cn("font-serif", tx(compact, "text-[9px]", "text-sm"))}
                titleClassName={cn("font-serif", tx(compact, "text-[7px]", "text-[10px]"))}
              />
            </div>
            <div className="flex w-1/2 flex-col justify-center px-[8%]">
              <SplitContactList
                data={data}
                compact={compact}
                interactive={interactive}
                onLinkClick={onLinkClick}
              />
            </div>
          </div>
        </div>
      );

    case "free-montreal-frame":
      return (
        <div
          className={shell(
            styles,
            theme,
            compact,
            "back",
            cn("items-center justify-center bg-[#1A1A1A] text-white", className),
          )}
        >
          <MontrealLogoMark data={data} compact={compact} inverted />
        </div>
      );

    case "free-prism-dark":
      return (
        <div className={shell(styles, theme, compact, "back", className)}>
          <div className="absolute left-[8%] top-[8%]">
            {isFieldEnabled(data, "logo") && data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt=""
                className={cn("object-contain", tx(compact, "max-h-6 max-w-12", "max-h-8 max-w-16"))}
              />
            ) : (
              <PrismMark className={tx(compact, "size-8", "size-10")} />
            )}
          </div>
          {isFieldEnabled(data, "company") && data.company.trim() ? (
            <FieldText
              data={data}
              fieldKey="company"
              className={cn(
                "absolute bottom-[8%] left-[8%] max-w-[40%] truncate font-sans font-medium",
                styles.subtext,
                tx(compact, "text-[7px]", "text-[10px]"),
              )}
            >
              {data.company}
            </FieldText>
          ) : null}
          <div
            className={cn(
              "absolute bottom-[8%] right-[8%] text-right font-sans",
              tx(compact, "max-w-[58%] text-[7px]", "max-w-[55%] text-[10px]"),
            )}
          >
            <NameTitleStack
              data={data}
              compact={compact}
              styles={styles}
              align="end"
              className="mb-2"
              nameClassName={cn(
                "min-w-0 break-words",
                tx(compact, "text-[8px]", "text-xs"),
              )}
            />
            <ContactList
              data={data}
              styles={styles}
              compact={compact}
              interactive={interactive}
              onLinkClick={onLinkClick}
              className="text-end [&>a]:justify-end [&>div]:justify-end"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}

export const FREE_LAYOUTS = new Set<CardLayout>([
  "free-serif-split",
  "free-montreal-frame",
  "free-prism-dark",
]);

export function isFreeLayout(layout: CardLayout): boolean {
  return FREE_LAYOUTS.has(layout);
}
