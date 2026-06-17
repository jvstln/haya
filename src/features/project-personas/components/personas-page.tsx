"use client";

import { format, formatDistanceStrict } from "date-fns";
import { Clock, Flame, Globe, ShieldAlert, Target, Users } from "lucide-react";
import { useParams } from "next/navigation";
import {
  DashboardSlot,
  DashboardSummaryCard,
  DashboardTitle,
} from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { InputSearch } from "@/components/ui/input-search";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProjectOverview } from "@/features/projects/project.hook";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { usePersonas } from "../project-persona.hook";
import { PersonasBehaviorSettings } from "./persona-settings";
import { PersonasTable } from "./personas-table";

export const PersonasPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const overview = useProjectOverview(projectId);
  const { filters, originalFilters, setFilters } = useFilters();

  const personasQuery = usePersonas({ projectId, ...filters });

  return (
    <DashboardSlot>
      <DashboardTitle>Grouped Personas</DashboardTitle>

      {/* Analytics KPI Dashboard Panel */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-7">
        {/* Top Visited Page card */}
        <DashboardSummaryCard
          title="Top Priority"
          value={
            personasQuery.data?.analysis?.topPriority ??
            "No top priorities found"
          }
          icon={Globe}
          isLoading={overview.isPending}
          className={cn(
            "[--bg:color-mix(var(--color-primary),transparent_80%)] [--fg:var(--color-primary)] md:col-span-2",
          )}
        />

        {/* Metric cards grid loop */}
        {[
          {
            title: "Total sessions",
            icon: Clock,
            value: personasQuery.data?.analysis?.totalSessions ?? "-",
          },
          {
            title: "Friction score",
            icon: Target,
            value: personasQuery.data?.analysis?.frictionScore ?? "-",
          },
          {
            title: "Avg. duration",
            icon: ShieldAlert,
            value: personasQuery.data
              ? formatDistanceStrict(
                  0,
                  (personasQuery.data.analysis?.avgSessionDuration || 0) * 1000,
                ).replace(
                  /(\d+)\s*(minutes?|seconds?)/,
                  (_, digits, suffix) => {
                    return `${digits} ${suffix[0]}`;
                  },
                )
              : "",
          },
          {
            title: "Unique devices",
            icon: Users,
            value: personasQuery.data?.analysis?.uniqueUsers ?? "-",
          },
          {
            title: "Generated at",
            icon: Flame,
            value: personasQuery.data?.analysis?.generatedAt
              ? format(personasQuery.data.analysis.generatedAt, "PP")
              : "-",
          },
        ].map((metric) => {
          return (
            <DashboardSummaryCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              isLoading={overview.isPending}
              className={cn(
                "col-span-1 [--bg:color-mix(var(--color-primary),transparent_80%)] [--fg:var(--color-primary)]",
              )}
            />
          );
        })}
      </div>

      {/* Main Behavioral Sessions Card */}
      <Card className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-white text-xl">All behavioral data</h2>
        </div>

        {/* Table View Selector Tabs and Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ButtonGroup>
            <Button color="secondary" appearance={"solid"}>
              All personas
            </Button>
          </ButtonGroup>

          <InputSearch
            placeholder="Search by persona or URL"
            value={originalFilters.search || ""}
            onChange={(e) => {
              setFilters((f) => ({ ...f, search: e.target.value }));
            }}
          />
          <Popover>
            <PopoverTrigger render={<Button className="rounded-full" />}>
              Configure
            </PopoverTrigger>
            <PopoverContent align="end">
              <PopoverHeader>
                <PopoverTitle>Behavioral configuration</PopoverTitle>
                <PopoverDescription>
                  Persona is defined by a set of behavioral rules, conditions,
                  and events that identify and group similar users.
                </PopoverDescription>
              </PopoverHeader>

              <PersonasBehaviorSettings />
            </PopoverContent>
          </Popover>
        </div>

        {/* State Display and Table */}
        <CardContent className="p-0">
          <PersonasTable personas={personasQuery} projectId={projectId} />
        </CardContent>
      </Card>
    </DashboardSlot>
  );
};
