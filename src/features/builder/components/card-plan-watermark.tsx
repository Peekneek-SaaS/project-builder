"use client";

import { Caveat } from "next/font/google";

import { CARD_EXPORT_ATTR } from "@/lib/card-export";
import type { CardTheme } from "@/lib/card-themes";
import { getWatermarkIsLight } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

const caveat = Caveat({
  subsets: ["latin"],
  weight: "500",
});

const WATERMARK_LABEL = "Made with Kardably";

export function CardPlanWatermark({ isLight }: { isLight: boolean }) {
  const tone = isLight ? "text-black/40" : "text-white/45";
  const edgeInset = "max(0.35rem,2.8cqw)";
  const labelClass = cn(
    caveat.className,
    "whitespace-nowrap text-[clamp(0.5rem,4.2cqw,0.8125rem)] leading-none [writing-mode:vertical-rl] opacity-40",
    isLight
      ? "[text-shadow:0_0_8px_rgba(255,255,255,0.35)]"
      : "[text-shadow:0_0_8px_rgba(0,0,0,0.35)]",
    tone,
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-[inherit]"
      aria-hidden
    >
      <div
        className="absolute inset-y-0 left-0 flex items-center justify-center"
        style={{ width: edgeInset }}
      >
        <span className={cn(labelClass, "rotate-180")}>{WATERMARK_LABEL}</span>
      </div>
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center"
        style={{ width: edgeInset }}
      >
        <span className={labelClass}>{WATERMARK_LABEL}</span>
      </div>
    </div>
  );
}

export function CardSideFrame({
  side,
  showWatermark,
  theme,
  style,
  children,
}: {
  side: "front" | "back";
  showWatermark?: boolean;
  theme: CardTheme;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const isLight = getWatermarkIsLight(theme, side);

  return (
    <div
      className="relative w-fit max-w-full"
      style={style}
      {...{ [CARD_EXPORT_ATTR]: side }}
    >
      {children}
      {showWatermark ? <CardPlanWatermark isLight={isLight} /> : null}
    </div>
  );
}
