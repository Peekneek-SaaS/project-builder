"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  CardBack,
  CardFront,
  type LinkClickPayload,
} from "@/features/builder/components/card-layouts";
import type { CardData, CardDisplayMode } from "@/lib/card-data";
import type { CardTheme } from "@/lib/card-themes";
import { getThemeStyleClasses } from "@/lib/card-theme-utils";

type CardSide = "front" | "back";

const STACK_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
  mass: 0.85,
};

function layerMotion(side: CardSide, topSide: CardSide) {
  const isTop = topSide === side;

  return {
    x: "-50%",
    y: isTop ? 0 : side === "back" ? -30 : 30,
    scale: isTop ? 1 : 0.975,
    opacity: isTop ? 1 : 0.94,
    zIndex: isTop ? 2 : 1,
  };
}

export function PublicCardStack({
  data,
  theme,
  displayMode,
  interactive,
  onLinkClick,
}: {
  data: CardData;
  theme: CardTheme;
  displayMode: CardDisplayMode;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
}) {
  const styles = getThemeStyleClasses(theme.id);

  if (displayMode === "front") {
    return (
      <div className="flex justify-center">
        <CardFront data={data} theme={theme} styles={styles} />
      </div>
    );
  }

  if (displayMode === "back") {
    return (
      <div className="flex justify-center">
        <CardBack
          data={data}
          theme={theme}
          styles={styles}
          interactive={interactive}
          onLinkClick={onLinkClick}
        />
      </div>
    );
  }

  return (
    <CardPairStack
      data={data}
      theme={theme}
      styles={styles}
      interactive={interactive}
      onLinkClick={onLinkClick}
    />
  );
}

function CardPairStack({
  data,
  theme,
  styles,
  interactive,
  onLinkClick,
}: {
  data: CardData;
  theme: CardTheme;
  styles: ReturnType<typeof getThemeStyleClasses>;
  interactive?: boolean;
  onLinkClick?: (payload: LinkClickPayload) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeSide, setActiveSide] = useState<CardSide>("front");
  const [hoveredSide, setHoveredSide] = useState<CardSide | null>(null);

  const topSide = hoveredSide ?? activeSide;
  const transition = prefersReducedMotion ? { duration: 0 } : STACK_SPRING;

  function bringToFront(side: CardSide) {
    setActiveSide(side);
    setHoveredSide(null);
  }

  return (
    <div
      className="relative mx-auto w-fit"
      onMouseLeave={() => setHoveredSide(null)}
    >
      <div className="relative pt-8 pb-2 [perspective:1400px]">
        {/* Invisible spacer — sets stack height */}
        <div className="invisible pointer-events-none" aria-hidden>
          <CardFront data={data} theme={theme} styles={styles} />
        </div>

        <div className="absolute inset-x-0 top-8 bottom-0 [transform-style:preserve-3d]">
          {/* Back */}
          <motion.div
            className="absolute left-1/2 w-fit cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/80 focus-visible:ring-offset-2"
            initial={false}
            animate={layerMotion("back", topSide)}
            transition={transition}
            style={{ transformOrigin: "center center" }}
            onMouseEnter={() => setHoveredSide("back")}
            onClick={() => bringToFront("back")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                bringToFront("back");
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Show back of card"
            aria-pressed={activeSide === "back"}
          >
            <CardBack
              data={data}
              theme={theme}
              styles={styles}
              interactive={interactive && topSide === "back"}
              onLinkClick={onLinkClick}
            />
          </motion.div>

          {/* Front */}
          <motion.div
            className="absolute left-1/2 w-fit cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/80 focus-visible:ring-offset-2"
            initial={false}
            animate={layerMotion("front", topSide)}
            transition={transition}
            style={{ transformOrigin: "center center" }}
            onMouseEnter={() => setHoveredSide("front")}
            onClick={() => bringToFront("front")}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                bringToFront("front");
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Show front of card"
            aria-pressed={activeSide === "front"}
          >
            <CardFront data={data} theme={theme} styles={styles} />
          </motion.div>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-neutral-400">
        Hover to pull the back out and Tap to lock
      </p>
    </div>
  );
}
