"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { formatDistance } from "date-fns";
import { Play } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { QueryState } from "@/components/query-states";
import { Badge } from "@/components/ui/badge";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getPlaceholderArrays,
  resolveStatusColor,
  stringToHashedNumber,
} from "@/lib/utils";
import type { usePersonas } from "../project-persona.hook";
import type { Persona } from "../project-persona.type";

interface PersonasTableProps {
  personas: ReturnType<typeof usePersonas>;
  projectId: string;
}

const columnHelper = createColumnHelper<Persona>();

export const PersonasTable = ({ personas, projectId }: PersonasTableProps) => {
  const columns = useMemo(() => {
    return [
      columnHelper.accessor("representativeReplayUrl", {
        header: "Replay",
        cell: (info) => {
          const persona = info.row.original;
          return (
            <Link
              href={`/dashboard/projects/${projectId}/personas/${persona._id}`}
              className="group relative flex h-11 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-zinc-950"
              style={{
                background: `hsl(${stringToHashedNumber(persona._id)} 80 20)`,
              }}
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
      columnHelper.accessor("name", {
        header: "Persona Class",
        cell: (info) => {
          const persona = info.row.original;
          return (
            <span
              className="font-semibold"
              style={{
                color: `hsl(${stringToHashedNumber(persona._id)} 70 50)`,
              }}
            >
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor("avgSessionDuration", {
        header: "Avg. session duration",
        cell: (info) => {
          return (
            <span className="font-medium text-foreground">
              {formatDistance(0, info.getValue() * 1000, {
                includeSeconds: true,
              })
                .replace(/(\d+)\s*minutes?/, "$1 min")
                .replace(/(\d+)\s*seconds?/, "$1 sec")}
            </span>
          );
        },
      }),
      columnHelper.accessor("percentage", {
        header: "Distribution",
        cell: (info) => {
          return (
            <span className="font-medium text-muted-foreground text-sm">
              {info.getValue()}%
            </span>
          );
        },
      }),
      columnHelper.accessor("rageClickRate", {
        header: "Rage-click sessions",
        cell: (info) => {
          const rate = info.getValue();
          return (
            <span className="font-medium text-muted-foreground text-sm">
              {Math.round(rate * 100)}%
            </span>
          );
        },
      }),
      columnHelper.accessor("ctaConversionRate", {
        header: "CTA conversion",
        cell: (info) => {
          const rate = info.getValue();
          return (
            <span className="font-medium text-muted-foreground text-sm">
              {Math.round(rate * 100)}%
            </span>
          );
        },
      }),
      columnHelper.accessor("severity", {
        header: "Severity",
        cell: (info) => {
          const val = info.getValue();

          return (
            <Badge color={resolveStatusColor(val)} appearance={"soft"}>
              <span className="size-1.5 rounded-full bg-current" />
              {val}
            </Badge>
          );
        },
      }),
    ];
  }, [projectId]);

  const table = useDataTable({
    data: personas.data?.analysis?.personas ?? [],
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
        (personas.data?.analysis?.personas ?? []).length === 0 &&
        "No personas found"
      }
    >
      {() => (
        <>
          <DataTable table={table} />
          {/* <LogicalPagination
          currentPage={sessions.data?.pagination.currentPage || 1}
          totalPages={sessions.data?.pagination.totalPages || 1}
          onPageChange={(page) => sessions.refetch?.({ page })}
          /> */}
        </>
      )}
    </QueryState>
  );
};
