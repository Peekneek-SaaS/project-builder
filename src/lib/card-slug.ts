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
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;

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

export function buildEmbedIframeCode(slug: string, title: string): string {
  const src = getEmbedCardUrl(slug);
  const safeTitle = title.replace(/"/g, "&quot;");

  return `<iframe
  src="${src}"
  title="${safeTitle} — Digital business card"
  width="100%"
  height="560"
  style="border:0;border-radius:12px;max-width:960px;min-height:480px;"
  loading="lazy"
></iframe>`;
}
