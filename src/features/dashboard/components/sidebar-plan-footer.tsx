"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { CreditCardIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTRPC } from "@/trpc/client";

function formatRenewDate(iso: string) {
  return format(new Date(iso), "MMM d, yyyy");
}

export function SidebarPlanFooter() {
  const trpc = useTRPC();
  const { data: billing, isLoading } = useQuery(
    trpc.billing.getPlan.queryOptions(),
  );

  if (isLoading || !billing) {
    return null;
  }

  // if (billing.isPro) {
  //   const renewLabel = billing.planRenewsAt
  //     ? `Renews ${formatRenewDate(billing.planRenewsAt)}`
  //     : "Pro plan active";

  //   return (
  //     <SidebarFooter className="flex">
  //       <SidebarMenu>
  //         <SidebarMenuItem>
  //           <SidebarMenuButton
  //             asChild
  //             tooltip={renewLabel}
  //             className="h-auto flex-col items-start gap-0.5 py-2 group-data-[collapsible=icon]:hidden"
  //             isActive={false}
  //           >
  //             <Link href="/settings">
  //               <span className="text-xs font-medium group-data-[collapsible=icon]:sr-only flex items-center gap-2">
  //                 <HugeiconsIcon icon={SparklesIcon} />
  //                 Pro plan
  //               </span>
  //               <span className="text-[11px] font-normal text-muted-foreground group-data-[collapsible=icon]:sr-only">
  //                 {renewLabel}
  //               </span>
  //             </Link>
  //           </SidebarMenuButton>
  //         </SidebarMenuItem>
  //       </SidebarMenu>
  //     </SidebarFooter>
  //   );
  // }

  return (
    <SidebarFooter className="flex">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Upgrade to Pro"
            // className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            variant="outline"
          >
            <Link href="/settings#pricing-plans">
              <HugeiconsIcon icon={CreditCardIcon} />
              <span>Upgrade to Pro</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
