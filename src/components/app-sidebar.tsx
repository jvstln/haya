"use client";
import { Add } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { getSidebarContent } from "@/data/navlinks";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const AppSidebar = ({
  sidebarItems,
}: {
  sidebarItems: ReturnType<typeof getSidebarContent>;
}) => {
  const pathname = usePathname();
  const { isMobile, toggleSidebar, setOpenMobile } = useSidebar();

  if (!sidebarItems) return null;

  return (
    <Sidebar
      collapsible="icon"
      className="sticky top-(--header-height) h-[calc(100vh-var(--header-height))] overflow-y-auto"
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
          const isLink = "url" in item;
          const isGroupLabel = !isLink;

          if (isLink) {
            const isActive = item.exact
              ? pathname === item.url
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
                  <TooltipTrigger asChild>{sidebarLink}</TooltipTrigger>
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
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
};
