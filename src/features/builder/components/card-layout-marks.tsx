import { cn } from "@/lib/utils";
import { useId, type CSSProperties, type ReactNode } from "react";

type MarkSize = "sm" | "md" | "lg" | "watermark";

const sizeMap: Record<MarkSize, string> = {
  sm: "size-10",
  md: "size-16",
  lg: "size-24",
  watermark: "size-48 sm:size-56",
};

function HatchPattern({ id }: { id: string }) {
  return (
    <pattern
      id={id}
      patternUnits="userSpaceOnUse"
      width="3"
      height="3"
      patternTransform="rotate(45)"
    >
      <line
        x1="0"
        y1="0"
        x2="0"
        y2="3"
        stroke="currentColor"
        strokeWidth="0.85"
      />
    </pattern>
  );
}

export function HatchChevronMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  const patternId = useId();

  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
    >
      <defs>
        <HatchPattern id={patternId} />
      </defs>
      <path fill={`url(#${patternId})`} d="M8 62V18l20 22v22H8z" />
      <path fill={`url(#${patternId})`} d="M34 14h12v52H34V14z" />
      <path fill={`url(#${patternId})`} d="M52 18v22l20-22v44H52V40L52 18z" />
    </svg>
  );
}

export function BotanicalFlowerMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
      fill="none"
    >
      <path
        d="M40 72V46"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M40 46C40 46 26 36 28 20C34 28 38 34 40 46C42 34 46 28 52 20C54 36 40 46 40 46Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="40" cy="16" r="3.5" fill="currentColor" />
    </svg>
  );
}

export function StudioCrownMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
      fill="currentColor"
    >
      <path d="M18 58V34l10 10 12-22 12 22 10-10v24H18z" />
      <circle cx="28" cy="24" r="3" />
      <circle cx="40" cy="18" r="3" />
      <circle cx="52" cy="24" r="3" />
    </svg>
  );
}

export function DecorativeQrPlaceholder({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid shrink-0 grid-cols-5 grid-rows-5 gap-px rounded-sm border border-current/20 bg-white p-1",
        className,
      )}
    >
      {Array.from({ length: 25 }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "size-1.5",
            [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 20, 22, 24].includes(index)
              ? "bg-current"
              : "bg-transparent",
          )}
        />
      ))}
    </div>
  );
}

export function ChevronNestMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
      fill="none"
    >
      <rect x="18" y="18" width="44" height="44" rx="8" stroke="currentColor" strokeWidth="2.5" />
      <path d="M28 48 L40 28 L52 48" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M34 48 L40 38 L46 48" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function CameraMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
      fill="currentColor"
    >
      <path d="M12 28h12l6-8h20l6 8h12v36H12V28z" />
      <circle cx="40" cy="46" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="40" cy="46" r="4" />
    </svg>
  );
}

export function ArchitectureNMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
      fill="none"
    >
      <path d="M16 64V16l24 32V64" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
      <path d="M56 64V16" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function PlugMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
      fill="none"
    >
      <rect x="22" y="28" width="36" height="24" rx="4" stroke="currentColor" strokeWidth="3" />
      <path d="M30 28V18M40 28V18M50 28V18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 52 C40 52 28 58 28 68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function FishMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
      fill="none"
    >
      <path
        d="M58 40 C48 24 28 24 18 40 C28 56 48 56 58 40Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M58 40 L72 28 V52 Z" fill="currentColor" />
      <circle cx="30" cy="38" r="3" fill="currentColor" />
    </svg>
  );
}

export function LegalSealMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
      fill="none"
    >
      <rect x="20" y="20" width="40" height="40" rx="10" stroke="currentColor" strokeWidth="3" />
      <path d="M28 44 H52 M28 36 H52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 20 V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function RocketMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: MarkSize;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(sizeMap[size], className)}
      fill="none"
    >
      <path d="M28 52 L40 16 L52 52 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M34 44 H46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function CirclePattern({
  className,
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 120 200" aria-hidden className={className} fill="none">
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 3 }).map((__, col) => (
          <circle
            key={`${row}-${col}`}
            cx={20 + col * 40}
            cy={16 + row * 24}
            r="10"
            stroke={color}
            strokeWidth="1"
            opacity="0.35"
          />
        )),
      )}
    </svg>
  );
}

export function ToothMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M24 6c-6 0-10 5-10 11 0 4 2 7 4 9v14c0 2 2 4 6 4s6-2 6-4V26c2-2 4-5 4-9 0-6-4-11-10-11Z"
        fill="currentColor"
        fillOpacity="0.92"
      />
      <path
        d="M14 18c2-1 4-1 6 0 2 1 4 1 6 0 2-1 4-1 6 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export function layoutHasBrandMark(layout: string): boolean {
  switch (layout) {
    case "minimal-hatch":
    case "minimal-botanical":
    case "minimal-studio":
    case "job-chevron":
    case "job-agency":
    case "job-photo-split":
    case "job-arch-split":
    case "job-electric-plug":
    case "job-electric-service":
    case "job-restaurant":
    case "job-legal":
    case "job-rocket-pattern":
    case "mod-rexora":
    case "mod-codai":
    case "mod-rollux":
    case "mod-vitvio":
    case "mod-solara":
    case "mod-solara-brand":
    case "mod-zight":
    case "mod-alpha":
    case "mod-southern":
    case "mod-riwo":
      return true;
    default:
      return false;
  }
}

export function ThemeBrandMark({
  layout,
  className,
  size = "md",
  style,
}: {
  layout: string;
  className?: string;
  size?: MarkSize;
  style?: CSSProperties;
}) {
  let mark: ReactNode = null;

  switch (layout) {
    case "minimal-hatch":
      mark = <HatchChevronMark className={className} size={size} />;
      break;
    case "minimal-botanical":
      mark = <BotanicalFlowerMark className={className} size={size} />;
      break;
    case "minimal-studio":
      mark = <StudioCrownMark className={className} size={size} />;
      break;
    case "job-chevron":
    case "job-agency":
      mark = <ChevronNestMark className={className} size={size} />;
      break;
    case "job-photo-split":
      mark = <CameraMark className={className} size={size} />;
      break;
    case "job-arch-split":
      mark = <ArchitectureNMark className={className} size={size} />;
      break;
    case "job-electric-plug":
    case "job-electric-service":
      mark = <PlugMark className={className} size={size} />;
      break;
    case "job-restaurant":
      mark = <FishMark className={className} size={size} />;
      break;
    case "job-legal":
      mark = <LegalSealMark className={className} size={size} />;
      break;
    case "job-rocket-pattern":
      mark = <RocketMark className={className} size={size} />;
      break;
    default:
      mark = null;
  }

  if (!mark) return null;
  if (!style) return mark;

  return (
    <span className={cn("inline-flex", className)} style={style}>
      {mark}
    </span>
  );
}
