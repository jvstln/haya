"use client";
import { ArrowLeft, Blend, BoxAdd, Scan, Share } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HayaSpinner } from "@/components/ui/spinner";
import { useAudit } from "@/features/audits/audit.hook";
import { NewAuditForm } from "@/features/audits/components/audit-form";
import { ShareAuditDialog } from "@/features/audits/components/share-audit-dialog";
import { SelectTeamsDialog } from "@/features/teams/components/select-teams-dialog";
import { useAssignAuditsToTeam } from "@/features/teams/team.hook";
import type { Team } from "@/features/teams/team.type";
import { useCanvaStore } from "../canva.store";
import { CanvaEditor } from "./canva-editor";

type CanvaPageProps = {
  auditId?: string;
};

const CanvaPage = ({ auditId }: CanvaPageProps) => {
  const audit = useAudit(auditId ?? "");
  const pathname = usePathname();

  const storeAuditId = useCanvaStore((state) => state.auditId);
  const setStoreAuditId = useCanvaStore((state) => state.setAuditId);
  const pageIndex = useCanvaStore((state) => state.pageIndex);
  const setPageIndex = useCanvaStore((state) => state.setPageIndex);

  // Meant to run only once. Used to track other persistent settings
  if (auditId !== storeAuditId) {
    setStoreAuditId(auditId);
  }

  return (
    <div className="relative flex size-full max-h-[calc(100vh-var(--header-height))] grow flex-col">
      {/* Navigation and controls */}
      <div className="flex items-center gap-4 p-3 md:px-6">
        <Button appearance="soft" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft />
            Back to Dashboard
          </Link>
        </Button>

        <Select
          value={String(pageIndex)}
          onValueChange={(value) => setPageIndex(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            {audit.data?.content?.pages.map((page, index) => (
              <SelectItem key={page.pageUrl} value={String(index)}>
                {page.pageUrl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <NewAuditForm>
          <Button color="secondary" className="ml-auto rounded-full">
            <Scan className="size-5.5 rounded-sm bg-primary p-1" />
            Audit
          </Button>
        </NewAuditForm>

        {/* Only show if not a new canva */}
        {!pathname.endsWith("new") && (
          <Button color="secondary" className="rounded-full" asChild>
            <Link href="/dashboard/canva">
              <BoxAdd className="size-5.5 rounded-sm bg-primary-compliment p-1" />
              New Canva
            </Link>
          </Button>
        )}

        <AssignAuditToTeam auditId={auditId} />

        {audit.data ? (
          <ShareAuditDialog audit={audit.data}>
            <Button appearance="soft" size="sm">
              <Share />
              Share Findings
            </Button>
          </ShareAuditDialog>
        ) : (
          <Button appearance="soft" size="sm" disabled>
            <Share />
            Share Findings
          </Button>
        )}
      </div>

      <CanvaEditor />
    </div>
  );
};

const AssignAuditToTeam = ({ auditId }: { auditId?: string }) => {
  const assignAuditsToTeam = useAssignAuditsToTeam();
  const [team, setTeam] = useState<Team | null>(null);

  return (
    <SelectTeamsDialog
      // Only a maximum of one team should be selected
      teams={team ? [team] : []}
      onTeamsChange={(teams) => setTeam(teams.at(-1) ?? null)}
      buttonText="Assign"
      onConfirm={async (teams) => {
        if (!auditId) {
          throw new Error("[FE]: Audit has not been created or retrieved");
        }

        await assignAuditsToTeam.mutateAsync({
          auditIds: [auditId],
          teamId: teams[0]._id,
        });
      }}
    >
      <Button color="secondary" className="rounded-full">
        <Blend className="size-5.5 rounded-sm bg-cyan p-1" />
        Assign
      </Button>
    </SelectTeamsDialog>
  );
};

export const SuspendedCanvaPage = (props: CanvaPageProps) => {
  return (
    <Suspense
      fallback={
        <div className="grid size-full place-content-center p-4">
          <HayaSpinner />
        </div>
      }
    >
      <CanvaPage {...props} />
    </Suspense>
  );
};

export { SuspendedCanvaPage as CanvaPage };
