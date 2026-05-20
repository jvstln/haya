"use client";
import { ArrowLeft, Information } from "iconsax-reactjs";
import {
  Activity,
  Calendar,
  Clock,
  Globe,
  Monitor,
  Smartphone,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { QueryState } from "@/components/query-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import type { Params } from "@/types";
import { useSession } from "../../project.hook";
import type { SessionEvent } from "../../project.type";

export const SessionDetailsPage = () => {
  const params =
    useParams<Params<"/dashboard/projects/[projectId]/sessions/[sessionId]">>();
  const [currentView, setCurrentView] = useState<"overview" | "events">(
    "overview",
  );
  const isMobile = useBreakpoint("max-md");

  const sessionQuery = useSession({ ...params });

  if (sessionQuery.isError) {
    return <QueryState query={sessionQuery} />;
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatEventTime = (event: SessionEvent, firstTimestamp: number) => {
    const relativeMs = event.timestamp - firstTimestamp;
    const secs = Math.round(relativeMs / 1000);
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `+${mins}:${remSecs < 10 ? "0" : ""}${remSecs}`;
  };

  const isMobileDevice = (userAgent: string, viewportWidth: number) =>
    userAgent.includes("iPhone") ||
    userAgent.includes("Android") ||
    viewportWidth < 768;

  return (
    <div className="flex flex-col gap-6 from-0% from-primary/20 via-transparent p-4 max-md:bg-linear-to-b">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <Button
          href={`/dashboard/projects/${params.projectId}/sessions`}
          size="sm"
          appearance="soft"
        >
          <ArrowLeft />
          Back to sessions
        </Button>

        {sessionQuery.data && (
          <>
            <span className="font-mono text-muted-foreground text-sm">
              Session {sessionQuery.data.session.sessionId.slice(0, 12)}…
            </span>

            <div className="ml-auto flex items-center gap-2">
              <Badge appearance="soft" color="primary">
                {sessionQuery.data.session.status}
              </Badge>
              <Badge
                appearance="outline"
                color={
                  isMobileDevice(
                    sessionQuery.data.session.userAgent,
                    sessionQuery.data.session.viewportWidth,
                  )
                    ? "warning"
                    : "info"
                }
              >
                {isMobileDevice(
                  sessionQuery.data.session.userAgent,
                  sessionQuery.data.session.viewportWidth,
                )
                  ? "Mobile"
                  : "Desktop"}
              </Badge>
            </div>
          </>
        )}
      </div>

      {/* Control to switch between overview and events view only on mobile */}
      <div
        className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-center p-4 backdrop-blur-2xs md:hidden"
        style={{
          background:
            "linear-gradient(to right, rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.9) 20% 80%, rgb(0 0 0 / 0.5))",
          boxShadow: "0px -10px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="mb-7 flex items-center justify-center gap-2 rounded-full bg-secondary p-2">
          <Button
            appearance={currentView === "overview" ? "solid" : "ghost"}
            className="rounded-full"
            onClick={() => setCurrentView("overview")}
          >
            Overview
          </Button>
          <Button
            appearance={currentView === "events" ? "solid" : "ghost"}
            className="rounded-full"
            onClick={() => setCurrentView("events")}
          >
            Event Log
          </Button>
        </div>
      </div>

      {/* Stats Summary Grid */}
      {sessionQuery.isPending ? (
        <div className="flex gap-4 *:grow">
          {Array.from({ length: 4 }).map((_, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Element uniqueness doesnt matter
            <Skeleton key={idx} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 *:grow">
          <Card className="basis-2/5">
            <CardHeader className="text-muted-foreground">
              Entry Page
            </CardHeader>
            <span className="truncate text-h3" title={sessionQuery.data.session.entryUrl}>
              {sessionQuery.data.session.entryUrl || "/"}
            </span>
          </Card>

          {[
            {
              label: "Duration",
              value: formatDuration(sessionQuery.data.session.duration),
              accent: "--color-primary",
              icon: Clock,
            },
            {
              label: "Page Views",
              value: sessionQuery.data.session.pageViewCount,
              accent: "--color-cyan",
              icon: Globe,
            },
            {
              label: "Events",
              value: sessionQuery.data.session.eventCount,
              accent: "--color-success",
              icon: Activity,
            },
          ].map((info) => (
            <Card key={info.label} className="basis-1/5">
              <div
                className="flex size-7 items-center justify-center rounded-md bg-current/10 p-1.25"
                style={{ color: `var(${info.accent})` }}
              >
                <info.icon className="size-4" />
              </div>
              <span className="text-h3">{info.value}</span>
              <span className="font-medium text-muted-foreground text-sm">
                {info.label}
              </span>
            </Card>
          ))}
        </div>
      )}

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Card: Session Overview */}
        <div className={cn(isMobile && currentView !== "overview" && "hidden")}>
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Session Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {sessionQuery.isPending ? (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Element uniqueness doesnt matter
                    <Skeleton key={idx} className="h-12" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Device Information */}
                  <div className="flex flex-col gap-3">
                    <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      Device Information
                    </span>
                    <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/20 p-4">
                      <div className="flex items-center gap-3">
                        {isMobileDevice(
                          sessionQuery.data.session.userAgent,
                          sessionQuery.data.session.viewportWidth,
                        ) ? (
                          <Smartphone className="size-5 text-primary" />
                        ) : (
                          <Monitor className="size-5 text-primary" />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm">
                            {isMobileDevice(
                              sessionQuery.data.session.userAgent,
                              sessionQuery.data.session.viewportWidth,
                            )
                              ? "Mobile Device"
                              : "Desktop Device"}
                          </span>
                          <span className="font-mono text-muted-foreground text-xs">
                            {sessionQuery.data.session.viewportWidth} ×{" "}
                            {sessionQuery.data.session.viewportHeight}
                          </span>
                        </div>
                      </div>
                      <span
                        className="truncate font-mono text-muted-foreground text-xs"
                        title={sessionQuery.data.session.userAgent}
                      >
                        {sessionQuery.data.session.userAgent}
                      </span>
                    </div>
                  </div>

                  {/* Timing Details */}
                  <div className="flex flex-col gap-3">
                    <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      Timing
                    </span>
                    <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/20 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Started
                        </span>
                        <span className="font-medium text-foreground text-sm">
                          {new Date(
                            sessionQuery.data.session.startTime,
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Duration
                        </span>
                        <span className="font-mono font-medium text-foreground text-sm">
                          {formatDuration(sessionQuery.data.session.duration)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">
                          Created
                        </span>
                        <span className="font-medium text-foreground text-sm">
                          {new Date(
                            sessionQuery.data.session.createdAt,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Session Metadata */}
                  <div className="flex flex-col gap-3">
                    <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      Identifiers
                    </span>
                    <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/20 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground text-sm">
                          Session ID
                        </span>
                        <span className="max-w-[200px] truncate font-mono text-foreground text-xs" title={sessionQuery.data.session.sessionId}>
                          {sessionQuery.data.session.sessionId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground text-sm">
                          Device ID
                        </span>
                        <span className="max-w-[200px] truncate font-mono text-foreground text-xs" title={sessionQuery.data.session.deviceId}>
                          {sessionQuery.data.session.deviceId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-muted-foreground text-sm">
                          Status
                        </span>
                        <Badge appearance="soft" color="primary" size="sm">
                          {sessionQuery.data.session.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Card: Event Timeline */}
        <div className={cn(isMobile && currentView !== "events" && "hidden")}>
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
              {sessionQuery.data && (
                <span className="text-muted-foreground text-sm">
                  {sessionQuery.data.events.length} event
                  {sessionQuery.data.events.length !== 1 ? "s" : ""} recorded
                </span>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-[800px] pr-4">
                {sessionQuery.isPending ? (
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: Element uniqueness doesnt matter
                      <Skeleton key={idx} className="h-16" />
                    ))}
                  </div>
                ) : sessionQuery.data.events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Calendar className="mb-3 size-10 text-muted-foreground/40" />
                    <span className="font-medium text-muted-foreground text-sm">
                      No events recorded for this session
                    </span>
                  </div>
                ) : (
                  <div className="relative ml-2 flex flex-col gap-1 border-border/40 border-l pl-4">
                    {sessionQuery.data.events.map((event, idx) => {
                      const firstTimestamp =
                        sessionQuery.data.events[0].timestamp;
                      return (
                        <div
                          key={event._id}
                          className="relative flex flex-col gap-1 rounded-lg p-3 transition-colors hover:bg-muted/30"
                        >
                          {/* Timeline dot */}
                          <div className="absolute -left-[21.5px] top-5 size-2 rounded-full border border-border bg-muted" />

                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                              {event.type}
                            </span>
                            <span className="font-mono text-muted-foreground text-[10px]">
                              {formatEventTime(event, firstTimestamp)}
                            </span>
                          </div>

                          {event.pageUrl && (
                            <span
                              className="truncate font-mono text-muted-foreground text-[11px]"
                              title={event.pageUrl}
                            >
                              {event.pageUrl}
                            </span>
                          )}

                          {event.type === "pageview" && event.payload?.url && (
                            <span className="truncate font-mono text-primary/70 text-[11px]">
                              → {event.payload.url}
                            </span>
                          )}

                          {event.payload?.referrer && (
                            <span className="truncate text-muted-foreground text-[10px]">
                              from: {event.payload.referrer}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
