"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  defaultSidebarContent,
  SidebarContentProvider,
} from "@/components/providers/sidebar-content.provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const HEADER_HEIGHT = "70px";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarContentProvider value={defaultSidebarContent}>
      <SidebarProvider
        className="flex flex-col"
        style={{ "--header-height": HEADER_HEIGHT } as React.CSSProperties}
      >
        <AppHeader />
        <div className="flex min-h-[calc(100vh-var(--header-height))] w-full flex-1">
          <AppSidebar />
          <main className={cn("relative flex w-full min-w-0 flex-1 flex-col")}>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </SidebarContentProvider>
  );
}
