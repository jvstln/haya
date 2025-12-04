"use client";
import { Add, HamburgerMenu, Notification } from "iconsax-reactjs";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import type { LinkGroup, LinkItem, SidebarItemable } from "@/data/navlinks";
import { SignupFormDialog } from "@/features/auth/components/signup-dialog";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const AppSidebar = ({
  sidebarItems,
}: {
  sidebarItems: SidebarItemable[];
}) => {
  const pathname = usePathname();
  const params = useParams();
  const { isMobile, toggleSidebar } = useSidebar();

  const parsedSidebaItems = useMemo(() => {
    const newSidebarItems: LinkGroup[] = [];
    const normalizeUrl = (url: string) => {
      return url.replace(/\[(.*?)\]/g, (match, param) => {
        return Array.isArray(params[param])
          ? params[param][0]
          : params[param] || match;
      });
    };

    if ("url" in sidebarItems[0]) {
      newSidebarItems.push({ title: "", items: [] });
    }

    sidebarItems.forEach((item) => {
      const currentGroup = newSidebarItems.at(-1);
      if ("url" in item && currentGroup) {
        currentGroup.items.push({
          ...item,
          url: normalizeUrl(item.url) as LinkItem["url"],
        });
        return;
      }
      newSidebarItems.push({ title: item.title, items: [] });
    });

    return newSidebarItems;
  }, [sidebarItems, params]);

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
          <Button variant="ghost" size="icon" onClick={() => toggleSidebar()}>
            <Add className="size-7 rotate-45" />
          </Button>
        </SidebarHeader>
      )}

      <SidebarContent className={cn(!isMobile && "mt-6")}>
        {parsedSidebaItems.map((link, index) => (
          <SidebarGroup key={`${index}-${link.title}`}>
            {link.title && <SidebarGroupLabel>{link.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu className="gap-4.5">
                {link.items.map(
                  ({ title, url, exact = true, icon: Icon, tooltip }) => {
                    const isActive = exact
                      ? pathname === url
                      : pathname.startsWith(url);

                    const sidebarItem = (
                      <SidebarMenuItem key={title + url}>
                        <SidebarMenuButton
                          className="relative pl-6"
                          isActive={isActive}
                          asChild
                        >
                          <Link href={url as Route}>
                            {/* Highlighter */}
                            <span
                              className="pointer-events-none absolute top-0 left-0 h-full w-1 [[data-active=true]_*]:bg-primary"
                              aria-hidden="true"
                            />
                            <Icon />
                            {title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );

                    if (tooltip) {
                      return (
                        <TooltipProvider key={title + url}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {sidebarItem}
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {tooltip}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    }

                    return sidebarItem;
                  }
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
};

export const AppHeader = () => {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) w-full shrink-0 items-center gap-4 border-b bg-background px-5 md:px-10">
      {isMobile ? (
        <Button variant="ghost" size="icon" onClick={() => toggleSidebar()}>
          <HamburgerMenu />
        </Button>
      ) : (
        <Link href="/">
          <Image src={logo} alt="Logo" className="h-9" />
        </Link>
      )}
      <Button className="ml-auto" variant="glass" size="icon">
        <Notification />
      </Button>
      <SignupFormDialog>
        <Button>Sign up</Button>
      </SignupFormDialog>
    </header>
  );
};
