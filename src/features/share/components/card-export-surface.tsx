"use client";

import { forwardRef } from "react";

import { BusinessCard } from "@/features/builder/components/business-card";
import type { CardData } from "@/lib/card-data";
import type { CardTheme } from "@/lib/card-themes";

/**
 * Full-size, off-screen card render used for high-quality export/print capture.
 * Must not be scaled or clipped — preview scaling lives in CardPreviewScaler.
 */
export const CardExportSurface = forwardRef<
  HTMLDivElement,
  {
    data: CardData;
    theme: CardTheme;
  }
>(function CardExportSurface({ data, theme }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-[-10000px] top-0 z-[-1] opacity-0"
    >
      <BusinessCard
        data={data}
        theme={theme}
        displayMode="pair"
        showSideLabels={false}
      />
    </div>
  );
});
