"use client";
import { formatDistance } from "date-fns";
import { Activity, ArrowLeft, Clock } from "iconsax-reactjs";
import { Globe } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  DashboardSlot,
  DashboardSummary,
  DashboardSummaryCard,
} from "@/components/dashboard-ui";
import { QueryState } from "@/components/query-states";
import { RrwebReplay } from "@/components/rrweb-replay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileViewSwitch } from "@/components/ui/mobile-view-switch";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { resolveStatusColor } from "@/lib/color.util";
import { cn } from "@/lib/utils";
import type { Params } from "@/types";
import { usePersona } from "../project-persona.hook";
import { PersonaDetailsViews } from "./persona-details-views";

export const PersonaDetailsPage = () => {
  const params =
    useParams<Params<"/dashboard/projects/[projectId]/personas/[personaId]">>();

  const persona = usePersona(params);
  const [currentView, setCurrentView] = useState<"replay" | "insights">(
    "replay",
  );
  const isMobile = useBreakpoint("max-md");

  if (persona.isError) {
    return <QueryState query={persona} />;
  }

  if (!persona.data) {
    return (
      <QueryState
        query={persona}
        getIsEmpty={() =>
          !persona && "There is no persona available for display"
        }
      />
    );
  }

  return (
    <DashboardSlot className="max-md:pb-28">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <Button
          href={`/dashboard/projects/${params.projectId}/personas`}
          size="sm"
          appearance="soft"
        >
          <ArrowLeft />
          Back to personas
        </Button>

        {persona.data && (
          <>
            <span className="font-mono text-muted-foreground text-sm">
              Persona: {persona.data.name}{" "}
            </span>

            <div className="ml-auto flex items-center gap-2">
              <Badge
                appearance="soft"
                color={resolveStatusColor(persona.data.severity)}
              >
                {persona.data.severity}
              </Badge>
            </div>
          </>
        )}
      </div>

      {/* Stats Summary Grid */}
      <DashboardSummary>
        <DashboardSummaryCard
          className="basis-2/5"
          title="Business Impact"
          value={persona.data.businessImpact || "No business impact found"}
          isLoading={persona.isPending}
        />

        {[
          {
            label: "Avg. Duration",
            value: formatDistance(0, persona.data.avgSessionDuration || 0, {
              includeSeconds: true,
            }),
            className:
              "[--bg:var(--color-primary)] [--fg:var(--color-primary-foreground)]",
            icon: Clock,
          },
          {
            label: "Affected Page",
            value: persona.data.affectedPage,
            className:
              "[--bg:var(--color-cyan)] [--fg:var(--color-cyan-foreground)]",
            icon: Globe,
          },
          {
            label: "Friction",
            value: persona.data.psychologicalFriction,
            className:
              "[--bg:var(--color-success)] [--fg:var(--color-success-foreground)]",
            icon: Activity,
          },
        ].map((info) => (
          <DashboardSummaryCard
            key={info.label}
            className={cn("basis-1/5", info.className)}
            title={info.label}
            value={info.value}
            icon={info.icon}
            isLoading={persona.isPending}
          />
        ))}
      </DashboardSummary>

      {/* Control to switch between replay view and insights view only on mobile */}
      <MobileViewSwitch
        currentView={currentView}
        onViewChange={setCurrentView}
        options={[
          { value: "replay", label: "Replay View" },
          { value: "insights", label: "Insights View" },
        ]}
      />

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Replay Player */}
        <div
          className={cn(
            "flex min-w-0 flex-col lg:col-span-7",
            isMobile && currentView !== "replay" && "hidden",
          )}
        >
          <RrwebReplay replayUrl={persona.data.representativeReplayUrl} />
        </div>

        {/* Right Column: Insights & Breakdown */}
        <div
          className={cn(
            "flex min-w-0 flex-col lg:col-span-5",
            isMobile && currentView !== "insights" && "hidden",
          )}
        >
          <PersonaDetailsViews persona={persona.data} />
        </div>
      </div>
    </DashboardSlot>
  );
};
