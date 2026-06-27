"use client";

import type { ReactNode } from "react";
import type { CardData } from "@/lib/card-data";
import type { CardLayout, CardTheme } from "@/lib/card-themes";
import { isFieldEnabled } from "@/lib/card-field-utils";
import { getInitials } from "@/features/builder/components/card-brand-elements";
import {
  ContactList,
  type LinkClickPayload,
} from "@/features/builder/components/card-layouts";
import { FieldText } from "@/features/builder/components/field-text";
import {
  BlueBlockPattern,
  companyWord,
  GeometricLineGrid,
  LabeledContacts,
  NameTitleBlock,
  OrganicWave,
  OverlapSquares,
  tx,
  websiteDisplay,
} from "@/features/builder/components/card-studio-shared";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { layoutShell } from "@/features/builder/components/card-layout-utils";
import { useCardPrintExport } from "@/features/builder/components/card-print-export-context";
import { cn } from "@/lib/utils";

type StudioProps = {
  data: CardData;
  theme: CardTheme;
  styles: ThemeStyleClasses;
  compact?: boolean;
  className?: string;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
  forPrint?: boolean;
};

function shell(
  styles: ThemeStyleClasses,
  theme: CardTheme,
  compact: boolean | undefined,
  side: "front" | "back",
  className?: string,
  forPrint?: boolean,
) {
  return layoutShell(styles, theme, compact, side, className, forPrint);
}

function CohubFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", className, forPrint)}>
      <div className="absolute right-[10%] top-[12%] size-[18%] rounded-full bg-[#66BB6A]" />
      <div className="pointer-events-none absolute -left-[8%] top-[8%] font-serif text-[clamp(3rem,18vw,5rem)] leading-none opacity-90">
        {getInitials(data.name).slice(0, 1) || "C"}
      </div>
      <div className="pointer-events-none absolute -right-[4%] bottom-[6%] font-serif text-[clamp(3rem,18vw,5rem)] leading-none opacity-90">
        o
      </div>
    </div>
  );
}

function CohubBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", className, forPrint)}>
      <div className="absolute left-[8%] top-1/2 size-[22%] -translate-y-1/2 rounded-full shadow-[inset_2px_2px_6px_rgba(0,0,0,0.12)]" />
      <div className="relative z-10 flex flex-1 flex-col p-[8%] pl-[34%]">
        <NameTitleBlock
          data={data}
          compact={compact}
          styles={styles}
          nameClassName="font-sans"
          className="ml-auto max-w-[58%] text-right"
        />
        <LabeledContacts
          data={data}
          compact={compact}
          interactive={interactive}
          onLinkClick={onLinkClick}
          className="ml-auto mt-4 max-w-[58%] text-right"
        />
        <div className="mt-auto flex items-end justify-between gap-4 pt-4">
          <div className="flex items-center gap-1.5">
            <FieldText data={data} fieldKey="company" as="p" className={cn("font-serif font-bold leading-tight", tx(compact, "text-sm", "text-lg"))}>
              {companyWord(data)}
            </FieldText>
            <span className="size-1.5 shrink-0 rounded-full bg-[#66BB6A]" />
          </div>
          {isFieldEnabled(data, "website") && data.website ? (
            <FieldText
              data={data}
              fieldKey="website"
              as="p"
              className={cn("font-serif leading-tight text-[#66BB6A]", tx(compact, "text-[8px]", "text-xs"))}
            >
              {websiteDisplay(data.website)}
            </FieldText>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AusterlitzFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", className, forPrint)}>
      <div className="flex flex-1 flex-col justify-between p-[8%]">
        <FieldText data={data} fieldKey="company" className={cn("self-end font-semibold tracking-tight", tx(compact, "text-sm", "text-2xl"))}>
          {companyWord(data)}
        </FieldText>
        <div className="flex flex-col gap-3">
          <NameTitleBlock data={data} compact={compact} styles={styles} nameClassName="font-medium" />
          <LabeledContacts data={data} compact={compact} className="max-w-[70%]" labelClassName="opacity-70" />
        </div>
      </div>
    </div>
  );
}

function AusterlitzBack({ theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", cn("p-0", className), forPrint)}>
      <BlueBlockPattern className="h-full w-full" />
    </div>
  );
}

function RocketFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", className, forPrint)}>
      <OverlapSquares className="absolute -left-4 top-4 h-[55%] w-[45%] opacity-90" />
      <div className="relative z-10 flex flex-1 flex-col items-end justify-center p-[8%] text-right">
        <FieldText data={data} fieldKey="company" className={cn("font-bold uppercase tracking-[0.14em] text-[#2C3E50]", tx(compact, "text-[10px]", "text-base"))}>
          {companyWord(data).toUpperCase()}
        </FieldText>
        {isFieldEnabled(data, "tagline") && data.tagline ? (
          <FieldText data={data} fieldKey="tagline" className={cn("mt-1 uppercase tracking-[0.18em] text-[#D5D8DC]", tx(compact, "text-[7px]", "text-[10px]"))}>
            {data.tagline}
          </FieldText>
        ) : null}
        {isFieldEnabled(data, "website") && data.website ? (
          <FieldText data={data} fieldKey="website" className={cn("mt-4 uppercase tracking-[0.2em] text-[#D5D8DC]", tx(compact, "text-[6px]", "text-[8px]"))}>
            {websiteDisplay(data.website).toUpperCase()}
          </FieldText>
        ) : null}
      </div>
    </div>
  );
}

function RocketBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", className, forPrint)}>
      <OverlapSquares className="absolute -right-3 bottom-3 h-[38%] w-[34%] opacity-80" />
      <div className="relative z-10 flex flex-1 flex-col justify-between p-[8%]">
        <NameTitleBlock
          data={data}
          compact={compact}
          styles={styles}
          nameClassName="uppercase tracking-[0.12em] text-[#2C3E50]"
          titleClassName="uppercase tracking-[0.16em]"
        />
        <ContactList data={data} styles={styles} compact={compact} interactive={interactive} onLinkClick={onLinkClick} />
      </div>
    </div>
  );
}

function BauhausFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", cn("bg-black text-white", className), forPrint)}>
      <GeometricLineGrid className="absolute right-0 top-0 h-[48%] w-[42%] opacity-90" stroke="#FFFFFF" />
      <div className="absolute bottom-[10%] left-[8%] flex items-center gap-2">
        <span className={cn("grid place-items-center rounded-sm border border-white/80 font-bold uppercase", tx(compact, "size-6 text-[8px]", "size-8 text-[10px]"))}>
          {getInitials(data.name).slice(0, 1)}
        </span>
        <FieldText data={data} fieldKey="company" className={cn("font-bold uppercase tracking-[0.2em]", tx(compact, "text-[8px]", "text-xs"))}>
          {companyWord(data)}
        </FieldText>
      </div>
    </div>
  );
}

function BauhausBack({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", cn("bg-white text-black", className), forPrint)}>
      <GeometricLineGrid className="absolute right-0 top-0 h-full w-[34%] opacity-80" stroke="#000000" />
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-4 p-[8%]">
        <NameTitleBlock
          data={data}
          compact={compact}
          styles={styles}
          nameClassName="uppercase tracking-[0.08em]"
          titleClassName="uppercase tracking-[0.18em]"
        />
        <div className={cn("grid gap-1 uppercase tracking-[0.12em]", tx(compact, "text-[6px]", "text-[8px]"), styles.subtext)}>
          {isFieldEnabled(data, "location") && data.location ? (
            <FieldText data={data} fieldKey="location">{data.location}</FieldText>
          ) : null}
          {isFieldEnabled(data, "website") && data.website ? (
            <FieldText data={data} fieldKey="website">{websiteDisplay(data.website).toUpperCase()}</FieldText>
          ) : null}
          {isFieldEnabled(data, "phone") && data.phone ? (
            <FieldText data={data} fieldKey="phone">{data.phone}</FieldText>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GoldenWaveFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", className, forPrint)}>
      <OrganicWave />
      <div className="relative z-10 flex flex-1 flex-col items-end justify-center gap-1 p-[8%] text-right">
        <div className={cn("grid place-items-center border-2 border-[#F5B800] bg-[#F5B800]/10", tx(compact, "size-8", "size-12"))}>
          <span className={cn("font-bold text-[#F5B800]", tx(compact, "text-[10px]", "text-sm"))}>
            {getInitials(data.name).slice(0, 1)}
          </span>
        </div>
        <FieldText data={data} fieldKey="company" className={cn("font-bold uppercase tracking-[0.14em]", tx(compact, "text-[9px]", "text-sm"))}>
          {companyWord(data)}
        </FieldText>
        {isFieldEnabled(data, "tagline") && data.tagline ? (
          <FieldText data={data} fieldKey="tagline" className={cn("uppercase tracking-[0.18em]", styles.subtext, tx(compact, "text-[6px]", "text-[8px]"))}>
            {data.tagline}
          </FieldText>
        ) : null}
      </div>
    </div>
  );
}

function GoldenWaveBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", className, forPrint)}>
      <OrganicWave className="scale-x-[-1]" />
      <div className="relative z-10 flex flex-1 flex-col justify-between p-[8%]">
        <div className="flex flex-col gap-1.5">
          <FieldText data={data} fieldKey="name" as="p" className={cn("font-bold uppercase leading-tight tracking-[0.1em] text-[#F5B800]", tx(compact, "text-[10px]", "text-base"))}>
            {data.name}
          </FieldText>
          <span className="block h-3 w-0.5 bg-[#F5B800]" />
          <FieldText data={data} fieldKey="title" as="p" className={cn("uppercase leading-snug tracking-[0.16em]", styles.subtext, tx(compact, "text-[7px]", "text-[9px]"))}>
            {data.title}
          </FieldText>
        </div>
        <ContactList data={data} styles={styles} compact={compact} interactive={interactive} onLinkClick={onLinkClick} />
      </div>
    </div>
  );
}

function SarahFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  const first = data.name.split(/\s+/)[0] || data.name;
  return (
    <div className={shell(styles, theme, compact, "front", className, forPrint)}>
      <div className="absolute right-0 top-0 h-full w-[52%] bg-[#8EBAFF]" style={{ borderRadius: "48% 42% 55% 45% / 50% 45% 55% 50%" }} />
      <div className="relative z-10 flex flex-1">
        <div className="flex w-[38%] items-end justify-center pb-[12%]">
          <p className={cn("-rotate-90 whitespace-nowrap uppercase tracking-[0.22em]", tx(compact, "text-[7px]", "text-[10px]"))}>
            {isFieldEnabled(data, "title") ? data.title : "Creative"}
          </p>
        </div>
        <div className="flex flex-1 flex-col justify-center pr-[8%]">
          <FieldText data={data} fieldKey="name" className={cn("font-bold", tx(compact, "text-lg", "text-3xl"))}>
            {first}
          </FieldText>
          <span className="mt-2 h-px w-16 bg-black" />
        </div>
      </div>
    </div>
  );
}

function SarahBack({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", cn("bg-[#8EBAFF]", className), forPrint)}>
      <div className="flex flex-1 flex-col p-[8%]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <FieldText data={data} fieldKey="name" as="p" className={cn("font-bold leading-tight", tx(compact, "text-[10px]", "text-base"))}>
            {data.name}.
          </FieldText>
          <FieldText data={data} fieldKey="title" as="p" className={cn("leading-snug text-white/90 sm:max-w-[42%] sm:text-right", tx(compact, "text-[7px]", "text-[10px]"))}>
            {data.title}
          </FieldText>
        </div>
        <span className="my-3 h-px w-full bg-black/80" />
        <div className={cn("grid grid-cols-3 gap-2", tx(compact, "text-[6px]", "text-[8px]"))}>
          {isFieldEnabled(data, "location") && data.location ? (
            <FieldText data={data} fieldKey="location">{data.location}</FieldText>
          ) : null}
          {isFieldEnabled(data, "website") && data.website ? (
            <FieldText data={data} fieldKey="website" className="text-center">
              {websiteDisplay(data.website)}
            </FieldText>
          ) : null}
          {isFieldEnabled(data, "email") && data.email ? (
            <FieldText data={data} fieldKey="email" className="text-right">{data.email}</FieldText>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FlorenceFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  const parts = data.name.trim().split(/\s+/);
  const first = parts.slice(0, -1).join(" ") || data.name;
  const last = parts.length > 1 ? `${parts.at(-1)}.` : "";
  return (
    <div className={shell(styles, theme, compact, "front", className, forPrint)}>
      <div className="flex flex-1 flex-col justify-center gap-1 p-[8%] uppercase">
        <p className={cn("font-bold text-white mix-blend-difference", tx(compact, "text-[10px]", "text-sm"))}>Hi I&apos;m</p>
        <FieldText data={data} fieldKey="name" className={cn("font-bold", tx(compact, "text-xl", "text-4xl"))}>
          {first || data.name}
        </FieldText>
        {last ? <p className={cn("font-bold text-white mix-blend-difference", tx(compact, "text-xl", "text-4xl"))}>{last}</p> : null}
        <FieldText data={data} fieldKey="title" className={cn("mt-4 tracking-[0.24em]", styles.subtext, tx(compact, "text-[7px]", "text-[10px]"))}>
          {data.title}
        </FieldText>
      </div>
    </div>
  );
}

function FlorenceBack({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", className, forPrint)}>
      <div className="flex flex-1 flex-col justify-between p-[8%]">
        <NameTitleBlock data={data} compact={compact} styles={styles} nameClassName="uppercase tracking-[0.08em]" titleClassName="uppercase tracking-[0.2em]" />
        <div className="flex items-end justify-between gap-4">
          <ContactList data={data} styles={styles} compact={compact} />
          {isFieldEnabled(data, "website") && data.website ? (
            <FieldText
              data={data}
              fieldKey="website"
              className={cn("origin-bottom-right -rotate-90 whitespace-nowrap uppercase tracking-[0.2em]", tx(compact, "text-[6px]", "text-[8px]"))}
            >
              {websiteDisplay(data.website).toUpperCase()}
            </FieldText>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AdventureFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", className, forPrint)}>
      <div className="absolute right-0 top-0 h-full w-[42%] bg-[#D32F2F]">
        <svg viewBox="0 0 100 160" className="h-full w-full opacity-30" fill="none" aria-hidden>
          <path d="M10 10 H90 M10 50 H70 M30 90 H90 M10 130 H60" stroke="white" strokeWidth="1.2" />
          <circle cx="72" cy="42" r="18" stroke="white" strokeWidth="1.2" />
        </svg>
      </div>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-[8%] text-[#D32F2F]">
        <div className={cn("mb-3 grid place-items-center rounded-full border-2 border-[#D32F2F]", tx(compact, "size-10", "size-14"))}>
          <span className={cn("font-bold", tx(compact, "text-sm", "text-xl"))}>{getInitials(data.name).slice(0, 1)}</span>
        </div>
        <FieldText data={data} fieldKey="company" className={cn("font-bold uppercase tracking-[0.16em]", tx(compact, "text-[9px]", "text-sm"))}>
          {companyWord(data)}
        </FieldText>
        {isFieldEnabled(data, "tagline") && data.tagline ? (
          <FieldText data={data} fieldKey="tagline" className={cn("mt-1 uppercase tracking-[0.18em]", tx(compact, "text-[6px]", "text-[8px]"))}>
            {data.tagline}
          </FieldText>
        ) : null}
      </div>
    </div>
  );
}

function AdventureBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", className, forPrint)}>
      <div className="absolute right-0 top-0 h-full w-[28%] bg-[#D32F2F]/10">
        <svg viewBox="0 0 60 160" className="h-full w-full text-[#D32F2F]" fill="none" aria-hidden>
          <path d="M5 10 H55 M5 60 H40 M20 110 H55" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="relative z-10 flex flex-1 flex-col p-[8%] text-[#D32F2F]">
        <NameTitleBlock
          data={data}
          compact={compact}
          styles={styles}
          nameClassName="uppercase tracking-[0.1em]"
          titleClassName="uppercase tracking-[0.16em]"
        />
        <div className="mt-5">
          <ContactList data={data} styles={styles} compact={compact} interactive={interactive} onLinkClick={onLinkClick} />
        </div>
      </div>
    </div>
  );
}

function PontoFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  const brand = companyWord(data).toLowerCase();
  return (
    <div className={shell(styles, theme, compact, "front", className, forPrint)}>
      <FieldText
        data={data}
        fieldKey="company"
        className={cn(
          "absolute left-[8%] top-[10%] font-bold lowercase",
          tx(compact, "text-sm", "text-xl"),
        )}
      >
        {brand}
      </FieldText>
      <div
        className="absolute left-1/2 top-1/2 h-[42%] w-[38%] -translate-x-1/2 -translate-y-1/2 bg-[#2E5BFF]"
        style={{ borderRadius: "46% 54% 42% 58% / 58% 42% 58% 42%" }}
      />
    </div>
  );
}

function PontoBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", className, forPrint)}>
      <div className="flex flex-1 flex-col justify-between p-[8%]">
        <NameTitleBlock data={data} compact={compact} styles={styles} className="self-end text-right" />
        <LabeledContacts
          data={data}
          compact={compact}
          interactive={interactive}
          onLinkClick={onLinkClick}
          className="self-end text-right"
        />
      </div>
    </div>
  );
}

function BusinessFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", cn("bg-black text-white", className), forPrint)}>
      <GeometricLineGrid className="absolute left-0 top-0 h-[36%] w-[32%] opacity-70" stroke="#FFFFFF" />
      <GeometricLineGrid className="absolute bottom-0 right-0 h-[36%] w-[32%] opacity-70" stroke="#FFFFFF" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2">
        <span className={cn("font-bold lowercase", tx(compact, "text-3xl", "text-5xl"))}>b</span>
        <span className={cn("uppercase tracking-[0.28em]", tx(compact, "text-[5px]", "text-[7px]"))}>Business Center</span>
      </div>
    </div>
  );
}

function BusinessBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", cn("bg-white text-black", className), forPrint)}>
      <GeometricLineGrid className="absolute bottom-0 right-0 h-[42%] w-[36%] opacity-80" stroke="#000000" />
      <div className="relative z-10 flex flex-1 flex-col justify-between p-[8%]">
        <NameTitleBlock data={data} compact={compact} styles={styles} className="self-end text-right uppercase" nameClassName="tracking-[0.08em]" titleClassName="tracking-[0.18em]" />
        <LabeledContacts data={data} compact={compact} interactive={interactive} onLinkClick={onLinkClick} className="max-w-[62%] uppercase tracking-[0.08em]" />
      </div>
    </div>
  );
}

function BillFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  const word = companyWord(data).split(/\s+/)[0] || "Bill";
  return (
    <div className={shell(styles, theme, compact, "front", cn("bg-[#FFEF00] text-black", className), forPrint)}>
      <div className="flex flex-1 items-center justify-center p-[6%]">
        <p className={cn("font-black leading-none", tx(compact, "text-4xl", "text-7xl"))}>
          {word.charAt(0).toUpperCase()}
          {word.slice(1).toLowerCase()}
          <span className="align-baseline">.</span>
        </p>
      </div>
    </div>
  );
}

function BillBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", cn("bg-[#FFEF00] text-black", className), forPrint)}>
      <div className="flex flex-1 flex-col justify-between p-[8%]">
        <div className="flex items-start justify-between gap-3">
          <svg viewBox="0 0 48 32" className={cn("shrink-0", tx(compact, "h-6 w-10", "h-10 w-16"))} aria-hidden>
            <path d="M4 24 L12 8 L20 24 L28 10 L36 24 L44 12" fill="currentColor" />
          </svg>
          <div className={cn("text-right uppercase tracking-[0.12em]", tx(compact, "text-[6px]", "text-[8px]"))}>
            <p className="opacity-70">Home of powerhouses</p>
            <p className="font-semibold">{isFieldEnabled(data, "title") ? data.title : "Heavy Equipment"}</p>
          </div>
        </div>
        <div className="self-end text-right uppercase tracking-[0.08em]">
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
}

function RefreshFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  const word = companyWord(data).split(/\s+/)[0]?.toLowerCase() || "brand";
  return (
    <div className={shell(styles, theme, compact, "front", cn("bg-[#0040FF] text-white", className), forPrint)}>
      <div className="flex flex-1 items-center justify-center">
        <p className={cn("relative font-black lowercase tracking-tight", tx(compact, "text-2xl", "text-5xl"))}>
          {word}
          <span className={cn("absolute -right-3 -top-1", tx(compact, "text-[6px]", "text-[10px]"))}>TM</span>
        </p>
      </div>
    </div>
  );
}

function RefreshBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", cn("text-[#0040FF]", className), forPrint)}>
      <div className="flex flex-1 flex-col p-[8%]">
        <NameTitleBlock
          data={data}
          compact={compact}
          styles={styles}
          nameClassName={cn("font-bold leading-tight", tx(compact, "text-base", "text-3xl"))}
          titleClassName={cn("mt-1 leading-tight", tx(compact, "text-[9px]", "text-lg"))}
        />
        <span className="my-3 h-px w-full bg-[#0040FF]/80" />
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

function FloxFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  const brand = companyWord(data).toUpperCase().slice(0, 4);
  return (
    <div className={shell(styles, theme, compact, "front", cn("bg-[#1E40FF]", className), forPrint)}>
      <div className="flex flex-1 items-center justify-center p-[8%]">
        <p
          className={cn(
            "bg-gradient-to-br from-pink-300 via-yellow-200 to-cyan-300 bg-clip-text font-black tracking-[0.08em] text-transparent",
            tx(compact, "text-3xl", "text-6xl"),
          )}
        >
          {brand}
        </p>
      </div>
    </div>
  );
}

function FloxBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", className, forPrint)}>
      <div className="absolute bottom-0 right-0 size-[45%] rounded-full bg-[#39FF14]/25 blur-2xl" />
      <div className={cn("relative z-10 flex flex-1 flex-col justify-between p-[8%] font-mono", tx(compact, "text-[6px]", "text-[9px]"))}>
        <NameTitleBlock data={data} compact={compact} styles={styles} nameClassName="font-bold" />
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

function HelloFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", cn("bg-[#E31B23] text-white", className), forPrint)}>
      <div className="flex flex-1 flex-col p-[8%]">
        <p className={cn("font-bold leading-none", tx(compact, "text-3xl", "text-6xl"))}>Hello.</p>
        <div className="mt-4 flex items-start gap-2">
          <span className={cn("grid place-items-center bg-white text-[#E31B23]", tx(compact, "size-5", "size-7"))}>↗</span>
          <NameTitleBlock data={data} compact={compact} styles={styles} nameClassName="text-white" titleClassName="text-white/80" />
        </div>
      </div>
      <div className={cn("absolute right-[4%] top-1/2 -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] uppercase tracking-[0.18em]", tx(compact, "text-[6px]", "text-[8px]"))}>
        <FieldText data={data} fieldKey="company">{companyWord(data)}</FieldText>
        {isFieldEnabled(data, "location") && data.location ? (
          <FieldText data={data} fieldKey="location" className="mt-2 opacity-80">{data.location}</FieldText>
        ) : null}
      </div>
    </div>
  );
}

function HelloBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", cn("text-[#E31B23]", className), forPrint)}>
      <div className="flex flex-1 flex-col justify-between p-[8%]">
        <div>
          <p className={cn("font-bold leading-none", tx(compact, "text-3xl", "text-6xl"))}>Hi!</p>
          <div className="mt-4 flex items-start gap-2">
            <span className={cn("grid place-items-center bg-[#E31B23] text-white", tx(compact, "size-5", "size-7"))}>↗</span>
            <div className="flex flex-col gap-1">
              <FieldText data={data} fieldKey="company" as="p" className={cn("font-bold leading-tight", tx(compact, "text-[10px]", "text-sm"))}>
                {companyWord(data)}
              </FieldText>
              {isFieldEnabled(data, "tagline") && data.tagline ? (
                <FieldText data={data} fieldKey="tagline" as="p" className={cn("leading-snug", styles.subtext, tx(compact, "text-[7px]", "text-[10px]"))}>
                  {data.tagline}
                </FieldText>
              ) : null}
            </div>
          </div>
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
}

function ReviveFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", cn("bg-[#6B341F] text-white", className), forPrint)}>
      <svg className="absolute left-[8%] top-[10%] h-[34%] w-[28%] opacity-95" viewBox="0 0 80 80" aria-hidden>
        <rect x="8" y="8" width="28" height="28" fill="white" />
        <rect x="24" y="24" width="28" height="28" fill="white" opacity="0.85" />
        <rect x="40" y="8" width="20" height="44" fill="white" opacity="0.65" />
      </svg>
      <div className="absolute bottom-[10%] right-[8%] flex flex-col items-end gap-1 text-right">
        <FieldText data={data} fieldKey="company" as="p" className={cn("font-bold leading-tight", tx(compact, "text-sm", "text-xl"))}>
          {companyWord(data)}
        </FieldText>
        <p className={cn("uppercase leading-snug tracking-[0.28em] opacity-80", tx(compact, "text-[6px]", "text-[8px]"))}>Restoration</p>
      </div>
    </div>
  );
}

function ReviveBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", className, forPrint)}>
      <div className="flex flex-1 flex-col justify-between p-[8%] text-[#6B341F]">
        <div className="flex items-start justify-between gap-3">
          <svg className={cn("shrink-0", tx(compact, "h-8 w-8", "h-12 w-12"))} viewBox="0 0 80 80" aria-hidden>
            <rect x="8" y="8" width="28" height="28" fill="#6B341F" />
            <rect x="24" y="24" width="28" height="28" fill="#6B341F" opacity="0.85" />
          </svg>
          <NameTitleBlock data={data} compact={compact} styles={styles} className="text-right" />
        </div>
        <div className={cn("grid grid-cols-2 gap-3", tx(compact, "text-[6px]", "text-[9px]"))}>
          <div>
            {isFieldEnabled(data, "location") && data.location ? (
              <FieldText data={data} fieldKey="location">{data.location}</FieldText>
            ) : null}
            {isFieldEnabled(data, "website") && data.website ? (
              <FieldText data={data} fieldKey="website">{websiteDisplay(data.website)}</FieldText>
            ) : null}
          </div>
          <div className="text-right">
            {isFieldEnabled(data, "phone") && data.phone ? (
              <FieldText data={data} fieldKey="phone">{data.phone}</FieldText>
            ) : null}
            {isFieldEnabled(data, "email") && data.email ? (
              <FieldText data={data} fieldKey="email">{data.email}</FieldText>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function SouthernFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", cn("bg-[#6B7B5C] text-[#F5F0E6]", className), forPrint)}>
      <div className="absolute inset-0 opacity-40">
        <svg viewBox="0 0 200 120" className="h-full w-full" fill="none" aria-hidden>
          <path d="M0 20 H80 M120 0 V60 M40 100 H160" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>
      <div className="relative z-10 flex flex-1 flex-col justify-end gap-1.5 p-[8%]">
        <FieldText data={data} fieldKey="company" as="p" className={cn("font-bold lowercase leading-tight", tx(compact, "text-sm", "text-xl"))}>
          {companyWord(data).toLowerCase()}
        </FieldText>
        {isFieldEnabled(data, "tagline") && data.tagline ? (
          <FieldText data={data} fieldKey="tagline" as="p" className={cn("uppercase leading-snug tracking-[0.24em]", tx(compact, "text-[6px]", "text-[8px]"))}>
            {data.tagline}
          </FieldText>
        ) : null}
      </div>
    </div>
  );
}

function SouthernBack({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", cn("bg-[#7A3B44] text-[#F5F0E6]", className), forPrint)}>
      <div className="absolute right-0 top-0 h-full w-[28%] bg-[#5E2E35]" />
      <div className="relative z-10 flex flex-1 flex-col justify-between p-[8%] pr-[34%]">
        <NameTitleBlock data={data} compact={compact} styles={styles} nameClassName="font-serif italic" />
        <ContactList data={data} styles={styles} compact={compact} />
      </div>
    </div>
  );
}

function SkildFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", cn("bg-[#111111] text-white", className), forPrint)}>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-[8%] text-center">
        <span className={cn("font-black uppercase tracking-[0.35em]", tx(compact, "text-lg", "text-3xl"))}>
          {companyWord(data).slice(0, 5).toUpperCase()}
        </span>
        <FieldText data={data} fieldKey="tagline" className={cn("uppercase tracking-[0.28em] text-white/60", tx(compact, "text-[6px]", "text-[8px]"))}>
          {isFieldEnabled(data, "tagline") && data.tagline ? data.tagline : "Passionate agency"}
        </FieldText>
      </div>
    </div>
  );
}

function SkildBack({ data, theme, styles, compact, className, interactive, onLinkClick , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", cn("bg-[#F4F4F4] text-black", className), forPrint)}>
      <div className="flex flex-1 flex-col justify-between p-[8%]">
        <NameTitleBlock data={data} compact={compact} styles={styles} nameClassName="uppercase tracking-[0.1em]" />
        <ContactList data={data} styles={styles} compact={compact} interactive={interactive} onLinkClick={onLinkClick} />
      </div>
    </div>
  );
}

function FarmhouseFront({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "front", className, forPrint)}>
      <div className="absolute inset-x-0 top-0 h-[38%] bg-[#2F3E46]" />
      <div className="relative z-10 flex flex-1 flex-col justify-end gap-1.5 p-[8%]">
        <FieldText data={data} fieldKey="company" as="p" className={cn("font-serif italic leading-tight", tx(compact, "text-base", "text-2xl"))}>
          {companyWord(data)}
        </FieldText>
        <FieldText data={data} fieldKey="title" as="p" className={cn("uppercase leading-snug tracking-[0.22em]", styles.subtext, tx(compact, "text-[7px]", "text-[10px]"))}>
          {data.title}
        </FieldText>
      </div>
    </div>
  );
}

function FarmhouseBack({ data, theme, styles, compact, className , forPrint }: StudioProps) {
  return (
    <div className={shell(styles, theme, compact, "back", className, forPrint)}>
      <div className="flex flex-1 flex-col justify-center gap-3 p-[8%]">
        <NameTitleBlock data={data} compact={compact} styles={styles} nameClassName="font-serif" />
        <LabeledContacts data={data} compact={compact} />
      </div>
    </div>
  );
}

const STUDIO_RENDERERS: Record<
  string,
  { front: (props: StudioProps) => ReactNode; back: (props: StudioProps) => ReactNode }
> = {
  "studio-cohub": { front: CohubFront, back: CohubBack },
  "studio-austerlitz": { front: AusterlitzFront, back: AusterlitzBack },
  "studio-rocket": { front: RocketFront, back: RocketBack },
  "studio-bauhaus": { front: BauhausFront, back: BauhausBack },
  "studio-golden-wave": { front: GoldenWaveFront, back: GoldenWaveBack },
  "studio-sarah": { front: SarahFront, back: SarahBack },
  "studio-florence": { front: FlorenceFront, back: FlorenceBack },
  "studio-adventure": { front: AdventureFront, back: AdventureBack },
  "studio-ponto": { front: PontoFront, back: PontoBack },
  "studio-business": { front: BusinessFront, back: BusinessBack },
  "studio-bill": { front: BillFront, back: BillBack },
  "studio-refresh": { front: RefreshFront, back: RefreshBack },
  "studio-flox": { front: FloxFront, back: FloxBack },
  "studio-hello": { front: HelloFront, back: HelloBack },
  "studio-revive": { front: ReviveFront, back: ReviveBack },
  "studio-southern-craft": { front: SouthernFront, back: SouthernBack },
  "studio-skild": { front: SkildFront, back: SkildBack },
  "studio-farmhouse": { front: FarmhouseFront, back: FarmhouseBack },
};

export const STUDIO_LAYOUTS = new Set<CardLayout>(
  Object.keys(STUDIO_RENDERERS) as CardLayout[],
);

export function isStudioLayout(layout: CardLayout): boolean {
  return STUDIO_LAYOUTS.has(layout);
}

export function StudioCardFront(props: StudioProps) {
  const forPrint = useCardPrintExport();
  const renderer = STUDIO_RENDERERS[props.theme.layout]?.front;
  if (!renderer) return null;
  return <>{renderer({ ...props, forPrint })}</>;
}

export function StudioCardBack(props: StudioProps) {
  const forPrint = useCardPrintExport();
  const renderer = STUDIO_RENDERERS[props.theme.layout]?.back;
  if (!renderer) return null;
  return <>{renderer({ ...props, forPrint })}</>;
}
