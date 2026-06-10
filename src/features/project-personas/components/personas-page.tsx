"use client";

import { Clock, Flame, Globe, ShieldAlert, Target, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useSessions } from "@/features/project-sessions/project-session.hook";
import { useProjectOverview } from "@/features/projects/project.hook";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { usePersona } from "../project-persona.hook";
import { PersonasBehaviorSettings } from "./persona-settings";
import { PersonasTable } from "./personas-table";

export const PersonasPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const overview = useProjectOverview(projectId);
  const { filters, originalFilters, setFilters } = useFilters();

  const sessionsQuery = useSessions(projectId, filters);
  const personasQuery = usePersona({ projectId, ...filters });

  // Calculate dynamic metrics from the loaded sessions
  const avgDuration = useMemo(() => {
    const sessions = sessionsQuery.data?.sessions || [];
    if (sessions.length === 0) return "0s";
    const total = sessions.reduce(
      (acc: number, s: { duration?: number }) => acc + (s.duration || 0),
      0,
    );
    const avg = total / sessions.length;
    const mins = Math.floor(avg / 60);
    const secs = Math.round(avg % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }, [sessionsQuery.data?.sessions]);

  const uniqueDevices = useMemo(() => {
    const sessions = sessionsQuery.data?.sessions || [];
    const devices = new Set(
      sessions.map((s: { deviceId?: string }) => s.deviceId).filter(Boolean),
    );
    return devices.size;
  }, [sessionsQuery.data?.sessions]);

  return (
    <DashboardSlot>
      <DashboardTitle>Grouped Personas</DashboardTitle>

      {/* Analytics KPI Dashboard Panel */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-7">
        {/* Top Visited Page card */}
        <DashboardSummaryCard
          title="Top Visited Page"
          value={
            overview.data?.topPages?.[0]?.page ?? "No page views tracked yet"
          }
          description={
            overview.data?.topPages?.[0]?.views
              ? `${overview.data?.topPages?.[0]?.views} views recorded`
              : ""
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
            value: overview.data?.totalSessions ?? 0,
          },
          {
            title: "Total events",
            icon: Target,
            value: overview.data?.totalEvents ?? 0,
          },
          {
            title: "Avg. duration",
            icon: ShieldAlert,
            value: avgDuration,
          },
          {
            title: "Unique devices",
            icon: Users,
            value: uniqueDevices,
          },
          {
            title: "Replays ready",
            icon: Flame,
            value: overview.data?.replayReadySessions ?? 0,
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
          <PersonasTable personas={personasQuery} />
        </CardContent>
      </Card>
    </DashboardSlot>
  );
};
