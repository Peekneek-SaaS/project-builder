import "server-only";

import { auth } from "@clerk/nextjs/server";

import {
  canUseTheme,
  FREE_PLAN_SLUG,
  isPlanId,
  isProPlan,
  PLAN_LIMITS,
  PRO_PLAN_SLUG,
  type PlanId,
} from "@/lib/plan";
import { prisma } from "@/lib/db";

export type BillingProfile = {
  plan: PlanId;
  isPro: boolean;
  limits: (typeof PLAN_LIMITS)[PlanId];
  usage: {
    cards: number;
  };
  canCreateCard: boolean;
  cardsRemaining: number | null;
  analyticsEnabled: boolean;
  planRenewsAt: string | null;
};

function resolveDevPlanOverride(): PlanId | null {
  const value = process.env.BILLING_DEV_PLAN?.trim().toLowerCase();
  if (!value) return null;
  if (value === "pro") return "pro";
  if (value === "free") return "free";
  return null;
}

async function resolvePlanFromClerk(): Promise<PlanId | null> {
  try {
    const authState = await auth();
    if (typeof authState.has !== "function") {
      return null;
    }

    if (authState.has({ plan: PRO_PLAN_SLUG })) {
      return "pro";
    }

    if (authState.has({ plan: FREE_PLAN_SLUG })) {
      return "free";
    }
  } catch {
    return null;
  }

  return null;
}

function userBillingTableReady() {
  return typeof prisma.user?.upsert === "function";
}

function buildBillingProfile(
  plan: PlanId,
  cardCount: number,
  planRenewsAt: Date | null = null,
): BillingProfile {
  const limits = PLAN_LIMITS[plan];
  const isPro = isProPlan(plan);
  const cardsRemaining = isPro
    ? null
    : Math.max(0, limits.maxCards - cardCount);

  return {
    plan,
    isPro,
    limits,
    usage: { cards: cardCount },
    canCreateCard: isPro || cardCount < limits.maxCards,
    cardsRemaining,
    analyticsEnabled: limits.analytics,
    planRenewsAt: planRenewsAt?.toISOString() ?? null,
  };
}

async function countActiveCards(clerkId: string) {
  return prisma.card.count({
    where: { userId: clerkId, deletedAt: null },
  });
}

async function resolveStoredBilling(clerkId: string): Promise<{
  plan: PlanId;
  planExpiresAt: Date | null;
} | null> {
  if (!userBillingTableReady()) return null;

  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      create: { clerkId, plan: "free" },
      update: {},
    });
    return {
      plan: isPlanId(user.plan) ? user.plan : "free",
      planExpiresAt: user.planExpiresAt,
    };
  } catch {
    return null;
  }
}

export async function setUserPlan(
  clerkId: string,
  plan: PlanId,
  data?: {
    clerkSubscriptionId?: string | null;
    clerkSubscriptionStatus?: string | null;
    planExpiresAt?: Date | null;
  },
) {
  if (!userBillingTableReady()) return;

  try {
    await prisma.user.upsert({
      where: { clerkId },
      create: {
        clerkId,
        plan,
        clerkSubscriptionId: data?.clerkSubscriptionId ?? null,
        clerkSubscriptionStatus: data?.clerkSubscriptionStatus ?? null,
        planExpiresAt: data?.planExpiresAt ?? null,
      },
      update: {
        plan,
        ...(data?.clerkSubscriptionId !== undefined
          ? { clerkSubscriptionId: data.clerkSubscriptionId }
          : {}),
        ...(data?.clerkSubscriptionStatus !== undefined
          ? { clerkSubscriptionStatus: data.clerkSubscriptionStatus }
          : {}),
        ...(data?.planExpiresAt !== undefined
          ? { planExpiresAt: data.planExpiresAt }
          : {}),
      },
    });
  } catch {
    // User billing table may not be migrated yet.
  }
}

export async function syncBillingPlanFromClerk(clerkId: string): Promise<PlanId> {
  const clerkPlan = await resolvePlanFromClerk();
  if (clerkPlan) {
    await setUserPlan(clerkId, clerkPlan);
    return clerkPlan;
  }

  const storedBilling = await resolveStoredBilling(clerkId);
  return storedBilling?.plan ?? "free";
}

export async function getBillingProfile(clerkId: string): Promise<BillingProfile> {
  const devOverride = resolveDevPlanOverride();
  const clerkPlan = devOverride ? null : await resolvePlanFromClerk();
  const storedBilling = devOverride ? null : await resolveStoredBilling(clerkId);
  const storedPlan = storedBilling?.plan ?? null;
  const plan = devOverride ?? clerkPlan ?? storedPlan ?? "free";

  if (!devOverride && clerkPlan && clerkPlan !== storedPlan) {
    await setUserPlan(clerkId, clerkPlan);
  }

  const cardCount = await countActiveCards(clerkId);
  return buildBillingProfile(
    plan,
    cardCount,
    storedBilling?.planExpiresAt ?? null,
  );
}

export async function assertCanCreateCards(
  clerkId: string,
  themeIds: string[],
) {
  const billing = await getBillingProfile(clerkId);

  if (themeIds.length === 0) {
    throw new Error("Select at least one theme.");
  }

  for (const themeId of themeIds) {
    if (!canUseTheme(billing.plan, themeId)) {
      throw new Error("Upgrade to Pro to use this theme.");
    }
  }

  if (billing.isPro) {
    return billing;
  }

  if (!billing.canCreateCard) {
    throw new Error(
      "Free plan includes 1 business card. Upgrade to Pro for unlimited cards.",
    );
  }

  if (themeIds.length > billing.limits.maxThemesPerBatch) {
    throw new Error("Free plan includes 1 theme per card. Upgrade to Pro.");
  }

  const cardsToCreate = themeIds.length;
  if (billing.usage.cards + cardsToCreate > billing.limits.maxCards) {
    throw new Error(
      "Free plan includes 1 business card. Upgrade to Pro for unlimited cards.",
    );
  }

  return billing;
}

export async function assertCanUseTheme(clerkId: string, themeId: string) {
  const billing = await getBillingProfile(clerkId);

  if (!canUseTheme(billing.plan, themeId)) {
    throw new Error("Upgrade to Pro to use this theme.");
  }

  return billing;
}

export async function assertCanAccessAnalytics(clerkId: string) {
  const billing = await getBillingProfile(clerkId);

  if (!billing.analyticsEnabled) {
    throw new Error("Upgrade to Pro to access analytics.");
  }

  return billing;
}
