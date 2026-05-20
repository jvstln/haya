"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FolderIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { ConfirmationDialog } from "@/components/ui/dialog-confirmation";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { InputSearch } from "@/components/ui/input-search";
import { HayaSpinner } from "@/components/ui/spinner";
import { useAudits, useDeleteAudit } from "@/features/audits/audit.hook";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import type { AuditFilters, AuditWithoutContent } from "../audit.type";
import { NewAuditForm } from "./audit-form";

export const ExternalAuditPage = () => {
  const [action, setAction] = useState<{
    type: "delete";
    audit: AuditWithoutContent;
  } | null>(null);

  const { filters, originalFilters, setFilters } = useFilters<AuditFilters>();

  const audits = useAudits(filters);
  const deleteAudit = useDeleteAudit();

  const columnHelper = createColumnHelper<AuditWithoutContent>();

  const RowLink = ({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={`/dashboard/track-experience/${id}`}
      className="-mx-4 -my-3 flex items-center px-4 py-3"
    >
      {children}
    </Link>
  );

  const columns = [
    columnHelper.accessor((row) => row.firstImageUrl, {
      id: "sessionReplay",
      header: "Session Replay",
      cell: (info) => {
        const imageUrl = info.getValue();
        const row = info.row.original;
        return (
          <Link
            href={`/dashboard/track-experience/${row._id}`}
            className="group relative flex h-16 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-black/40"
          >
            {imageUrl ? (
              // biome-ignore lint/performance/noImgElement: Dynamic external screenshot URL
              <img
                src={imageUrl}
                alt="Session Replay Thumbnail"
                className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-br from-neutral-800 to-neutral-900" />
            )}
          </Link>
        );
      },
    }),
    columnHelper.accessor((row) => row.url, {
      id: "url",
      header: "Website URL",
      cell: (info) => {
        const row = info.row.original;
        return (
          <RowLink id={row._id}>
            <span className="block max-w-xs truncate font-medium text-white">
              {info.getValue()}
            </span>
          </RowLink>
        );
      },
    }),
    columnHelper.accessor((row) => row._id, {
      id: "duration",
      header: "Duration",
      cell: (info) => {
        const id = info.getValue();
        const row = info.row.original;
        // Generate deterministic duration based on ID
        const sec = (id.charCodeAt(id.length - 1) % 50) + 10;
        return (
          <RowLink id={row._id}>
            <span className="font-mono text-muted-foreground">0.00.{sec}</span>
          </RowLink>
        );
      },
    }),
    columnHelper.accessor((row) => row.createdAt, {
      id: "date",
      header: "Date",
      cell: (info) => {
        const dateStr = info.getValue();
        const row = info.row.original;
        const formatted = (() => {
          try {
            return format(new Date(dateStr), "MMM d, yyyy, 'at' h:mm a");
          } catch {
            return dateStr;
          }
        })();
        return (
          <RowLink id={row._id}>
            <span className="text-muted-foreground text-sm">{formatted}</span>
          </RowLink>
        );
      },
    }),
    columnHelper.accessor((row) => row.status, {
      id: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const row = info.row.original;
        const config = {
          completed: {
            label: "Completed",
            dotColor: "bg-emerald-500",
            textColor: "text-emerald-400",
          },
          pending: {
            label: "Pending",
            dotColor: "bg-amber-500",
            textColor: "text-amber-400",
          },
          in_progress: {
            label: "In Progress",
            dotColor: "bg-cyan-500",
            textColor: "text-cyan-400",
          },
          failed: {
            label: "Failed",
            dotColor: "bg-red-500",
            textColor: "text-red-400",
          },
        }[status] || {
          label: status,
          dotColor: "bg-gray-500",
          textColor: "text-gray-400",
        };

        return (
          <RowLink id={row._id}>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-medium text-xs",
                config.textColor,
              )}
            >
              <span className={cn("size-2 rounded-full", config.dotColor)} />
              {config.label}
            </span>
          </RowLink>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => {
        const row = info.row.original;
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAction({ type: "delete", audit: row });
            }}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/30 hover:text-destructive"
          >
            <Trash className="size-4" />
          </button>
        );
      },
    }),
  ];

  const table = useDataTable({
    data: audits.data?.data ?? [],
    columns,
  });

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-6 p-4 md:p-6">
      {/* Top Card: Friction Simulation */}
      <Card className="relative overflow-hidden bg-linear-to-br from-primary/10 via-transparent to-transparent p-6">
        <div>
          <h2 className="font-bold text-white text-xl">Friction Simulation</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
            Watch your user(s) walk through your product, get behavioral insight
            on what is causing users drop-off.
          </p>
        </div>
        <div>
          <NewAuditForm>
            <Button color="primary" size="default" className="rounded-full">
              Track Experience
            </Button>
          </NewAuditForm>
        </div>
      </Card>

      {/* Bottom Card: All Products */}
      <Card className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-white text-xl">All Products</h2>
          <p className="text-muted-foreground text-sm">
            All products you have tracked will appear here.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex items-center justify-between gap-1">
          <Button
            appearance={!filters.status ? "solid" : "ghost"}
            color="secondary"
            size="sm"
            onClick={() =>
              setFilters(({ status, ...f }) => ({ ...f, page: 1 }))
            }
          >
            All
          </Button>
          {/* <Button
            appearance={filters.status === "assigned" ? "solid" : "ghost"}
            color="secondary"
            size="sm"
            onClick={() => setFilters((f) => ({ ...f, status: "completed", page: 1 }))}
          >
            Assigned
          </Button> */}
          <Button
            appearance={filters.status === "completed" ? "solid" : "ghost"}
            color="secondary"
            size="sm"
            onClick={() =>
              setFilters((f) => ({ ...f, status: "completed", page: 1 }))
            }
          >
            Completed
          </Button>

          <InputSearch
            placeholder="Search by url"
            value={originalFilters.search}
            onChange={(e) => {
              setFilters((f) => ({ ...f, search: e.target.value }));
            }}
          />
        </div>

        {/* Table / State display */}
        <CardContent className="p-0">
          {audits.isPending ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 py-12">
              <HayaSpinner />
              <span className="text-muted-foreground text-sm">Loading...</span>
            </div>
          ) : audits.isError ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4 py-12">
              <span className="font-semibold text-destructive text-sm">
                Error loading audits: {audits.error?.message || "Unknown error"}
              </span>
              <Button
                onClick={() => audits.refetch()}
                appearance="outline"
                color="secondary"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          ) : !audits.data || audits.data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Empty className="border-none bg-transparent">
                <EmptyMedia className="relative">
                  <FolderIcon className="size-28 text-primary/80" />
                  <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle className="mt-2 font-medium text-muted-foreground text-sm">
                    No audit yet
                  </EmptyTitle>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <DataTable
              table={table}
              page={audits.data.pagination.currentPage}
              totalPages={audits.data.pagination.totalPages}
              setPage={(page) => setFilters((f) => ({ ...f, page }))}
            />
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog for deletion */}
      {action?.type === "delete" && (
        <ConfirmationDialog
          open={true}
          onOpenChange={() => setAction(null)}
          onConfirm={async () => {
            await deleteAudit.mutateAsync(action.audit._id);
          }}
        />
      )}
    </div>
  );
};
