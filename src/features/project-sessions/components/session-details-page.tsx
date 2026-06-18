"use client";

import { ArrowLeft } from "iconsax-reactjs";
import {
  Activity,
  Calendar,
  Clock,
  Globe,
  Monitor,
  Smartphone,
} from "lucide-react";
import { useParams } from "next/navigation";
import { DashboardSummaryCard } from "@/components/dashboard-ui";
import { QueryState } from "@/components/query-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveStatusColor } from "@/lib/color.util";
import {
  formatDuration,
  formatRelativeTime,
  formatShortDateTime,
} from "@/lib/date.util";
import { cn, getPlaceholderArrays, isMobileDevice } from "@/lib/utils";
import type { Params } from "@/types";
import { RrwebReplay } from "../../../components/rrweb-replay";
import { useSession } from "../project-session.hook";

export const SessionDetailsPage = () => {
  const params =
    useParams<Params<"/dashboard/projects/[projectId]/sessions/[sessionId]">>();

  const sessionQuery = useSession({ ...params });

  if (sessionQuery.isError) {
    return <QueryState query={sessionQuery} />;
  }

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
              <Badge
                appearance="soft"
                color={resolveStatusColor(sessionQuery.data.session.status)}
              >
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

      {/* Stats Summary Grid */}
      <div className="flex gap-4 *:grow">
        <DashboardSummaryCard
          className="basis-2/5"
          title="Entry Page"
          value={sessionQuery.data?.session.entryUrl || "/"}
          isLoading={sessionQuery.isPending}
        />

        {[
          {
            label: "Duration",
            value: formatDuration(sessionQuery.data?.session.duration || 0),
            className:
              "[--bg:var(--color-primary)] [--fg:var(--color-primary-foreground)]",
            icon: Clock,
          },
          {
            label: "Page Views",
            value: sessionQuery.data?.session.pageViewCount,
            className:
              "[--bg:var(--color-cyan)] [--fg:var(--color-cyan-foreground)]",
            icon: Globe,
          },
          {
            label: "Events",
            value: sessionQuery.data?.session.eventCount,
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
            isLoading={sessionQuery.isPending}
          />
        ))}
      </div>

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Replay Player */}
        <div className="flex min-w-0 flex-col lg:col-span-8">
          <RrwebReplay replayUrl={sessionQuery.data?.session.replayUrl} />
        </div>

        {/* Right Column: Tabbed Info & Events */}
        <Card className="flex h-full min-h-[600px] flex-col lg:col-span-4 lg:h-[700px]">
          <QueryState
            query={sessionQuery}
            getIsLoading={(query) =>
              query.isPending && (
                <div className="flex flex-col gap-4 p-6">
                  {getPlaceholderArrays(6).map(({ id }) => (
                    <Skeleton key={id} className="h-12 w-full" />
                  ))}
                </div>
              )
            }
          >
            {(sessionQuery) => (
              <Tabs
                defaultValue="overview"
                className="flex h-full min-h-0 flex-col"
              >
                <CardHeader className="border-border/40 border-b pb-4">
                  <CardTitle className="mb-4 text-base">
                    Session Details
                  </CardTitle>
                  <TabsList className="flex w-full rounded-lg bg-secondary/10 p-1">
                    {[
                      { label: "Overview", value: "overview" },
                      {
                        label: `Events (${sessionQuery.data.events.length})`,
                        value: "events",
                      },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="flex-1"
                        render={(props, state) => (
                          <Button
                            {...props}
                            appearance={state.active ? "solid" : "ghost"}
                            color="secondary"
                            size="sm"
                          />
                        )}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </CardHeader>
                <CardContent className="min-h-0 flex-1 overflow-hidden pt-6">
                  <TabsContent
                    value="overview"
                    className="h-full overflow-y-auto pr-1"
                  >
                    <div className="flex flex-col gap-6">
                      {/* Device Information */}
                      <OverviewSection title="Device Information">
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
                      </OverviewSection>
                      {/* Timing Details */}
                      <OverviewSection title="Timing">
                        <DetailRow
                          label="Started"
                          value={formatShortDateTime(
                            sessionQuery.data.session.startTime,
                          )}
                        />
                        <DetailRow
                          label="Duration"
                          value={formatDuration(
                            sessionQuery.data.session.duration,
                          )}
                          mono
                        />
                        <DetailRow
                          label="Created"
                          value={formatShortDateTime(
                            sessionQuery.data.session.createdAt,
                          )}
                        />
                      </OverviewSection>
                      {/* Session Metadata */}
                      <OverviewSection title="Identifiers">
                        <DetailRow
                          label="Session ID"
                          value={sessionQuery.data.session.sessionId}
                          truncate
                        />
                        <DetailRow
                          label="Device ID"
                          value={sessionQuery.data.session.deviceId}
                          truncate
                        />
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground text-sm">
                            Status
                          </span>
                          <Badge
                            appearance="soft"
                            color={resolveStatusColor(
                              sessionQuery.data.session.status,
                            )}
                            size="sm"
                          >
                            {sessionQuery.data.session.status}
                          </Badge>
                        </div>
                      </OverviewSection>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="events"
                    className="flex h-full min-h-0 flex-col"
                  >
                    <ScrollArea className="flex-1 pr-4">
                      {sessionQuery.data.events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <Calendar className="mb-3 size-10 text-muted-foreground/40" />
                          <span className="font-medium text-muted-foreground text-sm">
                            No events recorded for this session
                          </span>
                        </div>
                      ) : (
                        <div className="relative ml-2 flex flex-col gap-1 border-border/40 border-l pl-4">
                          {sessionQuery.data.events.map((event) => {
                            const firstTimestamp =
                              sessionQuery.data.events[0].timestamp;
                            return (
                              <div
                                key={event._id}
                                className="relative flex flex-col gap-1 rounded-lg p-3 transition-colors hover:bg-muted/30"
                              >
                                {/* Timeline dot */}
                                <div className="-left-[21.5px] absolute top-5 size-2 rounded-full border border-border bg-muted" />
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                                    {event.type}
                                  </span>
                                  <span className="font-mono text-[10px] text-muted-foreground">
                                    {formatRelativeTime(
                                      event.timestamp - firstTimestamp,
                                    )}
                                  </span>
                                </div>
                                {event.pageUrl && (
                                  <span
                                    className="truncate font-mono text-[11px] text-muted-foreground"
                                    title={event.pageUrl}
                                  >
                                    {event.pageUrl}
                                  </span>
                                )}
                                {event.type === "pageview" &&
                                  event.payload?.url && (
                                    <span className="truncate font-mono text-[11px] text-primary/70">
                                      → {event.payload.url}
                                    </span>
                                  )}
                                {event.payload?.referrer && (
                                  <span className="truncate text-[10px] text-muted-foreground">
                                    from: {event.payload.referrer}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </CardContent>
              </Tabs>
            )}
          </QueryState>
        </Card>
      </div>
    </div>
  );
};

// ─── Sub-components ─────────────────────────────────────────────────

/** A titled group of fields inside the overview card. */
const OverviewSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3">
    <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
      {title}
    </span>
    <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-muted/20 p-4">
      {children}
    </div>
  </div>
);

/** A single label-value row used in overview sections. */
const DetailRow = ({
  label,
  value,
  mono,
  truncate,
}: {
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span
      className={cn(
        "font-medium text-foreground text-sm",
        mono && "font-mono",
        truncate && "max-w-[200px] truncate font-mono text-xs",
      )}
      title={truncate ? value : undefined}
    >
      {value}
    </span>
  </div>
);
