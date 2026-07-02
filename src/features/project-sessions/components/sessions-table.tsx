"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Play } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { QueryState } from "@/components/query-states";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable, useDataTable } from "@/components/ui/table/data-table";
import { formatDuration, formatShortDateTime } from "@/lib/date.util";
import {
  getPlaceholderArrays,
  isMobileDevice,
  stringToHashedNumber,
} from "@/lib/utils";
import type { useSessions } from "../project-session.hook";
import type { Session } from "../project-session.type";

interface SessionsTableProps {
  sessions: ReturnType<typeof useSessions>;
}

const columnHelper = createColumnHelper<Session>();

export const SessionsTable = ({
  sessions,
  // search = "",
  // projectId,
}: SessionsTableProps) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row, {
        id: "sessionReplay",
        header: "Session Replay",
        cell: (info) => {
          const session = info.getValue();
          return (
            <Link
              href={`/dashboard/projects/${session.projectId}/sessions/${session.sessionId}`}
              className="group relative flex h-11 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border/40"
              style={{
                background: `hsl(${stringToHashedNumber(session.sessionId)} 80 20)`,
              }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-secondary/50 to-muted opacity-60" />
              <div className="z-10 flex size-7 items-center justify-center rounded-full bg-primary/10 backdrop-blur-xs transition-transform group-hover:scale-110 group-hover:bg-primary/20">
                <Play className="size-3.5 translate-x-0.5 fill-primary text-foreground" />
              </div>
            </Link>
          );
        },
      }),
      // columnHelper.accessor((row) => row, {
      //   id: "personaClass",
      //   header: "User Persona",
      //   cell: (info) => {
      //     const session = info.getValue();
      //     const persona = getPersonaClass(session);
      //     return (
      //       <span className={cn("font-medium", persona.color)}>
      //         {persona.name}
      //       </span>
      //     );
      //   },
      // }),
      columnHelper.accessor((row) => row.entryUrl, {
        id: "entryUrl",
        header: "Entry Page",
        cell: (info) => {
          const url = info.getValue() || "/";
          return (
            <span
              className="block max-w-[150px] truncate font-mono text-muted-foreground text-xs"
              title={url}
            >
              {url}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row, {
        id: "activity",
        header: "Activity",
        cell: (info) => {
          const { pageViewCount, eventCount } = info.getValue();
          return (
            <span className="text-muted-foreground text-xs">
              {pageViewCount} view{pageViewCount !== 1 ? "s" : ""} ({eventCount}{" "}
              event{eventCount !== 1 ? "s" : ""})
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row.duration, {
        id: "duration",
        header: "Duration",
        cell: (info) => {
          return (
            <span className="font-mono text-muted-foreground">
              {formatDuration(info.getValue())}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row, {
        id: "device",
        header: "Device / Viewport",
        cell: (info) => {
          const { userAgent, viewportWidth, viewportHeight } = info.getValue();
          const isMobile = isMobileDevice(userAgent, viewportWidth);
          return (
            <div className="flex flex-col gap-0.5 text-muted-foreground text-xs">
              <span className="max-w-[120px] truncate" title={userAgent}>
                {isMobile ? "Mobile" : "Desktop"}
              </span>
              <span className="font-mono text-[10px]">
                {viewportWidth} × {viewportHeight}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => row.createdAt, {
        id: "createdAt",
        header: "Time",
        cell: (info) => {
          return (
            <span className="text-muted-foreground text-xs">
              {formatShortDateTime(info.getValue())}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row, {
        id: "severity",
        header: "Friction Level",
        cell: () => {
          return (
            <Badge color="success" appearance="outline">
              OK
            </Badge>
          );
        },
      }),
    ],
    [],
  );

  const table = useDataTable({
    data: sessions.data?.sessions ?? [],
    columns,
  });

  if (sessions.isPending) {
    return (
      <div className="space-y-3 pt-4">
        {getPlaceholderArrays(5).map(({ id }) => (
          <Skeleton key={id} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <QueryState
      query={sessions}
      getIsEmpty={(sessions) =>
        sessions.data.sessions.length === 0 && "No sessions found"
      }
    >
      {() => (
        <DataTable
          table={table}
          // page={sessions.data?.pagination.currentPage || 1}
          // totalPages={sessions.data?.pagination.totalPages || 1}
          // setPage={(page) => sessions.refetch?.({ page })}
        />
      )}
    </QueryState>
  );
};
