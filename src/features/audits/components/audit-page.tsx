"use client";
import { useState } from "react";
import { FolderIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog-confirmation";
import { InputSearch } from "@/components/ui/input-search";
import { LogicalPagination } from "@/components/ui/pagination";
import { useAudits } from "@/features/audits/audit.hook";
import { useAuth } from "@/features/auth/auth.hook";
import { useFilters } from "@/hooks/use-filters";
import { useDeleteAudit } from "../audit.hook";
import type { AuditFilters, AuditWithoutContent } from "../audit.type";
import { TagInstallation } from "./tag-installation";

type Action = {
  type: "delete";
  audit: AuditWithoutContent;
};

export const AuditPage = () => {
  const [view, setView] = useState<"sessionReplay" | "heatmap">(
    "sessionReplay",
  );
  const [action, setAction] = useState<Action | null>(null);
  const { filters, setFilters, originalFilters } = useFilters<AuditFilters>();

  const audits = useAudits(filters);
  const { isAuthenticated } = useAuth();
  const deleteAudit = useDeleteAudit();

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-6 p-3 [--audit-card-height:189px] [--audit-card-width:212px] md:p-6">
      <TagInstallation />

      <h1 className="text-h3">All behavioural data</h1>

      <div className="-mt-2 flex items-center justify-between gap-1">
        <Button
          appearance={view === "sessionReplay" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("sessionReplay")}
        >
          Session replay
        </Button>
        <Button
          appearance={view === "heatmap" ? "solid" : "ghost"}
          color="secondary"
          size="sm"
          onClick={() => setView("heatmap")}
        >
          Heatmap
        </Button>

        <InputSearch
          placeholder="Search audits"
          value={originalFilters.search}
          onChange={(e) => {
            setFilters((f) => ({ ...f, search: e.target.value }));
          }}
        />
      </div>

      {(!isAuthenticated ||
        (audits.data && audits.data.data.length === 0) ||
        true) && (
        <div className="flex grow flex-col items-center justify-center text-sm">
          <FolderIcon className="size-40" />
          <p>No sessions yet</p>
        </div>
      )}

      {/* {isAuthenticated && (
        <div className="flex flex-wrap gap-4">
          {audits.isPending || audits.isError ? (
            <QueryState query={audits} errorPrefix="Error fetching analyses:" />
          ) : (
            audits.data.data.map((audit) => (
              <AuditCard
                key={audit._id}
                audit={audit}
                onDelete={(a) => setAction({ type: "delete", audit: a })}
              />
            ))
          )}
        </div>
      )} */}

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
