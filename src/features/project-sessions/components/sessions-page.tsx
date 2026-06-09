"use client";

import { Clock, Flame, Globe, ShieldAlert, Target, Users } from "lucide-react";
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
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { useProjectOverview } from "../../projects/project.hook";
import { useSessions } from "../project-session.hook";
import { SessionsTable } from "./sessions-table";

interface ProjectSessionsPageProps {
  projectId: string;
}

export const SessionsPage = ({ projectId }: ProjectSessionsPageProps) => {
  const [activeTab, setActiveTab] = useState<"sessionReplay" | "heatmap">(
    "sessionReplay",
  );
  const overview = useProjectOverview(projectId);
  const { filters, originalFilters, setFilters } = useFilters();

  const sessionsQuery = useSessions(projectId, filters);

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

  return (
    <DashboardSlot>
      <DashboardTitle>Recorded Sessions</DashboardTitle>

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
            <Button
              onClick={() => setActiveTab("sessionReplay")}
              color="secondary"
              appearance={activeTab === "sessionReplay" ? "solid" : "outline"}
            >
              Session replay
            </Button>
            <Button
              onClick={() => setActiveTab("sessionReplay")}
              color="secondary"
              appearance={activeTab === "heatmap" ? "solid" : "outline"}
            >
              Heatmap
            </Button>
          </ButtonGroup>

          <div className="w-full sm:max-w-xs">
            <InputSearch
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
            <SessionsTable sessions={sessionsQuery} />
          )}
        </CardContent>
      </Card>
    </DashboardSlot>
  );
};
