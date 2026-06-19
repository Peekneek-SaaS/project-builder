import { NextResponse } from "next/server";

import { FREE_PLAN_SLUG, isPlanId, PRO_PLAN_SLUG, type PlanId } from "@/lib/plan";
import { setUserPlan } from "@/lib/billing";

type ClerkWebhookEvent = {
  type: string;
  data: {
    id?: string;
    user_id?: string;
    payer?: { user_id?: string };
    status?: string;
    items?: Array<{ plan?: { slug?: string } }>;
  };
};

function getClerkUserId(event: ClerkWebhookEvent): string | null {
  return (
    event.data.user_id ??
    event.data.payer?.user_id ??
    null
  );
}

function resolvePlanFromEvent(event: ClerkWebhookEvent): PlanId | null {
  if (
    event.type === "subscription.pastDue" ||
    event.type === "subscription.cancelled" ||
    event.type === "subscription.expired"
  ) {
    return "free";
  }

  if (
    event.type === "subscription.active" ||
    event.type === "subscription.updated" ||
    event.type === "subscriptionItem.active"
  ) {
    const slug = event.data.items?.[0]?.plan?.slug;
    if (slug === PRO_PLAN_SLUG) return "pro";
    if (slug === FREE_PLAN_SLUG) return "free";
    if (event.data.status === "active" && slug !== FREE_PLAN_SLUG) {
      return "pro";
    }
  }

  return null;
}

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET is not configured." },
      { status: 501 },
    );
  }

  let event: ClerkWebhookEvent;
  try {
    event = (await request.json()) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const clerkUserId = getClerkUserId(event);
  const plan = resolvePlanFromEvent(event);

  if (!clerkUserId || !plan || !isPlanId(plan)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  await setUserPlan(clerkUserId, plan, {
    clerkSubscriptionId: event.data.id ?? null,
    clerkSubscriptionStatus: event.data.status ?? null,
  });

  return NextResponse.json({ ok: true, plan });
}
