"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Play } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { QueryState } from "@/components/query-states";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceholderArrays, stringToHsl } from "@/lib/utils";
import type { usePersona } from "../project-persona.hook";
import type { Persona } from "../project-persona.type";

interface PersonasTableProps {
  personas: ReturnType<typeof usePersona>;
}

const columnHelper = createColumnHelper<Persona>();

export const PersonasTable = ({
  personas,
  // search = "",
  // projectId,
}: PersonasTableProps) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row, {
        id: "sessionReplay",
        header: "Session Replay",
        cell: (info) => {
          const persona = info.getValue();
          return (
            <Link
              href={`/dashboard/projects/${persona.projectId}/sessions/${persona.sessionId}`}
              className="group relative flex h-11 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-zinc-950"
              style={{ background: stringToHsl(persona.sessionId, 80, 20) }}
            >
              {/* Mock UI layout inside the thumbnail to match the image */}
              <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-1.5 opacity-30">
                <div className="flex items-center justify-between gap-0.5">
                  <div className="h-0.5 w-3 rounded-full bg-zinc-600" />
                  <div className="flex gap-0.5">
                    <div className="h-0.5 w-0.5 rounded-full bg-zinc-600" />
                    <div className="h-0.5 w-0.5 rounded-full bg-zinc-600" />
                  </div>
                </div>
                <div className="my-auto flex flex-col justify-center space-y-0.5">
                  <div className="mx-auto h-1 w-10 rounded-full bg-zinc-600" />
                  <div className="mx-auto h-0.5 w-8 rounded-full bg-zinc-700" />
                </div>
                <div className="h-0.5 w-full bg-blue-500/80" />
              </div>

              <div className="z-10 flex size-6 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xs transition-transform group-hover:scale-110 group-hover:bg-white/20">
                <Play className="size-2.5 translate-x-px fill-white text-white" />
              </div>
            </Link>
          );
        },
      }),
      columnHelper.accessor((row) => row.name, {
        id: "personaClass",
        header: "Persona Class",
        cell: (info) => {
          return (
            <span className="cursor-pointer font-semibold text-[#e07f6e] hover:underline">
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row.avgDuration, {
        id: "avgDuration",
        header: "Avg. session duration",
        cell: (info) => {
          return (
            <span className="font-medium text-foreground">
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row.uniqueUsers, {
        id: "uniqueUsers",
        header: "Unique Users",
        cell: (info) => {
          return (
            <span className="font-medium text-muted-foreground text-sm">
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row.rageClickSessions, {
        id: "rageClickSessions",
        header: "Rage-click sessions",
        cell: (info) => {
          return (
            <span className="font-medium text-muted-foreground text-sm">
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row.ctaConversion, {
        id: "ctaConversion",
        header: "CTA conversion",
        cell: (info) => {
          return (
            <span className="font-medium text-muted-foreground text-sm">
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor((row) => row.severity, {
        id: "severity",
        header: "Severity",
        cell: (info) => {
          const val = info.getValue();
          return (
            <div className="flex items-center gap-1.5 text-[#e07f6e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
              <span className="font-semibold text-sm">{val}</span>
            </div>
          );
        },
      }),
    ],
    [],
  );

  const table = useDataTable({
    data: personas.data?.personas ?? [],
    columns,
  });

  if (personas.isPending) {
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
      query={personas}
      getIsEmpty={(personas) =>
        personas.data.personas.length === 0 &&
        "No personas found matching search criteria"
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
