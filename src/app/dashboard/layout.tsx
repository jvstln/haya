"use client";
import {
  Add,
  CodeCircle,
  HamburgerMenu,
  Notification,
  People,
  ProfileTick,
  Scan,
  Setting2,
  Shop,
} from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.svg";

const sidebarLinks = [
  { name: "Analyze", href: "/dashboard/analyze", icon: Scan },
  { name: "User profile", href: "/dashboard/profile", icon: ProfileTick },
  { name: "Resources", href: "/dashboard/resources", icon: Shop },
  { name: "SDK's", href: "/dashboard/sdk", icon: CodeCircle },
  { name: "Community", href: "/dashboard/community", icon: People },
  { name: "Settings", href: "/dashboard/settings", icon: Setting2 },
];

const HEADER_HEIGHT = "70px";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      // className="flex h-dvh flex-col overflow-auto"
      className="flex flex-col"
      style={{ "--header-height": HEADER_HEIGHT } as React.CSSProperties}
    >
      <SidebarLayoutContent>{children}</SidebarLayoutContent>
    </SidebarProvider>
  );
}

const SidebarLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <>
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
        <Button variant="colorful">Sign up</Button>
      </header>

      <div className="flex min-h-[calc(100vh-var(--header-height))] w-full flex-1">
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
                variant="ghost"
                size="icon"
                onClick={() => toggleSidebar()}
              >
                <Add className="size-7 rotate-45" />
              </Button>
            </SidebarHeader>
          )}
          <SidebarContent className={cn(!isMobile && "mt-6")}>
            <SidebarMenu className="gap-4.5">
              {sidebarLinks.map((link) => (
                <SidebarMenuItem key={link.name + link.href}>
                  <SidebarMenuButton
                    className="relative pl-10"
                    isActive={pathname.startsWith(link.href)}
                    asChild
                  >
                    <Link href={link.href}>
                      {/* Highlighter */}
                      <span
                        className="pointer-events-none absolute top-0 left-0 h-full w-1 [[data-active=true]_*]:bg-primary"
                        aria-hidden="true"
                      />
                      <link.icon />
                      {link.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarTrigger />
          </SidebarFooter>
        </Sidebar>
        <main
          className={cn(
            !isMobile &&
              "[[data-sidebar-state=collapsed]_*]:max-w-[calc(100vw-var(--sidebar-width-icon))] [[data-sidebar-state=expanded]_*]:max-w-[calc(100vw-var(--sidebar-width))]",
            "flex w-full flex-1 flex-col"
          )}
        >
          {children}
        </main>
      </div>
    </>
  );
};
