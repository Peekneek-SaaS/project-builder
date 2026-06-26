"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BusinessCardData } from "./types";

export const CARD_BG_CYCLE_MS = 5000;

export type CardFacePalette = {
  bg: string;
  textClass: string;
};

/** Each step pairs a distinct front and back color. */
export const CARD_FACE_CYCLES: readonly {
  front: CardFacePalette;
  back: CardFacePalette;
}[] = [
  {
    front: { bg: "#FFEF00", textClass: "text-black" },
    back: { bg: "#0040FF", textClass: "text-white" },
  },
  {
    front: { bg: "#84cc16", textClass: "text-black" },
    back: { bg: "#0E5C56", textClass: "text-white" },
  },
  {
    front: { bg: "#F97316", textClass: "text-black" },
    back: { bg: "#1C1A17", textClass: "text-white" },
  },
  {
    front: { bg: "#E879F9", textClass: "text-black" },
    back: { bg: "#0040FF", textClass: "text-white" },
  },
  {
    front: { bg: "#FFEF00", textClass: "text-black" },
    back: { bg: "#84cc16", textClass: "text-black" },
  },
];

function companyWordmark(company: string) {
  const word = company.split(/\s+/)[0] || "Bill";
  return {
    leading: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  };
}

function FrontFace({
  card,
  palette,
}: {
  card: BusinessCardData;
  palette: CardFacePalette;
}) {
  const { leading } = companyWordmark(card.company);

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col overflow-hidden rounded-2xl backface-hidden transition-colors duration-700 ease-in-out",
        palette.textClass,
      )}
      style={{ backgroundColor: palette.bg }}
    >
      <div className="flex flex-1 items-center justify-center p-[6%]">
        <p className="text-4xl font-black leading-none sm:text-5xl">
          {leading}
          <span className="align-baseline">.</span>
        </p>
      </div>
    </div>
  );
}

function BackFace({
  card,
  palette,
}: {
  card: BusinessCardData;
  palette: CardFacePalette;
}) {
  const contacts = [card.email, card.phone, card.website, card.address].filter(
    Boolean,
  );

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl p-[8%] backface-hidden transform-[rotateY(180deg)] transition-colors duration-700 ease-in-out",
        palette.textClass,
      )}
      style={{ backgroundColor: palette.bg }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-start uppercase tracking-[0.12em] text-[7px] sm:text-[8px]">
          <p className="text-lg font-semibold">
            {card.tagline ?? "Home of powerhouses"}
          </p>
          <p className="font-semibold">{card.title}</p>
        </div>
      </div>

      <div className="self-end text-right uppercase tracking-[0.08em] text-[7px] sm:text-[8px]">
        <div className="grid gap-1">
          {contacts.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardFaces({
  card,
  frontPalette,
  backPalette,
}: {
  card: BusinessCardData;
  frontPalette: CardFacePalette;
  backPalette: CardFacePalette;
}) {
  return (
    <>
      <FrontFace card={card} palette={frontPalette} />
      <BackFace card={card} palette={backPalette} />
    </>
  );
}

export function useCyclingCardPalettes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % CARD_FACE_CYCLES.length);
    }, CARD_BG_CYCLE_MS);

    return () => window.clearInterval(id);
  }, []);

  return CARD_FACE_CYCLES[index];
}
