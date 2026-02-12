"use client";
import { formatDistanceToNow } from "date-fns";
import { BoxAdd, PenAdd, Scan, SearchNormal, Trash } from "iconsax-reactjs";
import type { Route } from "next";
import { useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
  DashboardHeader,
  GradientBackground,
} from "@/components/dashboard-header";
import { FolderIcon } from "@/components/icons";
import { QueryState } from "@/components/query-states";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog-confirmation";
import { Input } from "@/components/ui/input";
import { LogicalPagination } from "@/components/ui/pagination";
import { useAudits } from "@/features/audits/audit.hook";
import { useAuth } from "@/features/auth/auth.hook";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { useDeleteAudit } from "../audit.hook";
import type { AuditQueryParams, AuditWithoutContent } from "../audit.type";
import { NewAuditForm } from "./audit-form";

type Action = {
  type: "delete";
  audit: AuditWithoutContent;
};

export const AuditPage = () => {
  const [view, setView] = useState<"all" | "assigned" | "completed">("all");
  const [action, setAction] = useState<Action | null>(null);
  const [filters, setFilters] = useFilters<AuditQueryParams>();

  const audits = useAudits(filters);
  const { isAuthenticated } = useAuth();
  const deleteAudit = useDeleteAudit();

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-6 p-3 [--audit-card-height:189px] [--audit-card-width:212px] md:p-6">
      <GradientBackground />
      <DashboardHeader
        title="UX intelligence that turns websites into revenue machines"
        cta={
          <div className="flex gap-4">
            <NewAuditForm>
              <Button color="secondary" className="rounded-full">
                <Scan className="size-5.5 rounded-sm bg-primary p-1" /> Audit
              </Button>
            </NewAuditForm>
            <Button color="secondary" className="rounded-full">
              <BoxAdd className="size-5.5 rounded-sm bg-primary-compliment p-1" />
              Canva
            </Button>
            <Button color="secondary" className="rounded-full">
              <PenAdd className="size-5.5 rounded-sm bg-[#0088FF] p-1" />
              Editor
            </Button>
          </div>
        }
      />

      <div className="flex items-center justify-between gap-1">
        <Button
          appearance={view === "all" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("all")}
        >
          All audits
        </Button>
        <Button
          appearance={view === "assigned" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("assigned")}
        >
          Assigned
        </Button>
        <Button
          appearance={view === "completed" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("completed")}
        >
          Completed
        </Button>

        <div className="relative ml-auto w-50 transition-[width] duration-300 ease-in-out focus-within:w-full">
          <Input
            type="search"
            className="rounded-full border-secondary pl-12"
            placeholder="Search audits"
            value={filters.originalSearch}
            onChange={(e) => {
              setFilters((f) => ({ ...f, search: e.target.value }));
            }}
          />
          <SearchNormal className="-translate-y-1/2 absolute top-1/2 left-4 size-4" />
        </div>
      </div>

      {(!isAuthenticated || (audits.data && audits.data.data.length === 0)) && (
        <div className="flex grow flex-col items-center justify-center text-sm">
          <FolderIcon className="size-40" />
          <p>No audit yet</p>
        </div>
      )}

      {isAuthenticated && (
        <div className="flex flex-wrap gap-4">
          {audits.isPending || audits.isError ? (
            <QueryState query={audits} errorPrefix="Error fetching analyses:" />
          ) : (
            audits.data.data.map((audit) => {
              // <AuditCard
              //   key={audit._id}
              //   audit={audit}
              //   action={action}
              //   setAction={setAction}
              // />

              return (
                <DashboardCard
                  key={audit._id}
                  href={`dashboard/audits/${audit._id}` as Route}
                  image="/images/default-audit-card-bg.webp"
                  classNames={{
                    root: cn(
                      audit.status === "failed"
                        ? "border-destructive"
                        : audit.status === "in_progress"
                          ? "border-blue-500"
                          : audit.status === "pending"
                            ? "border-amber-500"
                            : undefined,
                    ),
                  }}
                  content={
                    <>
                      <Avatar className="size-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-sm">UN</AvatarFallback>
                      </Avatar>
                      <span className="flex min-w-0 flex-col gap-2">
                        <span className="max-w-32 truncate font-semibold text-body-4 text-white">
                          {audit.url}
                        </span>
                        <span className="text-muted-foreground text-xxs">
                          Audited{" "}
                          {formatDistanceToNow(audit.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </span>
                    </>
                  }
                  actions={[
                    {
                      label: "Delete",
                      icon: <Trash />,
                      onClick: () => setAction({ type: "delete", audit }),
                      variant: "destructive",
                    },
                  ]}
                />
              );
            })
          )}
        </div>
      )}

      {audits.data && (
        <LogicalPagination
          currentPage={audits.data.pagination.currentPage}
          totalPages={audits.data.pagination.totalPages}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      )}

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
