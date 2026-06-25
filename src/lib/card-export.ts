import { toPng, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";

export type CardExportSides = {
  front: boolean;
  back: boolean;
};

export type CardDownloadFormat = "png" | "pdf" | "svg";

export type CardOrientation = "landscape" | "portrait";

export type CardDownloadOptions = {
  orientation?: CardOrientation;
};

export const CARD_EXPORT_ATTR = "data-card-export";

/** Standard US business card size (3.5" × 2"). */
export const PRINT_CARD_SIZE_MM = {
  landscape: { width: 88.9, height: 50.8 },
  portrait: { width: 50.8, height: 88.9 },
} as const;

/** 6× capture ≈ 300+ DPI for typical card layouts. */
const EXPORT_PIXEL_RATIO = 6;

function triggerDownload(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

function sanitizeFilename(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "business-card";
}

function filenameForSide(base: string, side: "front" | "back", multiple: boolean) {
  const safe = sanitizeFilename(base);
  return multiple ? `${safe}-${side}` : safe;
}

function pngOptions() {
  return {
    cacheBust: true,
    pixelRatio: EXPORT_PIXEL_RATIO,
  } as const;
}

function svgOptions() {
  return {
    cacheBust: true,
    pixelRatio: EXPORT_PIXEL_RATIO,
  } as const;
}

async function renderPng(element: HTMLElement) {
  return toPng(element, pngOptions());
}

async function renderSvg(element: HTMLElement) {
  return toSvg(element, svgOptions());
}

function pageSizeMm(orientation: CardOrientation) {
  return PRINT_CARD_SIZE_MM[orientation];
}

export async function downloadCardAsPng(
  targets: { element: HTMLElement; side: "front" | "back" }[],
  filenameBase: string,
) {
  const multiple = targets.length > 1;

  for (const { element, side } of targets) {
    const dataUrl = await renderPng(element);
    const name = filenameForSide(filenameBase, side, multiple);
    triggerDownload(dataUrl, `${name}.png`);
  }
}

export async function downloadCardAsSvg(
  targets: { element: HTMLElement; side: "front" | "back" }[],
  filenameBase: string,
) {
  const multiple = targets.length > 1;

  for (const { element, side } of targets) {
    const dataUrl = await renderSvg(element);
    const name = filenameForSide(filenameBase, side, multiple);
    triggerDownload(dataUrl, `${name}.svg`);
  }
}

export async function downloadCardAsPdf(
  targets: { element: HTMLElement; side: "front" | "back" }[],
  filenameBase: string,
  options: CardDownloadOptions = {},
) {
  if (targets.length === 0) return;

  const orientation = options.orientation ?? "landscape";
  const { width: widthMm, height: heightMm } = pageSizeMm(orientation);

  const rendered = await Promise.all(
    targets.map(async ({ element, side }) => {
      const dataUrl = await renderPng(element);
      return { dataUrl, side };
    }),
  );

  const pdf = new jsPDF({
    orientation: widthMm >= heightMm ? "landscape" : "portrait",
    unit: "mm",
    format: [widthMm, heightMm],
    compress: true,
  });

  rendered.forEach(({ dataUrl }, index) => {
    if (index > 0) {
      pdf.addPage([widthMm, heightMm], widthMm >= heightMm ? "landscape" : "portrait");
    }

    pdf.addImage(dataUrl, "PNG", 0, 0, widthMm, heightMm, undefined, "SLOW");
  });

  pdf.save(`${sanitizeFilename(filenameBase)}-print.pdf`);
}

export function resolveExportTargets(
  root: HTMLElement,
  sides: CardExportSides,
): { element: HTMLElement; side: "front" | "back" }[] {
  const items: { element: HTMLElement; side: "front" | "back" }[] = [];

  if (sides.front) {
    const front = root.querySelector<HTMLElement>(`[${CARD_EXPORT_ATTR}="front"]`);
    if (front) items.push({ element: front, side: "front" });
  }

  if (sides.back) {
    const back = root.querySelector<HTMLElement>(`[${CARD_EXPORT_ATTR}="back"]`);
    if (back) items.push({ element: back, side: "back" });
  }

  return items;
}

export async function downloadCard(
  root: HTMLElement,
  format: CardDownloadFormat,
  filenameBase: string,
  sides: CardExportSides,
  options: CardDownloadOptions = {},
) {
  const targets = resolveExportTargets(root, sides);

  if (targets.length === 0) {
    throw new Error("Select at least one card side to download.");
  }

  switch (format) {
    case "png":
      await downloadCardAsPng(targets, filenameBase);
      break;
    case "svg":
      await downloadCardAsSvg(targets, filenameBase);
      break;
    case "pdf":
      await downloadCardAsPdf(targets, filenameBase, options);
      break;
  }
}
