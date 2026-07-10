"use client";

import { Activity, Globe, Play, Users, Zap } from "lucide-react";
import {
  DashboardSummary,
  DashboardSummaryCard,
} from "@/components/dashboard-ui";
import { QueryState } from "@/components/query-states";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceholderArrays } from "@/lib/utils";
import { useProject, useProjectOverview } from "../project.hook";

interface ProjectOverviewProps {
  projectId: string;
}

export const ProjectOverview = ({ projectId }: ProjectOverviewProps) => {
  const project = useProject(projectId);
  const projectOverview = useProjectOverview(projectId);

  if (project.isPending || projectOverview.isPending) {
    return (
      <div className="flex flex-col gap-6">
        {/* KPI Skeletons */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {getPlaceholderArrays(4).map(({ id }) => (
            <Card key={id}>
              <CardContent className="flex flex-col gap-2 pt-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Layout Grid Skeletons */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="mb-1 h-5 w-32" />
                <Skeleton className="h-3 w-56" />
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-2">
                {getPlaceholderArrays(3).map(({ id }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-1.5 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="mb-1 h-5 w-32" />
                <Skeleton className="h-3 w-56" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex flex-wrap gap-4">
                  {getPlaceholderArrays(2).map(({ id }) => (
                    <Skeleton key={id} className="h-16 w-32 rounded-2xl" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (project.isError || projectOverview.isError) {
    return <QueryState query={projectOverview} />;
  }

  // Calculate replay capture conversion rate
  const replayRate =
    projectOverview.data && projectOverview.data.totalSessions > 0
      ? Math.round(
          (projectOverview.data.replayReadySessions /
            projectOverview.data.totalSessions) *
            100,
        )
      : 0;

  const metrics = [
    {
      title: "Total Sessions",
      icon: Users,
      value: projectOverview.data.totalSessions.toLocaleString(),
      description: "Recorded user visits",
    },
    {
      title: "Recorded Events",
      icon: Zap,
      value: projectOverview.data.totalEvents.toLocaleString(),
      description: "Interactions & views",
    },
    {
      title: "Replays Ready",
      icon: Play,
      value: projectOverview.data.replayReadySessions.toLocaleString(),
      description: "Sessions with visual playback",
    },
    {
      title: "Replay Capture Rate",
      icon: Activity,
      value: `${replayRate}%`,
      description: "Ratio of replays to sessions",
      valueClassName: "font-mono",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DashboardSummary>
        {metrics.map((metric) => {
          return (
            <DashboardSummaryCard
              key={metric.title}
              title={metric.title}
              icon={metric.icon}
              description={metric.description}
              value={metric.value}
            />
          );
        })}
      </DashboardSummary>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Visited Pages & Activity Breakdown */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Top Visited Pages Card */}
          <Card className="flex flex-1 flex-col">
            <CardHeader>
              <CardTitle>Top Visited Pages</CardTitle>
              <CardDescription>
                The most popular user paths where behavioral sessions have been
                recorded.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-2">
              {!projectOverview.data.topPages ||
              projectOverview.data.topPages.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-10 text-center">
                  <Globe className="h-8 w-8 animate-pulse text-muted-foreground" />
                  <p className="font-medium text-foreground text-sm">
                    No page visit metrics yet
                  </p>
                  <p className="max-w-xs text-muted-foreground text-xs">
                    Once users start visiting pages with Haya integrated, top
                    visited analytics will appear here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {projectOverview.data.topPages.map((page, index) => {
                    const maxViews = Math.max(
                      ...projectOverview.data.topPages.map((p) => p.views),
                      1,
                    );
                    const percentage = Math.round(
                      (page.views / maxViews) * 100,
                    );

                    return (
                      <div
                        key={page.page || index}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="max-w-xs truncate font-mono text-muted-foreground text-xs md:max-w-md">
                            {page.page || "/"}
                          </span>
                          <span className="shrink-0 rounded-md border bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground text-xs">
                            {page.views.toLocaleString()} views
                          </span>
                        </div>
                        {/* Relative Visual progress Bar */}
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Activity Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Recorded Event Types</CardTitle>
              <CardDescription>
                Detailed metrics of user interactions logged by the client
                tracker.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {!projectOverview.data.eventBreakdown ||
              projectOverview.data.eventBreakdown.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-6 text-center">
                  <Zap className="h-6 w-6 text-muted-foreground" />
                  <p className="font-medium text-muted-foreground text-xs">
                    No recorded events breakdown
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {projectOverview.data.eventBreakdown.map((item, idx) => (
                    <div
                      key={item.type || idx}
                      className="flex shrink-0 items-center gap-3 rounded-2xl border bg-secondary/20 p-4 transition-colors hover:bg-secondary/40"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-muted-foreground text-xs capitalize">
                          {item.type || "Pageviews"}
                        </span>
                        <span className="font-bold text-foreground text-lg tracking-tight">
                          {item.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
