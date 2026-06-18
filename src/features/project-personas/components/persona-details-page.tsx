"use client";
import { formatDistance } from "date-fns";
import { Activity, ArrowLeft, Clock } from "iconsax-reactjs";
import { Globe } from "lucide-react";
import { useParams } from "next/navigation";
import { DashboardSummaryCard } from "@/components/dashboard-ui";
import { QueryState } from "@/components/query-states";
import { RrwebReplay } from "@/components/rrweb-replay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveStatusColor } from "@/lib/color.util";
import { cn } from "@/lib/utils";
import type { Params } from "@/types";
import { usePersonas } from "../project-persona.hook";
import { PersonaDetailsViews } from "./persona-details-views";

export const PersonaDetailsPage = () => {
  const params =
    useParams<Params<"/dashboard/projects/[projectId]/personas/[personaId]">>();

  const personasQuery = usePersonas({ projectId: params.projectId });

  const persona = personasQuery.data?.analysis?.personas.find(
    (persona) => persona.representativeSessionId === params.personaId,
  );

  if (personasQuery.isError) {
    return <QueryState query={personasQuery} />;
  }

  if (!persona) {
    return (
      <QueryState
        query={personasQuery}
        getIsEmpty={() =>
          !persona && "There is no persona available for display"
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 from-0% from-primary/20 via-transparent p-4 max-md:bg-linear-to-b">
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

        {personasQuery.data && (
          <>
            <span className="font-mono text-muted-foreground text-sm">
              Persona: {persona.name}{" "}
            </span>

            <div className="ml-auto flex items-center gap-2">
              <Badge
                appearance="soft"
                color={resolveStatusColor(persona.severity)}
              >
                {persona.severity}
              </Badge>
            </div>
          </>
        )}
      </div>

      {/* Stats Summary Grid */}
      <div className="flex gap-4 *:grow">
        <DashboardSummaryCard
          className="basis-2/5"
          title="Business Impact"
          value={persona.businessImpact || "No business impact found"}
          isLoading={personasQuery.isPending}
        />

        {[
          {
            label: "Avg. Duration",
            value: formatDistance(0, persona.avgSessionDuration || 0, {
              includeSeconds: true,
            }),
            className:
              "[--bg:var(--color-primary)] [--fg:var(--color-primary-foreground)]",
            icon: Clock,
          },
          {
            label: "Affected Page",
            value: persona.affectedPage,
            className:
              "[--bg:var(--color-cyan)] [--fg:var(--color-cyan-foreground)]",
            icon: Globe,
          },
          {
            label: "Friction",
            value: persona.psychologicalFriction,
            className:
              "[--bg:var(--color-success)] [--fg:var(--color-success-foreground)]",
            icon: Activity,
          },
        ].map((info) => (
          <DashboardSummaryCard
            className={cn("basis-1/5", info.className)}
            key={info.label}
            title={info.label}
            value={info.value}
            icon={info.icon}
            isLoading={personasQuery.isPending}
          />
        ))}
      </div>

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Replay Player */}
        <div className="flex min-w-0 flex-col lg:col-span-7">
          <RrwebReplay replayUrl={persona.representativeReplayUrl} />
        </div>

        {/* Right Column: Insights & Breakdown */}
        <div className="flex min-w-0 flex-col lg:col-span-5">
          <PersonaDetailsViews persona={persona} />
        </div>
      </div>
    </div>
  );
};
