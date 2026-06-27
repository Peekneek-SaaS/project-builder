import React, { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardCardSearch } from "@/features/dashboard/components/dashboard-card-search";
import { BillingSync } from "@/features/dashboard/components/billing-sync";
import { DashboardSearchProvider } from "@/features/dashboard/context/dashboard-search-context";
import { PageEnter } from "@/components/motion";
import { UserButton } from "@clerk/nextjs";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import Logo from "../../../public/Logo/Logo";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ModeToggle } from "@/components/mode-toggle";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  prefetch(trpc.card.list.queryOptions());
  prefetch(trpc.card.listTrash.queryOptions());
  prefetch(trpc.billing.getPlan.queryOptions());

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <HydrateClient>
      <BillingSync />
      <DashboardSearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />
          <SidebarInset className="min-w-0">
            <header className="sticky top-0 z-50 isolate flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-6">
              <div className="relative z-50 flex min-w-0 flex-1 items-center gap-2">
                <SidebarTrigger size="icon-lg" />
                <Logo className="flex md:hidden" />
                <DashboardCardSearch className="hidden md:flex" />
              </div>
              <div className="relative z-50 flex items-center gap-2">
                <ModeToggle />
                <UserButton />
              </div>
            </header>
            {/* <MobileExperienceBanner /> */}
            <div className="relative z-0 min-w-0 flex-1 overflow-x-hidden">
              <PageEnter>{children}</PageEnter>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </DashboardSearchProvider>
    </HydrateClient>
  );
};

export default DashboardLayout;
