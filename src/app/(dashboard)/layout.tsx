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
import { UserButton } from "@clerk/nextjs";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import Logo from "../../../public/Logo/Logo";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  prefetch(trpc.card.list.queryOptions());
  prefetch(trpc.card.listTrash.queryOptions());
  prefetch(trpc.billing.getPlan.queryOptions());

  return (
    <HydrateClient>
      <BillingSync />
      <DashboardSearchProvider>
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <SidebarTrigger size="lg" />
                <Logo className="flex md:hidden" />
                <DashboardCardSearch className="hidden md:flex" />
              </div>
              <div className="flex items-center gap-1">
                <UserButton />
              </div>
            </header>
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </DashboardSearchProvider>
    </HydrateClient>
  );
};

export default DashboardLayout;
