export function slugifyCardName(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "card";
}

export function generateCardSlug(name: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slugifyCardName(name)}-${suffix}`;
}

/** Permanent QR identifier — assigned once per card and never changed. */
export function generateQrCodeId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

export function appOrigin() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function getPublicCardUrl(slug: string, utmSource?: string): string {
  const url = new URL(`${appOrigin()}/c/${slug}`);
  if (utmSource) {
    url.searchParams.set("utm_source", utmSource);
  }
  return url.toString();
}

export function getTrackableShareUrl(slug: string): string {
  return getPublicCardUrl(slug, "link");
}

export function getQrCardUrl(qrCodeId: string): string {
  return `${appOrigin()}/q/${qrCodeId}`;
}

export function getEmbedCardUrl(slug: string): string {
  return `${appOrigin()}/embed/${slug}`;
}

export type EmbedCodeFormat = "html" | "react" | "vue";

export const EMBED_CODE_FORMAT_LABELS: Record<EmbedCodeFormat, string> = {
  html: "HTML",
  react: "React / JSX",
  vue: "Vue",
};

function embedTitle(title: string) {
  return `${title} — Digital business card`;
}

/** HTML embed — `style` is a string attribute (valid in plain HTML only). */
export function buildEmbedHtmlCode(slug: string, title: string): string {
  const src = getEmbedCardUrl(slug);
  const safeTitle = embedTitle(title).replace(/"/g, "&quot;");

  return `<iframe
  src="${src}"
  title="${safeTitle}"
  width="100%"
  height="560"
  style="border:0;border-radius:12px;max-width:960px;min-height:480px;"
  loading="lazy"
></iframe>`;
}

/** React / Next.js — `style` must be an object in JSX. */
export function buildEmbedReactCode(slug: string, title: string): string {
  const src = getEmbedCardUrl(slug);
  const safeTitle = embedTitle(title).replace(/"/g, '\\"');

  return `<iframe
  src="${src}"
  title="${safeTitle}"
  width="100%"
  height={560}
  loading="lazy"
  style={{
    border: 0,
    borderRadius: "12px",
    maxWidth: "960px",
    minHeight: "480px",
  }}
/>`;
}

/** Vue SFC template — string `style` is fine in Vue templates. */
export function buildEmbedVueCode(slug: string, title: string): string {
  const src = getEmbedCardUrl(slug);
  const safeTitle = embedTitle(title).replace(/"/g, "&quot;");

  return `<iframe
  src="${src}"
  title="${safeTitle}"
  width="100%"
  height="560"
  loading="lazy"
  style="border:0;border-radius:12px;max-width:960px;min-height:480px;"
/>`;
}

export function buildEmbedIframeCode(
  slug: string,
  title: string,
  format: EmbedCodeFormat = "html",
): string {
  switch (format) {
    case "react":
      return buildEmbedReactCode(slug, title);
    case "vue":
      return buildEmbedVueCode(slug, title);
    default:
      return buildEmbedHtmlCode(slug, title);
  }
}
