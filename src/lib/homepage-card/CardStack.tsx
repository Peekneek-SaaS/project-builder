"use client";

import { useState } from "react";
import { BusinessCardData } from "./types";
import { CardFaces, useCyclingCardPalettes } from "./BusinessCardFaces";

type Mode = "lift" | "flip" | "lift-flip";

interface CardStackProps {
  cards: BusinessCardData[];
  mode?: Mode;
}

const TILT_DEG = [-8, 8, -6, 18];
const OFFSET_X = [-46, 46, -90, 90];
const OFFSET_Y = [-70, 70, 30, -26];

function getRotateY(
  side: BusinessCardData["side"],
  shouldFlip: boolean,
): number {
  const base = side === "back" ? 180 : 0;
  return base + (shouldFlip ? 180 : 0);
}

export default function CardStack({ cards, mode = "lift" }: CardStackProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const facePalettes = useCyclingCardPalettes();

  return (
    <div className="relative mx-auto h-[260px] w-full max-w-[420px] [perspective:1600px] sm:h-[300px] sm:max-w-[480px]">
      {cards.map((card, i) => {
        const isHovered = hovered === card.id;
        const tilt = TILT_DEG[i % TILT_DEG.length];
        const offsetX = OFFSET_X[i % OFFSET_X.length];
        const offsetY = OFFSET_Y[i % OFFSET_Y.length];

        const shouldFlip = (mode === "flip" || mode === "lift-flip") && isHovered;
        const shouldLift = (mode === "lift" || mode === "lift-flip") && isHovered;
        const rotateY = getRotateY(card.side, shouldFlip);

        return (
          <button
            key={card.id}
            type="button"
            aria-label={`${card.name}, ${card.title} at ${card.company}`}
            onMouseEnter={() => setHovered(card.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(card.id)}
            onBlur={() => setHovered(null)}
            className="absolute left-1/2 top-1/2 h-[180px] w-[300px] cursor-pointer rounded-2xl text-left shadow-[0_1px_3px_rgba(0,0,0,0.18)] outline-none transition-[transform,box-shadow] duration-500 [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-offset-2 sm:h-[200px] sm:w-[340px]"
            style={{
              transform: shouldLift
                ? `translate(-50%, -50%) translate(${offsetX * 0.3}px, ${offsetY * 0.3 - 18}px) rotate(0deg) scale(1.2) rotateY(${rotateY}deg)`
                : `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) rotate(${tilt}deg) rotateY(${rotateY}deg)`,
              zIndex: isHovered ? 50 : i,
              boxShadow: isHovered
                ? "0 24px 48px -16px rgba(0,0,0,0.4)"
                : "0 1px 3px rgba(0,0,0,0.18)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <CardFaces
              card={card}
              frontPalette={facePalettes.front}
              backPalette={facePalettes.back}
            />
          </button>
        );
      })}
    </div>
  );
}