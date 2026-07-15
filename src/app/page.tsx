"use client";

import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardSlot } from "@/components/dashboard-ui";
import { HayaSpinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/auth.hook";
import { NewProjectForm } from "@/features/projects/components/new-project-form";
import { useGlobalStore } from "@/stores";

export default function Home() {
  // ----- Show welcome page on first visit -----
  const isFirstTimeUser = useGlobalStore((state) => state.isFirstTimeUser);
  const isGlobalStoreHydrated = useGlobalStore((state) => state.hasHydrated);
  const auth = useAuth();

  if (auth.isPending || !isGlobalStoreHydrated) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <HayaSpinner />
      </div>
    );
  }

  if (!auth.isAuthenticated && isFirstTimeUser) {
    redirect("/auth/welcome");
  }
  // --------------------------------------------

  if (auth.isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <DashboardLayout>
      <DashboardSlot>
        <NewProjectForm />
      </DashboardSlot>
    </DashboardLayout>
  );
}
