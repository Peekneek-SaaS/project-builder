"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Chart03Icon,
  Delete02Icon,
  Home02Icon,
  LockPasswordIcon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarPlanFooter } from "@/features/dashboard/components/sidebar-plan-footer";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import Logo from "../../../../public/Logo/Logo";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home02Icon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: Chart03Icon,
      proOnly: true,
    },
    {
      title: "Trash",
      url: "/trash",
      icon: Delete02Icon,
      textColor: "text-red-400",
      hoverTextColor: "text-red-500!",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings01Icon,
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between py-2">
            <Logo className2="group-data-[collapsible=icon]:hidden!" />
            <SidebarTrigger size="lg" className="flex md:hidden" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarPlanFooter /> */}
    </Sidebar>
  );
}

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: IconSvgElement;
    textColor?: string;
    hoverTextColor?: string;
    proOnly?: boolean;
  }[];
}) {
  const pathname = usePathname();
  const trpc = useTRPC();
  const { data: billing } = useQuery(trpc.billing.getPlan.queryOptions());
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  function isNavActive(url: string) {
    return pathname === url || pathname.startsWith(`${url}/`);
  }

  function isLocked(item: (typeof items)[number]) {
    if (!item.proOnly) return false;
    // Keep SSR and the first client render identical until billing hydrates.
    if (!hasMounted) return true;
    if (!billing) return true;
    return !billing.analyticsEnabled;
  }

  const { isMobile, setOpenMobile } = useSidebar();
  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              asChild
            >
              <Link href="/create" onClick={closeMobileSidebar}>
                <HugeiconsIcon icon={PlusSignIcon} />
                <span>Create new card</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="gap-2">
          {items.map((item) => {
            const locked = isLocked(item);

            return (
              <SidebarMenuItem key={item.title}>
                {locked ? (
                  <SidebarMenuButton
                    tooltip="Upgrade to Pro to access Analytics"
                    disabled
                    aria-disabled
                    className="cursor-not-allowed opacity-60"
                    onClick={closeMobileSidebar}
                  >
                    {item.icon ? <HugeiconsIcon icon={item.icon} /> : null}
                    <span>{item.title}</span>
                    <HugeiconsIcon
                      icon={LockPasswordIcon}
                      size={14}
                      className="ml-auto shrink-0 text-muted-foreground"
                    />{" "}
                    PRO
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isNavActive(item.url)}
                    className="data-active:border data-active:shadow-sm"
                    asChild
                  >
                    <Link
                      href={item.url}
                      className={cn(item.textColor, item.hoverTextColor)}
                      onClick={closeMobileSidebar}
                    >
                      {item.icon ? <HugeiconsIcon icon={item.icon} /> : null}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
