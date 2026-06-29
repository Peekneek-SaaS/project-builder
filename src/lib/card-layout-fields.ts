import { type CardFieldKey } from "@/lib/card-field-utils";
import type { CardLayout } from "@/lib/card-themes";
import { getTheme } from "@/lib/card-themes";

const BASE_CARD_FIELDS: CardFieldKey[] = [
  "company",
  "name",
  "title",
  "email",
  "phone",
  "location",
  "website",
];

/** Layouts that render CardLogo, CardBrandMark, or logoUrl on at least one side. */
export const LAYOUTS_WITH_LOGO = new Set<CardLayout>([
  // Classic
  "classic",
  "brand-center",
  "brand-bar",
  "split-sidebar",
  "minimal-dark",
  "minimal-hatch",
  "minimal-botanical",
  "minimal-studio",
  "band-header",
  "skyline",
  "watermark",
  "arc-frame",
  "horizontal",
  // Modern
  "mod-rexora",
  "mod-codai",
  "mod-rollux",
  "mod-vitvio",
  "mod-solara",
  "mod-solara-brand",
  "mod-zight",
  "mod-alpha",
  "mod-caleb",
  "mod-southern",
  // Pro
  "mod-slate-wedge",
  "mod-wilson-split",
  "mod-ribbon-noir",
  "mod-crimson-pill",
  "mod-ampere",
  "mod-block-dark",
  // Job
  "job-chevron",
  "job-photo-split",
  "job-zing-brand",
  "job-zing-dark",
  "job-notice",
  "job-arch-split",
  "job-electric-plug",
  "job-electric-service",
  "job-legal",
  "job-rocket-pattern",
  "job-terra",
  "job-restaurant",
  "job-agency",
  // Free
  "free-prism-dark",
]);

export function layoutUsesLogo(layout: CardLayout): boolean {
  return LAYOUTS_WITH_LOGO.has(layout);
}

export function getSupportedFieldsForLayout(
  layout: CardLayout,
): ReadonlySet<CardFieldKey> {
  const fields: CardFieldKey[] = layoutUsesLogo(layout)
    ? ["logo", ...BASE_CARD_FIELDS]
    : [...BASE_CARD_FIELDS];
  return new Set(fields);
}

export function isFieldSupportedByLayout(
  layout: CardLayout,
  field: CardFieldKey,
): boolean {
  return getSupportedFieldsForLayout(layout).has(field);
}

export function isFieldSupportedByTheme(
  themeId: string,
  field: CardFieldKey,
): boolean {
  return isFieldSupportedByLayout(getTheme(themeId).layout, field);
}
