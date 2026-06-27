"use client";

import { forwardRef } from "react";

import { BusinessCard } from "@/features/builder/components/business-card";
import { CardPrintExportProvider } from "@/features/builder/components/card-print-export-context";
import type { CardData } from "@/lib/card-data";
import type { CardTheme } from "@/lib/card-themes";

export const CardExportSurface = forwardRef<
  HTMLDivElement,
  {
    data: CardData;
    theme: CardTheme;
    roundedCorners?: boolean;
  }
>(function CardExportSurface({ data, theme, roundedCorners = false }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-[-10000px] top-0 z-[-1] opacity-0"
    >
      <CardPrintExportProvider roundedCorners={roundedCorners}>
        <BusinessCard
          data={data}
          theme={theme}
          displayMode="pair"
          showSideLabels={false}
        />
      </CardPrintExportProvider>
    </div>
  );
});
