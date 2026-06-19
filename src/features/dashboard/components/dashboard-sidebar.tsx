"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "../../../../public/Logo/Logo";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardSquare01Icon,
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
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton asChild className="p-0!">
              {/* <Link href="/" className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  size={22}
                  //   color="dark:blue white"
                />
                <p className="leading-7 text-sm font-semibold group-data-[collapsible=icon]:hidden!">
                  Cardably
                </p>
              </Link> */}
              <Logo />
            </SidebarMenuButton>
            <SidebarTrigger size="lg" className="flex md:hidden" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Chart03Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  Delete02Icon,
  LockIcon,
  LockPasswordIcon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
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

  function isNavActive(url: string) {
    return pathname === url || pathname.startsWith(`${url}/`);
  }

  function isLocked(item: (typeof items)[number]) {
    if (!item.proOnly) return false;
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
                    />
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
