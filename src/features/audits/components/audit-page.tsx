"use client";
import { formatDistanceToNow } from "date-fns";
import {
  BoxAdd,
  FolderOpen,
  PenAdd,
  Scan,
  SearchNormal,
  Trash,
} from "iconsax-reactjs";
import { MoreVertical } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import {
  DashboardHeader,
  GradientBackground,
} from "@/components/dashboard-header";
import { FolderIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog-confirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { LogicalPagination } from "@/components/ui/pagination";
import { HayaSpinner } from "@/components/ui/spinner";
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

  console.log(audits.data);

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
          {audits.isPending ? (
            <div className="mx-auto flex min-h-32 items-center justify-center">
              <HayaSpinner />
            </div>
          ) : audits.isError ? (
            <div className="flex h-(--audit-card-height) w-(--audit-card-width) flex-col items-center justify-center gap-2 rounded-2xl border border-destructive p-2 text-center md:h-34.5 md:w-53">
              <p className="text-red-500 text-sm">
                Error fetching analyses: {audits.error.message}
              </p>
              <Button
                size="sm"
                appearance="outline"
                color="secondary"
                isLoading={audits.isFetching}
                onClick={() => audits.refetch()}
              >
                Retry
              </Button>
            </div>
          ) : (
            audits.data.data.map((audit) => (
              <AuditCard
                key={audit._id}
                audit={audit}
                action={action}
                setAction={setAction}
              />
            ))
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

type AuditCardProps = {
  audit: AuditWithoutContent;
  action: Action | null;
  setAction: (action: Action | null) => void;
};

const AuditCard = ({ audit, setAction }: AuditCardProps) => {
  return (
    <Link
      href={`dashboard/audits/${audit._id}` as Route}
      className={cn(
        "group relative flex h-(--audit-card-height) w-(--audit-card-width) flex-col overflow-hidden rounded-2xl border shadow-primary transition hover:shadow-sm",
      )}
      style={{
        // Analysis Image
        background: `
        linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 /0.5)),
        url('/images/default-audit-card-bg.webp') center center/cover no-repeat
        `,

        // Status border indicator
        borderColor:
          audit.status === "failed"
            ? "var(--color-destructive)"
            : audit.status === "in_progress"
              ? "var(--color-blue-500)"
              : audit.status === "pending"
                ? "var(--color-amber-500)"
                : undefined,
      }}
    >
      {/* Hover Overlay */}
      <span className="pointer-events-none flex flex-1 flex-col items-center justify-center gap-2 border-b bg-secondary text-white opacity-0 transition-opacity group-hover:opacity-100">
        <FolderOpen className="size-7.5 shrink-0 rounded-md bg-primary p-1" />
        <span className="font-semibold text-sm">Open report</span>
      </span>

      {/* Text Content */}
      <span className="mt-auto flex items-center gap-4 bg-secondary p-4">
        <Avatar className="size-6">
          <AvatarImage src="" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <span className="flex min-w-0 flex-col gap-2">
          <span className="max-w-32 truncate font-semibold text-body-4 text-white">
            {audit.url}
          </span>
          <span className="text-muted-foreground text-xxs">
            Audited {formatDistanceToNow(audit.createdAt, { addSuffix: true })}
          </span>
        </span>
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            appearance="ghost"
            className="absolute top-1 right-1 size-6 rounded-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          onClick={(e) => {
            // Prevent audit from opening
            e.stopPropagation();
          }}
        >
          <DropdownMenuItem
            onClick={() => setAction({ type: "delete", audit })}
            data-variant="destructive"
          >
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
};
