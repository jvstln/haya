"use client";
import { ArrowLeft, Blend, BoxAdd, Scan, Share } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
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
import { ShareAuditDialog } from "@/features/audits/components/share-audit-dialog";
import { useCanvaStore } from "../canva.store";
import { CanvaEditor } from "./canva-editor";

type CanvaPageProps = {
  auditId?: string;
};

const CanvaPage = ({ auditId }: CanvaPageProps) => {
  const audit = useAudit(auditId ?? "");
  const pathname = usePathname();

  const storeAuditId = useCanvaStore((state) => state.auditId);
  const pageIndex = useCanvaStore((state) => state.pageIndex);

  // Meant to run only once. Used to track other persistent settings
  if (auditId !== storeAuditId) {
    useCanvaStore.setState({ auditId });
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
          onValueChange={(value) => {
            useCanvaStore.setState({ pageIndex: Number(value) });
          }}
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

        <Button color="secondary" className="ml-auto rounded-full">
          <Scan className="size-5.5 rounded-sm bg-primary p-1" />
          Audit
        </Button>

        {/* Only show if not a new canva */}
        {!pathname.endsWith("new") && (
          <Button color="secondary" className="rounded-full" asChild>
            <Link href="/dashboard/canva">
              <BoxAdd className="size-5.5 rounded-sm bg-primary-compliment p-1" />
              New Canva
            </Link>
          </Button>
        )}

        <Button color="secondary" className="rounded-full">
          <Blend className="size-5.5 rounded-sm bg-cyan p-1" />
          Assign
        </Button>

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

      <CanvaEditor audit={audit} />
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
