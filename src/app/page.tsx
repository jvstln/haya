"use client";

import { BoxAdd, PenAdd, Scan } from "iconsax-reactjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { FolderIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { InputSearch } from "@/components/ui/input-search";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSidebarContent } from "@/data/navlinks";
import { useAuth } from "@/features/auth/auth.hook";
import { setOnboardingFormDialogView } from "@/features/auth/components/onboarding-dialog";

/**
 * A temporary page for unauthenticated users to land on before signing up or logging in.
 * It will be replaced with a proper landing page in the future.
 */

export default function Home() {
  const [view, setView] = useState<"all" | "assigned" | "completed">("all");
  const router = useRouter();
  const params = useParams();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard/audits");
    }
  }, [isAuthenticated, router.push]);

  const openSignupPage = () => setOnboardingFormDialogView("signUpEmail");

  return (
    <SidebarProvider
      className="flex flex-col"
      style={{ "--header-height": "70px" } as React.CSSProperties}
    >
      <AppHeader />

      <div className="flex min-h-[calc(100vh-var(--header-height))] w-full flex-1">
        <AppSidebar
          sidebarItems={getSidebarContent("/dashboard/audits", params)}
        />
        <main className="relative flex w-full flex-1 flex-col">
          {/* Children */}
          <div className="relative flex min-h-screen w-full flex-col gap-6 p-3 [--audit-card-height:189px] [--audit-card-width:212px] md:p-6">
            <DashboardHeader
              title="UX intelligence that turns websites into revenue machines"
              cta={
                <div className="flex gap-4">
                  <Button
                    color="secondary"
                    className="rounded-full"
                    onClick={openSignupPage}
                  >
                    <Scan className="size-5.5 rounded-sm bg-primary p-1" />{" "}
                    Audit
                  </Button>
                  <Button
                    color="secondary"
                    className="rounded-full"
                    onClick={openSignupPage}
                  >
                    <BoxAdd className="size-5.5 rounded-sm bg-primary-compliment p-1" />
                    Canva
                  </Button>

                  <Button
                    color="secondary"
                    className="rounded-full"
                    onClick={openSignupPage}
                  >
                    <PenAdd className="size-5.5 rounded-sm bg-[#0088FF] p-1" />
                    List
                  </Button>
                </div>
              }
            />

            <div className="flex items-center justify-between gap-1">
              <Button
                appearance={view === "all" ? "solid" : "ghost"}
                color="secondary"
                size="sm"
                onClick={() => setView("all")}
              >
                All audits
              </Button>
              <Button
                appearance={view === "assigned" ? "solid" : "ghost"}
                color="secondary"
                size="sm"
                onClick={() => setView("assigned")}
              >
                Assigned
              </Button>
              <Button
                appearance={view === "completed" ? "solid" : "ghost"}
                color="secondary"
                size="sm"
                onClick={() => setView("completed")}
              >
                Completed
              </Button>

              <InputSearch placeholder="Search audits" />
            </div>

            <div className="flex grow flex-col items-center justify-center text-sm">
              <FolderIcon className="size-40" />
              <p>No audit yet</p>
            </div>
          </div>
          {/* /Children */}
        </main>
      </div>
    </SidebarProvider>
  );
}
