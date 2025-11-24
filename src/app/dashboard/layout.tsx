"use client";
import { usePathname } from "next/navigation";
import { AppHeader, AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarContent } from "@/data/navlinks";
import { cn } from "@/lib/utils";

const HEADER_HEIGHT = "70px";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const pathname = usePathname();

  return (
    <SidebarProvider
      className="flex flex-col"
      style={{ "--header-height": HEADER_HEIGHT } as React.CSSProperties}
    >
      <AppHeader />

      <div className="flex min-h-[calc(100vh-var(--header-height))] w-full flex-1">
        <AppSidebar sidebarItems={getSidebarContent(pathname)} />
        <main
          className={cn(
            // !isMobile &&
            "[[data-sidebar-state=collapsed]_*]:max-w-[calc(100vw-var(--sidebar-width-icon))] [[data-sidebar-state=expanded]_*]:max-w-[calc(100vw-var(--sidebar-width))]",
            "relative flex w-full flex-1 flex-col"
          )}
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
