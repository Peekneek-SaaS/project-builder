import { verifyWebhook, type WebhookEvent } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

import { setUserPlan } from "@/lib/billing";
import {
  FREE_PLAN_SLUG,
  isPlanId,
  PRO_PLAN_SLUG,
  type PlanId,
} from "@/lib/plan";

type BillingWebhookData = {
  id?: string;
  status?: string;
  payer?: { user_id?: string };
  user_id?: string;
  period_end?: number | null;
  plan?: { slug?: string } | null;
  items?: Array<{
    plan?: { slug?: string } | null;
    status?: string;
    period_end?: number | null;
  }>;
};

function getWebhookSigningSecret() {
  return (
    process.env.CLERK_WEBHOOK_SIGNING_SECRET ??
    process.env.CLERK_WEBHOOK_SECRET
  );
}

function getClerkUserId(event: WebhookEvent): string | null {
  if (event.type === "user.created" || event.type === "user.updated") {
    return event.data.id ?? null;
  }

  const data = event.data as BillingWebhookData;
  return data.payer?.user_id ?? data.user_id ?? null;
}

function resolvePlanFromSlug(
  slug: string | undefined | null,
  status?: string,
): PlanId | null {
  if (slug === PRO_PLAN_SLUG) return "pro";
  if (slug === FREE_PLAN_SLUG) return "free";
  if (status === "active" && slug && slug !== FREE_PLAN_SLUG) return "pro";
  return null;
}

function isFreeBillingStatus(status: string | undefined): boolean {
  return (
    status === "past_due" ||
    status === "canceled" ||
    status === "cancelled" ||
    status === "ended" ||
    status === "expired" ||
    status === "abandoned"
  );
}

function resolvePlanFromEvent(event: WebhookEvent): PlanId | null {
  const type = event.type;
  const data = event.data as BillingWebhookData;

  if (
    type === "subscription.pastDue" ||
    type === "subscriptionItem.canceled" ||
    type === "subscriptionItem.ended" ||
    type === "subscriptionItem.abandoned" ||
    type === "subscriptionItem.pastDue"
  ) {
    return "free";
  }

  if (isFreeBillingStatus(data.status)) {
    return "free";
  }

  if (
    type === "subscription.active" ||
    type === "subscription.created" ||
    type === "subscription.updated" ||
    type === "subscriptionItem.active" ||
    type === "subscriptionItem.created" ||
    type === "subscriptionItem.updated"
  ) {
    const subscriptionSlug = data.items?.[0]?.plan?.slug;
    const fromSubscription = resolvePlanFromSlug(subscriptionSlug, data.status);
    if (fromSubscription) return fromSubscription;

    const itemSlug = data.plan?.slug;
    return resolvePlanFromSlug(itemSlug, data.status);
  }

  return null;
}

function getPlanRenewalDate(data: BillingWebhookData): Date | null {
  const raw = data.period_end ?? data.items?.[0]?.period_end;
  if (raw == null) return null;
  return new Date(raw > 1e12 ? raw : raw * 1000);
}

function getSubscriptionMetadata(event: WebhookEvent) {
  const data = event.data as BillingWebhookData;
  const planExpiresAt = getPlanRenewalDate(data);

  return {
    clerkSubscriptionId: data.id ?? null,
    clerkSubscriptionStatus: data.status ?? null,
    ...(planExpiresAt ? { planExpiresAt } : {}),
  };
}

export async function POST(request: NextRequest) {
  const signingSecret = getWebhookSigningSecret();
  if (!signingSecret) {
    return NextResponse.json(
      {
        error:
          "CLERK_WEBHOOK_SIGNING_SECRET (or CLERK_WEBHOOK_SECRET) is not configured.",
      },
      { status: 501 },
    );
  }

  let event: WebhookEvent;
  try {
    event = await verifyWebhook(request, { signingSecret });
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return NextResponse.json(
      { error: "Webhook verification failed." },
      { status: 400 },
    );
  }

  if (event.type === "user.created") {
    const clerkUserId = event.data.id;
    if (clerkUserId) {
      await setUserPlan(clerkUserId, "free");
    }

    return NextResponse.json({ ok: true, type: event.type, plan: "free" });
  }

  const clerkUserId = getClerkUserId(event);
  const plan = resolvePlanFromEvent(event);

  if (!clerkUserId || !plan || !isPlanId(plan)) {
    return NextResponse.json({ ok: true, ignored: true, type: event.type });
  }

  await setUserPlan(clerkUserId, plan, getSubscriptionMetadata(event));

  return NextResponse.json({ ok: true, type: event.type, plan });
}
