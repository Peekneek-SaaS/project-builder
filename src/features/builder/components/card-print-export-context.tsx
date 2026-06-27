"use client";

import { createContext, useContext, type ReactNode } from "react";

type CardPrintExportOptions = {
  /** When true, export uses rounded corners like the on-screen preview. */
  roundedCorners: boolean;
};

const CardPrintExportContext = createContext<CardPrintExportOptions | null>(
  null,
);

export function CardPrintExportProvider({
  roundedCorners,
  children,
}: {
  roundedCorners: boolean;
  children: ReactNode;
}) {
  return (
    <CardPrintExportContext.Provider value={{ roundedCorners }}>
      {children}
    </CardPrintExportContext.Provider>
  );
}

/** True when export should use square corners (no border-radius). */
export function useCardPrintExport() {
  const options = useContext(CardPrintExportContext);
  if (!options) return false;
  return !options.roundedCorners;
}
