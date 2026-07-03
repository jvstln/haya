"use client";

import { useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  defaultSidebarContent,
  SidebarContentProvider,
} from "@/components/providers/sidebar-content.provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HayaSpinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/auth.hook";
import { useOnboardingFormDialogView } from "@/features/auth/components/onboarding-dialog";
import { cn } from "@/lib/utils";

const HEADER_HEIGHT = "70px";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const auth = useAuth();
  const { view, setView } = useOnboardingFormDialogView();

  useEffect(() => {
    if (!auth.isAuthenticated && view === null) {
      setView("login");
    }
  }, [auth.isAuthenticated, view, setView]);

  if (auth.isPending) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <HayaSpinner />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

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
