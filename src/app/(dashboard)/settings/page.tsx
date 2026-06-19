"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PricingTable } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { getPlanLabel } from "@/lib/plan";
import { useTRPC } from "@/trpc/client";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function SettingsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: billing, isLoading } = useQuery(
    trpc.billing.getPlan.queryOptions(),
  );

  const syncPlan = useMutation(
    trpc.billing.syncPlan.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(trpc.billing.getPlan.queryFilter());
      },
    }),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your plan and billing.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold">Current plan</h2>
          {isLoading ? (
            <p className="mt-3 text-sm text-muted-foreground">Loading plan…</p>
          ) : (
            <>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                {getPlanLabel(billing?.plan ?? "free")}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  Cards:{" "}
                  {billing?.isPro
                    ? `${billing.usage.cards} (unlimited)`
                    : `${billing?.usage.cards ?? 0} / 1`}
                </li>
                <li>
                  Themes: {billing?.isPro ? "All themes" : "3 free themes"}
                </li>
                <li>
                  Analytics:{" "}
                  {billing?.analyticsEnabled ? "Included" : "Pro only"}
                </li>
              </ul>
              {!billing?.isPro ? (
                <Button asChild className="mt-5">
                  <Link href="/#pricing">Upgrade to Pro</Link>
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                className="mt-3 gap-2"
                disabled={syncPlan.isPending}
                onClick={() => syncPlan.mutate()}
              >
                {syncPlan.isPending ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="animate-spin"
                    />
                    Refreshing plan…
                  </>
                ) : (
                  "Refresh plan status"
                )}
              </Button>
            </>
          )}
        </div>

        <div className="relative rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold">Change plan</h2>
          <PricingTable />
        </div>
      </div>
    </div>
  );
}
