import { toPng, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";

export type CardExportSides = {
  front: boolean;
  back: boolean;
};

export type CardDownloadFormat = "png" | "pdf" | "svg";

export const CARD_EXPORT_ATTR = "data-card-export";

const EXPORT_PIXEL_RATIO = 4;

const exportOptions = {
  cacheBust: true,
  pixelRatio: EXPORT_PIXEL_RATIO,
} as const;

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

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to prepare image for export."));
    image.src = dataUrl;
  });
}

function filenameForSide(base: string, side: "front" | "back", multiple: boolean) {
  const safe = sanitizeFilename(base);
  return multiple ? `${safe}-${side}` : safe;
}

async function renderPng(element: HTMLElement) {
  return toPng(element, exportOptions);
}

async function renderSvg(element: HTMLElement) {
  return toSvg(element, exportOptions);
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
) {
  if (targets.length === 0) return;

  let pdf: jsPDF | null = null;

  for (const { element } of targets) {
    const dataUrl = await renderPng(element);
    const image = await loadImage(dataUrl);
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const orientation = width >= height ? "landscape" : "portrait";

    if (!pdf) {
      pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [width, height],
        compress: true,
      });
    } else {
      pdf.addPage([width, height], orientation);
    }

    pdf.addImage(dataUrl, "PNG", 0, 0, width, height, undefined, "FAST");
  }

  if (!pdf) {
    throw new Error("Failed to create PDF.");
  }

  pdf.save(`${sanitizeFilename(filenameBase)}.pdf`);
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
      await downloadCardAsPdf(targets, filenameBase);
      break;
  }
}
