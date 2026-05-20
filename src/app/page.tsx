"use client";

import { Github, Slack } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  DashboardHeader,
  DashboardSlot,
  DashboardTitle,
} from "@/components/dashboard-ui";
import { TelegramIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TagInstallation } from "@/features/audits/components/tag-installation";
import { useAuth } from "@/features/auth/auth.hook";
import { useOnboardingFormDialogView } from "@/features/auth/components/onboarding-dialog";
import { cn } from "@/lib/utils";

// Same UI as GetStarted component
export default function Home() {
  const [emails, setEmails] = useState("");
  const [inviting, setInviting] = useState(false);

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
      setView("login");
    };

    window.addEventListener("click", authInterceptor);

    return () => window.removeEventListener("click", authInterceptor);
  }, [view, setView, auth.isAuthenticated]);
  // -----------

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emails.trim()) {
      toast.error("Please enter at least one email address.");
      return;
    }

    const emailList = emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      toast.error(`Invalid email address: ${invalidEmails[0]}`);
      return;
    }

    setInviting(true);
    setTimeout(() => {
      toast.success(`Successfully invited ${emailList.length} team member(s)!`);
      setEmails("");
      setInviting(false);
    }, 1000);
  };

  const handleSkip = () => {
    toast.info(
      "Team invitation skipped. You can always invite members later from the Team tab.",
    );
  };

  const handleIntegrate = (platform: string) => {
    toast.success(`Redirecting to connect ${platform}...`);
  };

  return (
    <SidebarProvider
      className="flex flex-col"
      style={{ "--header-height": "70px" } as React.CSSProperties}
    >
      <AppHeader />
      <div className="flex min-h-[calc(100vh-var(--header-height))] w-full flex-1">
        <AppSidebar />
        <main className={cn("relative flex w-full flex-1 flex-col")}>
          <DashboardSlot>
            <DashboardHeader>
              <DashboardTitle>Get started with Haya</DashboardTitle>
            </DashboardHeader>
            <span className="block max-w-xl text-muted-foreground text-sm">
              Complete these setup tasks to integrate Haya into your codebase,
              bring your collaborators on board, and connect external team
              tools.
            </span>

            <div className="flex flex-col gap-6">
              {/* Step 1: Tag Installation */}
              <TagInstallation stepNumber={1} />

              {/* Step 2: Collaborate with Team */}
              <Card className="flex flex-row gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-bold text-primary text-sm">
                  2
                </div>
                <div className="grow">
                  <CardHeader className="p-0">
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-lg">
                        Collaborate with Team
                      </CardTitle>
                      <CardDescription className="max-w-3xl leading-relaxed">
                        Invite unlimited team members with their email. Give
                        access to your marketers, designers, developers, CEO,
                        and anyone else on your team.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-2 p-0">
                    <form
                      onSubmit={handleInvite}
                      className="mt-2 flex flex-col gap-4"
                    >
                      <textarea
                        value={emails}
                        onChange={(e) => setEmails(e.target.value)}
                        placeholder="Add a comma (,) after each email"
                        className="min-h-[100px] w-full resize-none rounded-xl border border-border/40 bg-black/20 p-4 text-sm text-white outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground/60 text-xs italic">
                          Optional
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            onClick={handleSkip}
                            appearance="link"
                            color="primary"
                            className="rounded-full"
                          >
                            Skip
                          </Button>
                          <Button
                            type="submit"
                            color="primary"
                            className="rounded-full"
                            isLoading={inviting}
                            loadingText="Inviting..."
                          >
                            Invite team members
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </div>
              </Card>

              {/* Step 3: Integrate with Tools */}
              <Card className="flex flex-row gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-bold text-primary text-sm">
                  3
                </div>
                <div className="grow">
                  <CardHeader className="p-0">
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-lg">
                        Integrate with tools
                      </CardTitle>
                      <CardDescription className="max-w-3xl leading-relaxed">
                        Speed up your workflow and automate everyday tasks with
                        powerful integrations your team already uses. Connect
                        your tools to gain deeper insights, streamline
                        collaboration, and keep everyone in the loop.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-4 p-0">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Github */}
                      <div className="group flex flex-col justify-between gap-4 rounded-xl border border-border/40 bg-black/20 p-6 transition-all hover:border-primary/30 hover:bg-black/30">
                        <div>
                          <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-border/40 bg-muted text-white transition-all group-hover:border-primary/30 group-hover:bg-primary/10">
                            <Github className="size-5" />
                          </div>
                          <h3 className="font-semibold text-base text-white">
                            Github
                          </h3>
                          <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                            Connect your Github cloud or Github Enterprise
                            Server organization to Haya.
                          </p>
                        </div>
                        <Button
                          onClick={() => handleIntegrate("Github")}
                          appearance="soft"
                          color="primary"
                          className="mt-4 w-full rounded-lg"
                        >
                          Integrate
                        </Button>
                      </div>

                      {/* Slack */}
                      <div className="group flex flex-col justify-between gap-4 rounded-xl border border-border/40 bg-black/20 p-6 transition-all hover:border-primary/30 hover:bg-black/30">
                        <div>
                          <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-border/40 bg-muted text-[#E01E5A] transition-all group-hover:border-primary/30 group-hover:bg-primary/10">
                            <Slack className="size-5" />
                          </div>
                          <h3 className="font-semibold text-base text-white">
                            Slack
                          </h3>
                          <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                            Connect your Slack workspace to receive real-time
                            notifications and updates.
                          </p>
                        </div>
                        <Button
                          onClick={() => handleIntegrate("Slack")}
                          appearance="soft"
                          color="primary"
                          className="mt-4 w-full rounded-lg"
                        >
                          Integrate
                        </Button>
                      </div>

                      {/* Telegram */}
                      <div className="group flex flex-col justify-between gap-4 rounded-xl border border-border/40 bg-black/20 p-6 transition-all hover:border-primary/30 hover:bg-black/30">
                        <div>
                          <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-border/40 bg-muted text-[#229ED9] transition-all group-hover:border-primary/30 group-hover:bg-primary/10">
                            <TelegramIcon className="size-5" />
                          </div>
                          <h3 className="font-semibold text-base text-white">
                            Telegram
                          </h3>
                          <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                            Connect your Telegram channel or group to receive
                            instant alerts and reports.
                          </p>
                        </div>
                        <Button
                          onClick={() => handleIntegrate("Telegram")}
                          appearance="soft"
                          color="primary"
                          className="mt-4 w-full rounded-lg"
                        >
                          Integrate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </DashboardSlot>
        </main>
      </div>
    </SidebarProvider>
  );
}
