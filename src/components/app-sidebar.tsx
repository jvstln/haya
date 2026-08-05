"use client";
import { Add, Crown } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef } from "react";
import { useAuth } from "@/features/auth/auth.hook";
import { getPlanName } from "@/features/pricing/plan-meta";
import { useCurrentPlan } from "@/features/pricing/pricing.hook";
import { gsap, useGSAP } from "@/lib/gsap.util";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";
import { useSidebarContent } from "./providers/sidebar-content.provider";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const AppSidebar = () => {
  const pathname = usePathname();
  const { isMobile, toggleSidebar, setOpenMobile } = useSidebar();

  const auth = useAuth();
  const currentPlan = useCurrentPlan({ enabled: auth.isAuthenticated });

  const planCardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!auth.isAuthenticated || !planCardRef.current) return;

      gsap.fromTo(
        planCardRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
      gsap.fromTo(
        "[data-plan-icon]",
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.1,
        },
      );
      gsap.to("[data-plan-icon]", {
        scale: 1.05,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.1,
      });
    },
    { scope: planCardRef, dependencies: [auth.isAuthenticated] },
  );

  // const sidebarItems = useGlobalStore((state) => state.sidebarConfig.content);
  const sidebarItems = useSidebarContent().content;

  if (!sidebarItems) return null;

  return (
    <Sidebar
      collapsible="icon"
      className="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] overflow-y-auto border-secondary border-r"
      data-public
    >
      {isMobile && (
        <SidebarHeader className="flex-row items-center justify-between gap-4 p-4">
          <Link href="/">
            <Image src={logo} alt="Logo" className="h-6.75" />
          </Link>
          <Button
            appearance="ghost"
            color="secondary"
            size="icon"
            onClick={() => toggleSidebar()}
          >
            <Add className="size-7 rotate-45" />
          </Button>
        </SidebarHeader>
      )}

      {/* This sidebar content follows a flat structure rather than nested one defined in shadcn for simplicity */}
      <SidebarContent className={cn(!isMobile && "mt-6")}>
        {sidebarItems.map((item) => {
          if (React.isValidElement(item) || item === null) {
            return item;
          }

          const isLink = typeof item === "object" && "url" in item;
          const isGroupLabel =
            typeof item === "object" && "title" in item && !isLink;

          if (isLink) {
            const isActive = item.getIsActive
              ? item.getIsActive(pathname)
              : pathname.startsWith(item.url);

            const sidebarLink = (
              <SidebarMenuItem key={item.title + item.url}>
                <SidebarMenuButton
                  className="relative pl-6"
                  isActive={isActive}
                  asChild
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <Link href={item.url}>
                    {/* Highlighter */}
                    <span
                      className="pointer-events-none absolute top-0 left-0 h-full w-1 [[data-active=true]_*]:bg-primary"
                      aria-hidden="true"
                    />
                    <item.icon />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );

            if (item.tooltip) {
              return (
                <Tooltip key={item.title + item.url}>
                  <TooltipTrigger render={sidebarLink} />
                  <TooltipContent side="right">{item.tooltip}</TooltipContent>
                </Tooltip>
              );
            }
            return sidebarLink;
          }

          if (isGroupLabel) {
            return (
              <SidebarGroupLabel key={item.title} className="px-4">
                {item.title}
              </SidebarGroupLabel>
            );
          }

          return null;
        })}
      </SidebarContent>

      <SidebarFooter>
        {auth.isAuthenticated && (
          <Link
            href="/dashboard/pricing"
            className="group-data-[collapsible=icon]:hidden"
            aria-label={`Current plan: ${getPlanName(currentPlan.data?.currentPlan)}`}
          >
            <div
              ref={planCardRef}
              className="hover:-translate-y-0.5 relative isolate overflow-hidden rounded-xl border border-secondary bg-card p-3 transition-all hover:border-primary/50"
            >
              <div
                aria-hidden="true"
                className="-top-10 -right-6 pointer-events-none absolute size-24 rounded-full bg-primary/20 blur-2xl"
              />
              <div className="relative flex items-center gap-3">
                <span
                  data-plan-icon
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/30 text-primary"
                >
                  <Crown className="size-4" variant="Bold" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                    Current plan
                  </p>
                  {currentPlan.isPending ? (
                    <Skeleton className="mt-1 h-4 w-16" />
                  ) : (
                    <p className="truncate font-bold text-foreground">
                      {getPlanName(currentPlan.data?.currentPlan)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )}
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
};
