import type { CardData } from "@/lib/card-data";
import { isFieldEnabled } from "@/lib/card-field-utils";
import { FieldText } from "@/features/builder/components/field-text";
import { NameTitleStack } from "@/features/builder/components/card-name-title";
import type { LinkClickPayload } from "@/features/builder/components/card-layouts";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

export function tx(compact: boolean | undefined, sm: string, lg: string) {
  return compact ? sm : lg;
}

export function companyWord(data: CardData) {
  if (isFieldEnabled(data, "company") && data.company.trim()) {
    return data.company.trim();
  }
  return data.name.split(/\s+/)[0] || "Studio";
}

export function websiteDisplay(url: string) {
  return url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

export function LabeledContacts({
  data,
  compact,
  interactive,
  onLinkClick,
  className,
  labelClassName,
}: {
  data: CardData;
  compact?: boolean;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
  className?: string;
  labelClassName?: string;
}) {
  const rows = (
    [
      ["email", "E", data.email] as const,
      ["phone", "T", data.phone] as const,
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
    <div className={cn("grid gap-1", tx(compact, "text-[6px]", "text-[9px]"), className)}>
      {rows.map(([key, label, value]) => {
        const href = hrefFor(key, value);
        const body = (
          <>
            <span className={cn("font-semibold", labelClassName)}>{label} :</span>{" "}
            <FieldText data={data} fieldKey={key}>
              {key === "website" ? websiteDisplay(value) : value}
            </FieldText>
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
              {body}
            </a>
          );
        }
        return <p key={key}>{body}</p>;
      })}
    </div>
  );
}

export function NameTitleBlock({
  data,
  compact,
  styles,
  nameClassName,
  titleClassName,
  className,
}: {
  data: CardData;
  compact?: boolean;
  styles: ThemeStyleClasses;
  nameClassName?: string;
  titleClassName?: string;
  className?: string;
}) {
  const align = className?.includes("text-right") || className?.includes("items-end")
    ? "end"
    : className?.includes("text-center")
      ? "center"
      : "start";

  return (
    <NameTitleStack
      data={data}
      compact={compact}
      styles={styles}
      nameClassName={nameClassName}
      titleClassName={titleClassName}
      className={className}
      align={align}
    />
  );
}

export function GeometricLineGrid({
  className,
  stroke = "currentColor",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden
      className={cn("h-full w-full", className)}
      fill="none"
    >
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 4 }).map((__, col) => {
          const x = col * 30 + 8;
          const y = row * 30 + 8;
          const variant = (row + col) % 3;
          return (
            <g key={`${row}-${col}`} transform={`translate(${x} ${y})`}>
              {variant === 0 ? (
                <circle cx="7" cy="7" r="6" stroke={stroke} strokeWidth="0.8" />
              ) : null}
              {variant === 1 ? (
                <>
                  <path d="M1 14 L14 14" stroke={stroke} strokeWidth="0.8" />
                  <path d="M7 1 L7 14" stroke={stroke} strokeWidth="0.8" />
                </>
              ) : null}
              {variant === 2 ? (
                <path
                  d="M1 14 A 13 13 0 0 1 14 1"
                  stroke={stroke}
                  strokeWidth="0.8"
                />
              ) : null}
            </g>
          );
        }),
      )}
    </svg>
  );
}

export function OverlapSquares({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" aria-hidden className={className} fill="none">
      <rect
        x="8"
        y="24"
        width="72"
        height="72"
        rx="10"
        stroke="currentColor"
        strokeWidth="3"
        className="text-[#2C3E50]"
      />
      <rect
        x="48"
        y="56"
        width="72"
        height="72"
        rx="10"
        stroke="currentColor"
        strokeWidth="3"
        className="text-[#D5D8DC]"
      />
      <rect
        x="88"
        y="88"
        width="56"
        height="56"
        rx="8"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-[#2C3E50]"
      />
    </svg>
  );
}

export function BlueBlockPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" aria-hidden className={className}>
      <rect width="200" height="120" fill="#1E6FD9" />
      <path d="M0 40 H80 V0 H160 V80 H200 V120 H120 V40 H40 V120 H0 Z" fill="#FFFFFF" opacity="0.95" />
      <path d="M40 20 H100 V60 H160 V20 H120 V0 H40 Z" fill="#1E6FD9" opacity="0.35" />
    </svg>
  );
}

export function OrganicWave({
  className,
  colorClass = "text-[#F5B800]",
}: {
  className?: string;
  colorClass?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 260"
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
      preserveAspectRatio="none"
    >
      <path
        d="M-20 180 C80 120, 140 220, 260 150 S420 80, 420 260 H-20 Z"
        className={cn("fill-current", colorClass)}
      />
      <path
        d="M-20 200 C100 150, 180 240, 300 170 S440 110, 440 260 H-20 Z"
        className={cn("fill-current opacity-40", colorClass)}
      />
    </svg>
  );
}
