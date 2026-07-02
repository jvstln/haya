import { Replayer } from "@rrweb/replay";
import "@rrweb/replay/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import z from "zod";
import { QueryState } from "@/components/query-states";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api, getErrorMessage } from "@/lib/api";
import { formatTimestamp } from "@/lib/date.util";
import { cn, isEmpty } from "@/lib/utils";

// ─── Constants ──────────────────────────────────────────────────────
const SPEED_OPTIONS = [1, 2, 4, 8] as const;
const SKIP_SECONDS = 5;
const PROGRESS_POLL_MS = 100;

// ─── Types ──────────────────────────────────────────────────────────
export type RrwebReplayProps = {
  replayUrl?: string | null;
};

// ─── Component ──────────────────────────────────────────────────────
export function RrwebReplay({ replayUrl }: RrwebReplayProps) {
  // Refs
  const outerRef = useRef<HTMLDivElement>(null);
  const replayerRef = useRef<Replayer | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // State
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  // const events = useSessionReplayEvents(replayUrl);
  const events = useQuery({
    queryKey: ["rrwebReplay", replayUrl],
    queryFn: async () => {
      if (!replayUrl) return;

      const response = await api.get<string>(replayUrl, {
        headers: { "Content-Type": "application/json" },
      });

      // Events is multiple JSON string separated with new lines (NDJSON)
      const parsedEvents = response.data
        .split(/\n/)
        .filter(Boolean)
        .map((ev) => JSON.parse(ev));

      const eventsSchema = z.array(z.any());
      return eventsSchema.parse(parsedEvents);
    },
    enabled: !!replayUrl,
  });

  // ── Progress polling ────────────────────────────────────────────
  const stopProgressPolling = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const startProgressPolling = useCallback(() => {
    stopProgressPolling();
    progressTimerRef.current = setInterval(() => {
      if (replayerRef.current) {
        setCurrentTime(replayerRef.current.getCurrentTime());
      }
    }, PROGRESS_POLL_MS);
  }, [stopProgressPolling]);

  // ── Initialize replayer ─────────────────────────────────────────
  useEffect(() => {
    let destroyed = false;

    const load = () => {
      try {
        if (destroyed || !outerRef.current || !events.data) return;

        // Read the recorded viewport from the FullSnapshot (rrweb type 2)
        const snapshot = events.data.find(
          (e) =>
            ("type" in e && e.type === 2) || (e?.data?.width && e.data.height),
        );

        const recordedWidth = snapshot?.data?.width || 1280;
        const recordedHeight = snapshot?.data?.height || 800;

        // Scale to fit the available container width
        const containerWidth = outerRef.current.clientWidth || recordedWidth;
        const scale = Math.min(1, containerWidth / recordedWidth);

        // Outer div: visible (scaled) dimensions, clips overflow
        outerRef.current.style.height = `${recordedHeight * scale}px`;
        outerRef.current.style.overflow = "hidden";
        outerRef.current.style.position = "relative";

        // Inner div: full recorded size, scaled down via CSS transform
        const inner = document.createElement("div");
        inner.style.width = `${recordedWidth}px`;
        inner.style.height = `${recordedHeight}px`;
        inner.style.transformOrigin = "top left";
        inner.style.transform = `scale(${scale})`;
        outerRef.current.appendChild(inner);

        const replayer = new Replayer(events.data, {
          root: inner,
          skipInactive: true,
          showWarning: false,
          mouseTail: true,
        });

        replayerRef.current = replayer;

        // Read total duration
        const meta = replayer.getMetaData();
        setTotalTime(meta.totalTime);

        // Listen for events
        replayer.on("start", () => {
          setPlaying(true);
        });
        replayer.on("pause", () => {
          setPlaying(false);
        });
        replayer.on("finish", () => {
          setPlaying(false);
          stopProgressPolling();
          setCurrentTime(meta.totalTime);
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      destroyed = true;
      stopProgressPolling();
      replayerRef.current?.destroy?.();
      replayerRef.current = null;
      if (outerRef.current) outerRef.current.innerHTML = "";
    };
  }, [events.data, stopProgressPolling]);

  // ── Playback controls ───────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    if (!replayerRef.current) return;
    if (playing) {
      replayerRef.current.pause();
      stopProgressPolling();
    } else {
      // If replay finished, restart from beginning
      if (currentTime >= totalTime && totalTime > 0) {
        replayerRef.current.play(0);
      } else {
        replayerRef.current.play(currentTime);
      }
      startProgressPolling();
    }
  }, [
    playing,
    currentTime,
    totalTime,
    startProgressPolling,
    stopProgressPolling,
  ]);

  const handleRestart = useCallback(() => {
    if (!replayerRef.current) return;
    replayerRef.current.play(0);
    setCurrentTime(0);
    startProgressPolling();
  }, [startProgressPolling]);

  const handleSkipBack = useCallback(() => {
    if (!replayerRef.current) return;
    const newTime = Math.max(0, currentTime - SKIP_SECONDS * 1000);
    const wasPlaying = playing;
    replayerRef.current.play(newTime);
    setCurrentTime(newTime);
    if (!wasPlaying) {
      replayerRef.current.pause(newTime);
      stopProgressPolling();
    } else {
      startProgressPolling();
    }
  }, [currentTime, playing, startProgressPolling, stopProgressPolling]);

  const handleSkipForward = useCallback(() => {
    if (!replayerRef.current) return;
    const newTime = Math.min(totalTime, currentTime + SKIP_SECONDS * 1000);
    const wasPlaying = playing;
    replayerRef.current.play(newTime);
    setCurrentTime(newTime);
    if (!wasPlaying) {
      replayerRef.current.pause(newTime);
      stopProgressPolling();
    } else {
      startProgressPolling();
    }
  }, [
    currentTime,
    totalTime,
    playing,
    startProgressPolling,
    stopProgressPolling,
  ]);

  const handleSpeedChange = useCallback(() => {
    const currentIndex = SPEED_OPTIONS.indexOf(
      speed as (typeof SPEED_OPTIONS)[number],
    );
    const nextSpeed = SPEED_OPTIONS[(currentIndex + 1) % SPEED_OPTIONS.length];
    setSpeed(nextSpeed);
    replayerRef.current?.setConfig({ speed: nextSpeed });
  }, [speed]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!replayerRef.current || totalTime === 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      const newTime = Math.floor(ratio * totalTime);
      const wasPlaying = playing;

      replayerRef.current.play(newTime);
      setCurrentTime(newTime);

      if (!wasPlaying) {
        // Use requestAnimationFrame to let rrweb flush its internal state
        requestAnimationFrame(() => {
          replayerRef.current?.pause(newTime);
        });
        stopProgressPolling();
      } else {
        startProgressPolling();
      }
    },
    [totalTime, playing, startProgressPolling, stopProgressPolling],
  );

  const handleSeekHover = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSeeking) return;
      handleSeek(e);
    },
    [isSeeking, handleSeek],
  );

  const handleFullscreen = useCallback(() => {
    const container = outerRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // ── Progress ratio ──────────────────────────────────────────────
  const progress = totalTime > 0 ? Math.min(1, currentTime / totalTime) : 0;

  // ── Empty state ─────────────────────────────────────────────────
  if (!replayUrl || isEmpty(events.data)) {
    return (
      <Card>
        <QueryState
          query={{ data: {} }}
          getIsEmpty={(query) => ({
            query,
            title: "Replay not available",
            description: !replayUrl
              ? "There is no session recording replay associated with this persona."
              : "The session recording file was empty or could not be loaded.",
            cta: null,
          })}
        />
      </Card>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (error || events.isError) {
    return (
      <QueryState
        query={events}
        getIsError={(events) => getErrorMessage(events.error)}
      />
    );
  }

  // ── Loading state ───────────────────────────────────────────────
  if (events.isPending) {
    return (
      <Card className="overflow-hidden">
        <Skeleton className="aspect-video w-full" />
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-2 grow rounded-full" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-secondary bg-card p-0">
      {/* ─── Replay viewport ─────────────────────────────────────── */}
      <div className="group/replay relative bg-neutral-950">
        <div
          ref={outerRef}
          className="w-full"
          style={{ background: "#0a0a0a" }}
        />

        {/* Centered play overlay (shown when paused) */}
        {!playing && !loading && (
          <button
            type="button"
            onClick={handlePlayPause}
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover/replay:opacity-100"
          >
            <span
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full hover:scale-110",
              )}
            >
              <Play />
            </span>
          </button>
        )}
      </div>

      {/* ─── Controls bar ──────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 px-3 pt-2 pb-3">
        {/* Timeline / Seek bar */}
        <div
          className="group/seek relative flex h-5 cursor-pointer items-center"
          onMouseDown={(e) => {
            setIsSeeking(true);
            handleSeek(e);
          }}
          onMouseMove={handleSeekHover}
          onMouseUp={() => setIsSeeking(false)}
          onMouseLeave={() => setIsSeeking(false)}
          role="slider"
          aria-label="Seek timeline"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") handleSkipForward();
            if (e.key === "ArrowLeft") handleSkipBack();
          }}
        >
          {/* Track background */}
          <div className="absolute inset-x-0 h-1 rounded-full bg-secondary transition-all group-hover/seek:h-1.5" />
          {/* Buffered / progress fill */}
          <div
            className="absolute left-0 h-1 rounded-full bg-primary transition-all group-hover/seek:h-1.5"
            style={{ width: `${progress * 100}%` }}
          />
          {/* Thumb */}
          <div
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-3 scale-0 rounded-full bg-primary shadow-md transition-transform group-hover/seek:scale-100"
            style={{ left: `${progress * 100}%` }}
          />
        </div>

        {/* Button controls row */}
        <div className="flex items-center gap-1">
          {/* Left: Playback controls */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon-sm"
                    appearance="ghost"
                    color="secondary"
                    onClick={handleRestart}
                  />
                }
              >
                <RotateCcw className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>Restart</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon-sm"
                    appearance="ghost"
                    color="secondary"
                    onClick={handleSkipBack}
                  />
                }
              >
                <SkipBack className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>Back {SKIP_SECONDS}s</TooltipContent>
            </Tooltip>

            <Button
              size="icon-sm"
              appearance="solid"
              onClick={handlePlayPause}
              className="rounded-full"
            >
              {playing ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4 translate-x-px" />
              )}
            </Button>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon-sm"
                    appearance="ghost"
                    color="secondary"
                    onClick={handleSkipForward}
                  />
                }
              >
                <SkipForward className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>Forward {SKIP_SECONDS}s</TooltipContent>
            </Tooltip>
          </div>

          {/* Center: Time display */}
          <span className="ml-2 select-none font-mono text-muted-foreground text-xs tabular-nums">
            {formatTimestamp(currentTime)}
            <span className="mx-1 text-muted-foreground/50">/</span>
            {formatTimestamp(totalTime)}
          </span>

          {/* Right: Speed + Fullscreen */}
          <div className="ml-auto flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="sm"
                    appearance="ghost"
                    color="secondary"
                    onClick={handleSpeedChange}
                    className="min-w-10 font-mono tabular-nums"
                  />
                }
              >
                {speed}x
              </TooltipTrigger>
              <TooltipContent>Playback speed</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon-sm"
                    appearance="ghost"
                    color="secondary"
                    onClick={handleFullscreen}
                  />
                }
              >
                {isFullscreen ? (
                  <Minimize className="size-3.5" />
                ) : (
                  <Maximize className="size-3.5" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
}
