"use client";

import type React from "react";
import { useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  defaultSidebarContent,
  SidebarContentProvider,
} from "@/components/providers/sidebar-content.provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/auth.hook";
import { useOnboardingFormDialogView } from "@/features/auth/components/onboarding-dialog";
import { NewProjectForm } from "@/features/projects/components/new-project-form";
import { cn } from "@/lib/utils";

export default function Home() {
  // The user only sees this page if they are not logged in
  // Intercept all clicks and prompt the user to login if a button or link is clicked
  // -----------
  const { view, setView } = useOnboardingFormDialogView();
  const auth = useAuth();
  useEffect(() => {
    const authInterceptor = (event: PointerEvent) => {
      if (
        !(event.target instanceof HTMLElement) ||
        !event.target.closest("a, button, [role=button]") ||
        view ||
        auth.isAuthenticated
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setView("login");
    };

    window.addEventListener("click", authInterceptor, { capture: true });

    return () =>
      window.removeEventListener("click", authInterceptor, { capture: true });
  }, [view, setView, auth.isAuthenticated]);
  // -----------

  return (
    <SidebarContentProvider value={defaultSidebarContent}>
      <SidebarProvider
        className="flex flex-col"
        style={{ "--header-height": "70px" } as React.CSSProperties}
      >
        <AppHeader />
        <div className="flex min-h-[calc(100vh-var(--header-height))] w-full flex-1">
          <AppSidebar />
          <main className={cn("relative flex w-full min-w-0 flex-1 flex-col")}>
            <NewProjectForm />
          </main>
        </div>
      </SidebarProvider>
    </SidebarContentProvider>
  );
}
