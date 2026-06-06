"use client";

import {
  Activity,
  ArrowLeft,
  Calendar,
  Clock,
  Flame,
  Monitor,
  MousePointer,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Target,
  Terminal,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardSlot, DashboardTitle } from "@/components/dashboard-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/features/projects/project.session.hook";
import { cn } from "@/lib/utils";

export default function SessionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = String(params.projectId);
  const sessionId = String(params.sessionId);

  const sessionQuery = useSession({ projectId, sessionId });

  // Replay Simulator states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0); // 0 to 100
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1, 1.5, 2
  const [activeUrl, setActiveUrl] = useState("/");

  const session = sessionQuery.data?.session;
  const events = sessionQuery.data?.events || [];

  // Initialize active url
  useEffect(() => {
    if (session?.entryUrl) {
      setActiveUrl(session.entryUrl);
    }
  }, [session]);

  // Simulate playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayhead((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          // Increment playhead based on session duration & speed
          const duration = session?.duration || 60;
          const step = (100 / duration) * playbackSpeed;
          return Math.min(prev + step, 100);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, session?.duration]);

  // Get active event based on current playhead
  const currentEventIndex = useMemo(() => {
    if (!events.length || !session?.duration) return -1;
    const currentTimeSec = (playhead / 100) * session.duration;

    // Find highest index of event that occurred before or at currentTimeSec
    let activeIdx = -1;
    for (let i = 0; i < events.length; i++) {
      const eventTimeSec = (events[i].timestamp - events[0].timestamp) / 1000;
      if (eventTimeSec <= currentTimeSec) {
        activeIdx = i;
      } else {
        break;
      }
    }
    return activeIdx;
  }, [events, playhead, session?.duration]);

  // Update active URL from active event
  useEffect(() => {
    if (currentEventIndex >= 0 && events[currentEventIndex]) {
      const event = events[currentEventIndex];
      if (event.type === "pageview" && event.payload?.url) {
        setActiveUrl(event.payload.url);
      } else if (event.pageUrl) {
        setActiveUrl(event.pageUrl);
      }
    }
  }, [currentEventIndex, events]);

  const handleSeek = (percentage: number) => {
    setPlayhead(percentage);
  };

  const handleEventClick = (eventTimeMs: number) => {
    if (!session?.duration || !events.length) return;
    const relativeTimeSec = (eventTimeMs - events[0].timestamp) / 1000;
    const percentage = Math.min(
      (relativeTimeSec / session.duration) * 100,
      100,
    );
    setPlayhead(percentage);
    setIsPlaying(true);
    toast.success(`Seeked to event: ${Math.round(relativeTimeSec)}s`);
  };

  const formattedTime = useMemo(() => {
    if (!session?.duration) return "0:00";
    const currentSecs = Math.round((playhead / 100) * session.duration);
    const mins = Math.floor(currentSecs / 60);
    const secs = currentSecs % 60;

    const totalMins = Math.floor(session.duration / 60);
    const totalSecs = session.duration % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs} / ${totalMins}:${totalSecs < 10 ? "0" : ""}${totalSecs}`;
  }, [playhead, session?.duration]);

  if (sessionQuery.isPending) {
    return (
      <DashboardSlot>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex gap-4 *:grow">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[500px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </DashboardSlot>
    );
  }

  if (sessionQuery.isError || !session) {
    return (
      <DashboardSlot>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="mb-2 font-bold text-destructive">
            Error loading session
          </span>
          <span className="text-muted-foreground text-sm">
            Please try again later.
          </span>
          <Button
            href={`/dashboard/projects/${projectId}/sessions`}
            className="mt-4"
            appearance="outline"
          >
            Back to Sessions
          </Button>
        </div>
      </DashboardSlot>
    );
  }

  const isMobileSession =
    session.userAgent?.includes("iPhone") ||
    session.userAgent?.includes("Android") ||
    session.viewportWidth < 768;

  return (
    <DashboardSlot>
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-border/40 border-b pb-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <Button
            href={`/dashboard/projects/${projectId}/sessions`}
            size="sm"
            appearance="soft"
            color="secondary"
            className="rounded-full"
          >
            <ArrowLeft className="mr-1 size-4" />
            Back to Sessions
          </Button>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white">
              Session Replay: {session.sessionId.slice(0, 8)}...
            </span>
            <span className="font-mono text-muted-foreground text-xs">
              ID: {session.sessionId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            appearance="outline"
            color={isMobileSession ? "warning" : "primary"}
          >
            <Monitor className="mr-1 size-3" />
            {isMobileSession ? "Mobile" : "Desktop"} ({session.viewportWidth}x
            {session.viewportHeight})
          </Badge>
          <Badge appearance="solid" color="success">
            Active Status: {session.status}
          </Badge>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Entry Page</span>
            <Monitor className="size-4" />
          </div>
          <span
            className="mt-2 block truncate font-mono font-semibold text-foreground text-sm"
            title={session.entryUrl}
          >
            {session.entryUrl || "/"}
          </span>
        </Card>

        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Activity Count</span>
            <Activity className="size-4" />
          </div>
          <span className="mt-2 block font-bold text-foreground text-lg">
            {session.pageViewCount} pageviews / {session.eventCount} events
          </span>
        </Card>

        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Session Started</span>
            <Calendar className="size-4" />
          </div>
          <span className="mt-2 block font-semibold text-foreground text-sm">
            {new Date(session.createdAt).toLocaleString()}
          </span>
        </Card>

        <Card className="flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Session Duration</span>
            <Clock className="size-4" />
          </div>
          <span className="mt-2 block font-bold text-foreground text-lg">
            {Math.floor(session.duration / 60)}m {session.duration % 60}s
          </span>
        </Card>
      </div>

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Replay Simulator */}
        <Card className="flex min-h-[500px] flex-col lg:col-span-8">
          <CardHeader className="border-border/40 border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-semibold text-base text-white">
                Interactive Screen Recording Replay
              </CardTitle>
              <Badge
                appearance="soft"
                color="colorful"
                className="font-mono text-xs"
              >
                Simulated Player v1.0
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex grow flex-col bg-muted/20 p-4">
            {/* Mock Browser/Device Container */}
            <div className="relative flex grow items-center justify-center rounded-xl border border-border/40 bg-zinc-950 p-6 shadow-inner">
              {/* Screen Frame */}
              <div
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl transition-all duration-300",
                  isMobileSession
                    ? "h-[500px] w-[300px]"
                    : "h-[400px] w-full max-w-[800px]",
                )}
              >
                {/* Browser Address Bar */}
                <div className="flex items-center gap-2 border-zinc-800 border-b bg-zinc-950 px-3 py-2">
                  <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-500/80" />
                    <span className="size-2.5 rounded-full bg-yellow-500/80" />
                    <span className="size-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex grow justify-center">
                    <div className="flex w-full max-w-md select-all items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-[10px] text-zinc-400">
                      <span className="truncate">{activeUrl}</span>
                      <Sparkles className="ml-2 size-3 shrink-0 animate-pulse text-primary" />
                    </div>
                  </div>
                </div>

                {/* Simulated Web View Page Canvas */}
                <div className="relative flex grow flex-col items-center justify-center bg-zinc-950 p-4 text-center">
                  {/* Grid background to look cool */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

                  <div className="z-10 flex flex-col items-center gap-3">
                    <Monitor className="size-12 animate-pulse text-primary/40" />
                    <span className="font-bold text-sm text-white">
                      {isPlaying
                        ? "Simulating Mouse & Scroll Events..."
                        : "Replay Simulation Paused"}
                    </span>
                    <span className="max-w-md font-medium text-xs text-zinc-500">
                      Active Action:{" "}
                      {currentEventIndex >= 0 && events[currentEventIndex] ? (
                        <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-primary">
                          {events[currentEventIndex].type} on {activeUrl}
                        </span>
                      ) : (
                        "Awaiting playback start"
                      )}
                    </span>
                  </div>

                  {/* Simulated Cursor trailing mouse clicks */}
                  {isPlaying && currentEventIndex >= 0 && (
                    <div
                      className="pointer-events-none absolute z-20 flex flex-col items-center transition-all duration-700 ease-in-out"
                      style={{
                        top: `${20 + ((currentEventIndex * 7) % 60)}%`,
                        left: `${15 + ((currentEventIndex * 11) % 70)}%`,
                      }}
                    >
                      <MousePointer className="size-5 animate-bounce fill-primary text-primary drop-shadow-md" />
                      <div className="-top-1.5 -left-1.5 absolute size-8 animate-ping rounded-full border border-primary bg-primary/20" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Player Playback Control Bar */}
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border/40 bg-card p-4">
              {/* Playhead Seek Slider */}
              <div className="flex items-center gap-4">
                <span className="select-none font-mono text-muted-foreground text-xs">
                  {formattedTime}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={playhead}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="h-1.5 grow cursor-pointer rounded-lg bg-zinc-800 accent-primary outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    size="sm"
                    appearance="solid"
                    color="primary"
                    className="flex size-9 items-center justify-center rounded-full p-0"
                  >
                    {isPlaying ? (
                      <Pause className="size-4.5" />
                    ) : (
                      <Play className="size-4.5 translate-x-0.5" />
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setPlayhead(0);
                      setIsPlaying(false);
                    }}
                    size="sm"
                    appearance="ghost"
                    color="secondary"
                    className="flex size-9 items-center justify-center rounded-full p-0"
                    title="Reset Replay"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                </div>

                {/* Playback speed switcher */}
                <div className="flex select-none rounded-lg bg-secondary/30 p-1">
                  {[1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setPlaybackSpeed(speed)}
                      className={cn(
                        "rounded-md px-2.5 py-1 font-semibold text-xs transition-all",
                        playbackSpeed === speed
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Event Timeline Logs */}
        <Card className="flex h-[600px] flex-col lg:col-span-4 lg:h-auto">
          <CardHeader className="border-border/40 border-b pb-4">
            <CardTitle className="flex items-center gap-2 font-semibold text-base text-white">
              <Terminal className="size-4.5 text-primary" />
              Event Timeline Log
            </CardTitle>
          </CardHeader>
          <CardContent className="flex grow flex-col overflow-hidden p-0">
            <ScrollArea className="grow p-4">
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground text-xs">
                  <span>No events tracked for this session.</span>
                </div>
              ) : (
                <div className="relative ml-2 flex flex-col gap-6 border-zinc-800 border-l py-2 pl-4">
                  {events.map((event, idx) => {
                    const relativeTimeMs =
                      event.timestamp - events[0].timestamp;
                    const secs = Math.round(relativeTimeMs / 1000);
                    const formattedRelativeTime = `${Math.floor(secs / 60)}m ${secs % 60}s`;
                    const isActive = idx === currentEventIndex;

                    return (
                      <button
                        key={event._id || idx}
                        type="button"
                        onClick={() => handleEventClick(event.timestamp)}
                        className={cn(
                          "relative flex w-full cursor-pointer flex-col gap-1 rounded-lg border p-2.5 text-left text-xs transition-all",
                          isActive
                            ? "border-primary/30 bg-primary/10 text-white shadow-sm ring-1 ring-primary/20"
                            : "border-transparent bg-transparent text-muted-foreground hover:bg-secondary/20 hover:text-foreground",
                        )}
                      >
                        {/* Timeline Node dot */}
                        <div
                          className={cn(
                            "-left-[21.5px] absolute top-4.5 size-2 rounded-full border transition-all duration-300",
                            isActive
                              ? "scale-125 border-primary bg-primary"
                              : "border-zinc-700 bg-zinc-950",
                          )}
                        />

                        {/* Title & relative timestamp */}
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "font-bold text-[10px] uppercase tracking-wider",
                              isActive ? "text-primary" : "text-zinc-400",
                            )}
                          >
                            {event.type}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500">
                            +{formattedRelativeTime}
                          </span>
                        </div>

                        {/* Action parameters */}
                        {event.type === "pageview" && event.payload?.url && (
                          <span className="truncate font-mono text-[10px] text-zinc-400">
                            Navigated: {event.payload.url}
                          </span>
                        )}
                        {event.pageUrl && (
                          <span className="truncate font-mono text-[10px] text-zinc-500">
                            URL: {event.pageUrl}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardSlot>
  );
}
