import { cardThemes, type CardTheme } from "@/lib/card-themes";

export const PLAN_IDS = ["free", "pro"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export const PRO_PLAN_SLUG =
  process.env.NEXT_PUBLIC_CLERK_PRO_PLAN_SLUG ?? "pro_user";
export const FREE_PLAN_SLUG =
  process.env.NEXT_PUBLIC_CLERK_FREE_PLAN_SLUG ?? "free_user";

export const PLAN_LIMITS = {
  free: {
    maxCards: 1,
    maxThemesPerBatch: 1,
    analytics: false,
  },
  pro: {
    maxCards: Number.POSITIVE_INFINITY,
    maxThemesPerBatch: Number.POSITIVE_INFINITY,
    analytics: true,
  },
} as const;

export type PlanLimits = (typeof PLAN_LIMITS)[PlanId];

export function isPlanId(value: string): value is PlanId {
  return PLAN_IDS.includes(value as PlanId);
}

export function isProPlan(plan: PlanId): boolean {
  return plan === "pro";
}

export function getFreeThemes(themes: CardTheme[] = cardThemes): CardTheme[] {
  return themes.filter((theme) => !theme.pro);
}

export function getFreeThemeIds(themes: CardTheme[] = cardThemes): string[] {
  return getFreeThemes(themes).map((theme) => theme.id);
}

export function canUseTheme(_plan: PlanId, _themeId: string): boolean {
  return true;
}

export function canPublish(plan: PlanId): boolean {
  return isProPlan(plan);
}

export function canAccessAnalytics(plan: PlanId): boolean {
  return PLAN_LIMITS[plan].analytics;
}

export function getPlanLabel(plan: PlanId): string {
  return plan === "pro" ? "Pro" : "Free";
}
