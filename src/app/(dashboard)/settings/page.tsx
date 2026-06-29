"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PricingTable, useClerk, useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { getPlanLabel } from "@/lib/plan";
import { useTRPC } from "@/trpc/client";
import {
  Chart03Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  Delete02Icon,
  Home02Icon,
  Invoice02Icon,
  Loading03Icon,
  MoneyBag02Icon,
  Moon02Icon,
  PlusSignIcon,
  Refresh01Icon,
  Settings01Icon,
  Sun03Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  function scrollToPlans() {
    document.getElementById("pricing-plans")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleManagePlan() {
    if (billing?.isPro) {
      openUserProfile();
      return;
    }
    scrollToPlans();
  }

  return (
    <div className="mx-auto min-w-0 overflow-x-hidden px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, appearance, plan, and workspace shortcuts.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {/* <HugeiconsIcon icon={Moon02Icon} size={18} /> */}
              <HugeiconsIcon
                icon={Sun03Icon}
                className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
              />
              <HugeiconsIcon
                icon={Moon02Icon}
                className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              />
              Appearance
            </CardTitle>
            <CardDescription>
              Choose how Kardably looks on this device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldLabel htmlFor="switch-theme-mode">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Dark mode</FieldTitle>
                    <FieldDescription>
                      {isDark ? "Dark theme enabled" : "Light theme enabled"}
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="switch-theme-mode"
                    checked={isDark}
                    disabled={!mounted}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </Field>
              </FieldLabel>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HugeiconsIcon icon={UserIcon} size={18} />
              Account
            </CardTitle>
            <CardDescription>
              Profile, security, and connected accounts via Clerk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="text-sm font-medium">
                {user?.fullName || user?.username || "Your account"}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress ?? "—"}
              </p>
            </div>
            <Button
              type="button"
              // variant="outline"
              className="w-full gap-2 sm:w-auto"
              onClick={() => openUserProfile()}
            >
              <HugeiconsIcon icon={Settings01Icon} size={16} />
              Manage profile
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HugeiconsIcon icon={CreditCardIcon} size={18} />
              Plan & billing
            </CardTitle>
            <CardDescription>
              View usage, refresh plan status, and manage your subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="rounded-xl border border-border bg-muted/20 p-5">
                <h3 className="text-sm font-semibold">Current plan</h3>
                {isLoading ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Loading plan
                  </p>
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
                        Themes:{" "}
                        {billing?.isPro ? "All themes" : "3 free themes"}
                      </li>
                      <li>
                        Analytics:{" "}
                        {billing?.analyticsEnabled ? "Included" : "Pro only"}
                      </li>
                      <li>
                        Share branding:{" "}
                        {billing?.isPro
                          ? "Removed on embeds"
                          : "Shown on embeds"}
                      </li>
                    </ul>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:min-w-48">
                {/* <Button
                  type="button"
                  className="gap-2"
                  onClick={handleManagePlan}
                >
                  <HugeiconsIcon icon={MoneyBag02Icon} size={16} />
                  {billing?.isPro ? "Manage subscription" : "View plans"}
                </Button> */}
                {billing?.isPro ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => openUserProfile()}
                  >
                    <HugeiconsIcon icon={Invoice02Icon} size={16} />
                    Billing & invoices
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="secondary"
                  className="gap-2"
                  disabled={syncPlan.isPending}
                  onClick={() => syncPlan.mutate()}
                >
                  {syncPlan.isPending ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        className="animate-spin"
                      />
                      Refreshing
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={Refresh01Icon} size={16} />
                      Refresh plan status
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            <div id="pricing-plans" className="scroll-mt-24">
              <h3 className="text-sm font-semibold">Change plan</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upgrade to Pro to publish your card, create unlimited cards,
                access analytics, and remove embed branding.
              </p>
              <div className="mt-4 rounded-xl border border-border bg-card p-4 sm:p-6">
                <PricingTable newSubscriptionRedirectUrl="/dashboard" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HugeiconsIcon icon={DashboardSquare01Icon} size={18} />
              Workspace
            </CardTitle>
            <CardDescription>
              Quick links to the parts of Kardably you use most.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/dashboard">
                  <HugeiconsIcon icon={DashboardSquare01Icon} size={16} />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/create">
                  <HugeiconsIcon icon={PlusSignIcon} size={16} />
                  Create new card
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="justify-start gap-2"
                disabled={!billing?.analyticsEnabled}
              >
                <Link href="/analytics">
                  <HugeiconsIcon icon={Chart03Icon} size={16} />
                  Analytics
                  {!billing?.analyticsEnabled ? " (Pro)" : ""}
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/trash">
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                  Trash
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/">
                  <HugeiconsIcon icon={Home02Icon} size={16} />
                  Marketing site
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
