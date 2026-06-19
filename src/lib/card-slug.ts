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

export function getPublicCardUrl(slug: string): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return `${origin}/c/${slug}`;
}
