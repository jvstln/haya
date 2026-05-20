"use client";
import { ArrowLeft, Blend, BoxAdd, Scan, Share } from "iconsax-reactjs";
import { Construction } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HayaSpinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAudit } from "@/features/audits/audit.hook";
import { NewAuditForm } from "@/features/audits/components/audit-form";
import { SelectTeamsDialog } from "@/features/teams/components/select-teams-dialog";
import { useAssignAuditsToTeam } from "@/features/teams/team.hook";
import type { Team } from "@/features/teams/team.type";
import { useCanvaStore } from "../canva.store";

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
        <Button appearance="soft" size="sm" href="/dashboard">
          <ArrowLeft />
          Back to Dashboard
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
          <Button
            href="/dashboard/canva"
            color="secondary"
            className="rounded-full"
          >
            <BoxAdd className="size-5.5 rounded-sm bg-primary-compliment p-1" />
            New Canva
          </Button>
        )}

        <AssignAuditToTeam auditId={auditId} />

        <Tooltip>
          <TooltipTrigger
            render={<Button appearance="soft" size="sm" disabled />}
          >
            <Share />
            Share Findings
          </TooltipTrigger>
          <TooltipContent>Coming soon</TooltipContent>
        </Tooltip>
      </div>

      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Construction className="size-24" />
          </EmptyMedia>
          <EmptyTitle className="text-h1">In Development</EmptyTitle>
          <EmptyDescription>
            The Canva editor is currently being built. Soon you'll be able to
            create stunning visual reports, annotate findings with your team,
            and export beautiful PDFs directly from your audit results.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button href="/dashboard" appearance="soft" size="sm">
            <ArrowLeft />
            Back to Dashboard
          </Button>
        </EmptyContent>
      </Empty>

      {/* <CanvaEditor /> */}
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
