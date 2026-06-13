"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar } from "iconsax-reactjs";
import {
  BadgeDollarSign,
  Bot,
  FileSearch,
  Megaphone,
  Palette,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  DashboardDescription,
  DashboardHeader,
  DashboardSlot,
  DashboardTitle,
} from "@/components/dashboard-ui";
import { QueryState } from "@/components/query-states";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable, useDataTable } from "@/components/ui/data-table";
import { ConfirmationDialog } from "@/components/ui/dialog-confirmation";
import { InputSearch } from "@/components/ui/input-search";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <DashboardSlot>
      <DashboardHeader>
        <DashboardTitle>Friction Simulation</DashboardTitle>
        <DashboardDescription>
          Watch your personas walk through your product, get behavioral insight
          on what is causing users drop-off.
        </DashboardDescription>

        <NewAuditForm>
          <Button color="primary" size="default" className="rounded-full">
            Track Experience
          </Button>
        </NewAuditForm>
      </DashboardHeader>

      <DashboardTitle>Tracked Activities</DashboardTitle>

      <Tabs>
        <TabsList className="mb-6">
          <TabsTrigger value="allProducts">All Products</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="allProducts">
          <Card className="flex flex-col gap-6 p-6">
            <CardHeader>
              <CardTitle>All Products</CardTitle>
              <CardDescription>
                All products you have tracked will appear here.
              </CardDescription>
            </CardHeader>

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
              <QueryState
                query={audits}
                getIsEmpty={(query) =>
                  query.data.data.length === 0 && "No tracked products found"
                }
              >
                {(audits) => (
                  <DataTable
                    table={table}
                    page={audits.data.pagination.currentPage}
                    totalPages={audits.data.pagination.totalPages}
                    setPage={(page) => setFilters((f) => ({ ...f, page }))}
                  />
                )}
              </QueryState>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardTitle>All Active Agents</CardTitle>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <Card key={agent.id}>
                    <div className="mb-4 flex items-center">
                      <div className={`rounded-xl p-2.5 ${agent.colorClass}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="mb-6 grow">
                      <h3 className="mb-1.5 font-semibold text-base text-white">
                        {agent.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {agent.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span
                        className={`font-semibold text-xs tracking-wide ${agent.active ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {agent.active ? "Active" : "Inactive"}
                      </span>
                      <Switch checked={agent.active} disabled />
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
    </DashboardSlot>
  );
};

const agents = [
  {
    id: "onboarding",
    name: "Onboarding",
    description: "Time-to-value · empty states · activation gates",
    active: true,
    icon: Calendar,
    colorClass: "bg-[#7c3aed]/10 text-[#a855f7]",
  },
  {
    id: "gamification",
    name: "Gamification",
    description: "Reward loops · streaks · re-engagement",
    active: true,
    icon: Bot,
    colorClass: "bg-[#ea580c]/10 text-[#fb923c]",
  },
  {
    id: "pricing",
    name: "Pricing",
    description: "Plan anchoring · CTA copy · risk reversal",
    active: true,
    icon: BadgeDollarSign,
    colorClass: "bg-[#10b981]/10 text-[#34d399]",
  },
  {
    id: "visual-design",
    name: "Visual design",
    description: "Hierarchy · contrast · trust signals",
    active: true,
    icon: Palette,
    colorClass: "bg-[#3b82f6]/10 text-[#60a5fa]",
  },
  {
    id: "seo",
    name: "SEO",
    description: "Meta · schema · internal linking",
    active: true,
    icon: FileSearch,
    colorClass: "bg-[#06b6d4]/10 text-[#22d3ee]",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Positioning · ICP · social proof",
    active: true,
    icon: Megaphone,
    colorClass: "bg-[#f43f5e]/10 text-[#fb7185]",
  },
];
