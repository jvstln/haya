"use client";
import { useParams, usePathname } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarContent } from "@/data/navlinks";
import { cn } from "@/lib/utils";

const HEADER_HEIGHT = "70px";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const pathname = usePathname();
  const params = useParams();

  return (
    <SidebarProvider
      className="flex flex-col"
      style={{ "--header-height": HEADER_HEIGHT } as React.CSSProperties}
    >
      <AppHeader />

      <div className="flex min-h-[calc(100vh-var(--header-height))] w-full flex-1">
        <AppSidebar sidebarItems={getSidebarContent(pathname, params)} />
        <main className={cn("relative flex w-full flex-1 flex-col")}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
