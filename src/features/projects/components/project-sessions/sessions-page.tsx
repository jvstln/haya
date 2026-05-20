"use client";

import { ArrowLeft2 } from "iconsax-reactjs";
import { Clock, Flame, Globe, ShieldAlert, Target, Users } from "lucide-react";
import React, { useMemo, useState } from "react";
import { DashboardSlot, DashboardTitle } from "@/components/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputSearch } from "@/components/ui/input-search";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilters } from "@/hooks/use-filters";
import { cn, getPlaceholderArrays } from "@/lib/utils";
import {
  useProject,
  useProjectOverview,
  useProjectSessions,
} from "../../project.hook";
import { SessionsTable } from "./sessions-table";

interface ProjectSessionsPageProps {
  projectId: string;
}

export const SessionsPage = ({ projectId }: ProjectSessionsPageProps) => {
  const [activeTab, setActiveTab] = useState<"sessionReplay" | "heatmap">(
    "sessionReplay",
  );

  const project = useProject(projectId);
  const overview = useProjectOverview(projectId);
  const { filters, originalFilters, setFilters } = useFilters();

  const sessionsQuery = useProjectSessions(projectId, filters);

  // Calculate dynamic metrics from the loaded sessions
  const avgDuration = useMemo(() => {
    const sessions = sessionsQuery.data?.sessions || [];
    if (sessions.length === 0) return "0s";
    const total = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const avg = total / sessions.length;
    const mins = Math.floor(avg / 60);
    const secs = Math.round(avg % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }, [sessionsQuery.data?.sessions]);

  const uniqueDevices = useMemo(() => {
    const sessions = sessionsQuery.data?.sessions || [];
    const devices = new Set(sessions.map((s) => s.deviceId).filter(Boolean));
    return devices.size;
  }, [sessionsQuery.data?.sessions]);

  // KPI card metrics Decoupled structure (DRY)
  const metrics = useMemo(
    () => [
      {
        title: "Total sessions",
        icon: Clock,
        value: overview.data?.totalSessions ?? 0,
        badgeColor: "bg-primary/10 text-primary",
      },
      {
        title: "Total events",
        icon: Target,
        value: overview.data?.totalEvents ?? 0,
        badgeColor: "bg-primary/10 text-primary",
      },
      {
        title: "Avg. duration",
        icon: ShieldAlert,
        value: avgDuration,
        badgeColor: "bg-primary/10 text-primary",
      },
      {
        title: "Unique devices",
        icon: Users,
        value: uniqueDevices,
        badgeColor: "bg-primary/10 text-primary",
      },
      {
        title: "Replays ready",
        icon: Flame,
        value: overview.data?.replayReadySessions ?? 0,
        badgeColor: "bg-primary/10 text-primary",
      },
    ],
    [overview.data, avgDuration, uniqueDevices],
  );

  // Visual loading Skeletons to prevent layout shifts
  if (project.isPending || overview.isPending) {
    return (
      <div className="relative flex min-h-screen w-full flex-col gap-6 p-4 md:p-6">
        {/* Skeletons Header */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>

        {/* Skeletons KPI Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-7">
          <Card className="col-span-1 md:col-span-2">
            <CardContent className="flex flex-col gap-2 pt-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
          {getPlaceholderArrays(5).map(({ id }) => (
            <Card key={id} className="col-span-1">
              <CardContent className="flex flex-col gap-2 pt-6">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton Table Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4 pb-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="space-y-3">
            {getPlaceholderArrays(5).map(({ id }) => (
              <Skeleton key={id} className="h-14 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <DashboardSlot>
      <DashboardTitle>Recorded Sessions</DashboardTitle>

      {/* Analytics KPI Dashboard Panel */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-7">
        {/* Top Visited Page card */}
        <Card className="col-span-1 flex flex-col justify-between border-primary/20 bg-linear-to-br from-primary/10 via-transparent to-transparent md:col-span-2">
          <CardContent className="flex h-full flex-col justify-between pt-6">
            <div>
              <span className="font-semibold text-primary text-xs uppercase tracking-wider">
                Top Visited Page
              </span>
              {overview.data?.topPages?.[0] ? (
                <div className="mt-2 flex flex-col gap-1">
                  <span
                    className="block truncate font-bold text-foreground text-lg leading-snug"
                    title={overview.data.topPages[0].page}
                  >
                    {overview.data.topPages[0].page}
                  </span>
                  <span className="font-medium text-muted-foreground text-xs">
                    {overview.data.topPages[0].views} views recorded
                  </span>
                </div>
              ) : (
                <span className="mt-2 font-bold text-foreground text-lg leading-snug">
                  No page views tracked yet
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metric cards grid loop */}
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="col-span-1">
              <CardContent className="flex h-full flex-col justify-between gap-4 pt-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground text-xs leading-none">
                    {metric.title}
                  </span>
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg",
                      metric.badgeColor,
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline">
                  <span className="font-bold font-mono text-2xl text-foreground tracking-tight">
                    {metric.value}
                  </span>
                </div>
              </CardContent>
            </Card>
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
          <div className="flex select-none rounded-lg bg-secondary/30 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("sessionReplay")}
              className={cn(
                "rounded-md px-4 py-1.5 font-medium text-sm transition-all",
                activeTab === "sessionReplay"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Session Replay
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("heatmap")}
              className={cn(
                "rounded-md px-4 py-1.5 font-medium text-sm transition-all",
                activeTab === "heatmap"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              HeatMap
            </button>
          </div>

          <div className="w-full sm:max-w-xs">
            <InputSearch
              placeholder="Search by persona or URL"
              value={originalFilters.search || ""}
              onChange={(e) => {
                setFilters((f) => ({ ...f, search: e.target.value }));
              }}
            />
          </div>
        </div>

        {/* State Display and Table */}
        <CardContent className="p-0">
          {activeTab === "heatmap" ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-10 text-center">
              <Globe className="h-8 w-8 animate-pulse text-muted-foreground" />
              <p className="font-medium text-foreground text-sm">
                Heatmaps Simulation Ready
              </p>
              <p className="max-w-xs text-muted-foreground text-xs">
                Heatmap analytics are successfully tracking in the background.
                Visual aggregates will show up on selector hover events.
              </p>
            </div>
          ) : (
            <SessionsTable
              sessions={sessionsQuery}
              // search={originalFilters.search || ""}
              // projectId={projectId}
            />
          )}
        </CardContent>
      </Card>
    </DashboardSlot>
  );
};
