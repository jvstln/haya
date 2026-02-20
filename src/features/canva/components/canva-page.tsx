"use client";
import { ArrowLeft, Blend, BoxAdd, Scan, Share } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { HayaSpinner } from "@/components/ui/spinner";
import { ShareAuditDialog } from "@/features/audits/components/share-audit-dialog";
import { useCanvaEditor } from "../canva.hook";
import { CanvaEditor } from "./canva-editor";

type CanvaPageProps = {
  auditId?: string;
};

const CanvaPage = ({ auditId }: CanvaPageProps) => {
  const canvaEditor = useCanvaEditor(auditId);
  const pathname = usePathname();

  return (
    <div className="relative flex size-full grow flex-col">
      {/* Navigation and controls */}
      <div className="flex items-center gap-4 p-3 md:px-6">
        <Button appearance="soft" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft />
            Back to Dashboard
          </Link>
        </Button>

        <Button color="secondary" className="ml-auto rounded-full">
          <Scan className="size-5.5 rounded-sm bg-primary p-1" />
          Audit
        </Button>

        {/* Only show if not a new canva */}
        {!pathname.endsWith("new") && (
          <Button color="secondary" className="rounded-full" asChild>
            <Link href="/dashboard/canva">
              <BoxAdd className="size-5.5 rounded-sm bg-primary-compliment p-1" />
              Canva
            </Link>
          </Button>
        )}

        <Button color="secondary" className="rounded-full">
          <Blend className="size-5.5 rounded-sm bg-[#00C0E8] p-1" />
          Assign
        </Button>

        {canvaEditor.auditQuery.data ? (
          <ShareAuditDialog audit={canvaEditor.auditQuery.data}>
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

      <CanvaEditor canvaEditor={canvaEditor} />
    </div>
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
