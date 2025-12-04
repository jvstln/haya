"use client";
import { Add, ArchiveBook } from "iconsax-reactjs";
import type { Route } from "next";
import Link from "next/link";
import { FolderIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudits } from "@/features/audits/audit.hook";
import { cn } from "@/lib/utils";
import { NewAuditForm } from "./audit-form";
import { MeshBackground } from "./mesh-background";

export const AuditPage = () => {
  const audits = useAudits();

  return (
    <div className="relative min-h-screen w-full overflow-hidden p-3 md:p-6">
      {/* Mesh Background */}
      <div
        className="-z-10 pointer-events-none absolute inset-0 flex items-center justify-center"
        style={
          {
            // background:
            // "radial-gradient(circle at 50% -20%, #2a1e56 0%, #0a0a0a 100%)",
          }
        }
      >
        <MeshBackground className="h-full w-full" />
      </div>
      <h1 className="mb-4 text-h1 text-white">
        Let&apos;s get straight to work
      </h1>
      <p className="mb-6">Spot Ux friction before your users does.</p>

      {/* Cases */}
      <div
        className="grid gap-6 [--audit-card-width:175px] md:[--audit-card-width:212px]"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(var(--audit-card-width), 1fr))",
        }}
      >
        {audits.isPending ? (
          <>
            <Skeleton className="h-28.5 w-43.75 rounded-2xl md:h-34.5 md:w-53" />
            <Skeleton className="h-28.5 w-43.75 md:h-34.5 md:w-53rounded-2xl" />
          </>
        ) : audits.isError ? (
          <div className="flex h-28.5 w-43.75 flex-col items-center justify-center gap-2 rounded-2xl border border-destructive p-2 text-center md:h-34.5 md:w-53">
            <p className="text-red-500 text-sm">
              Error fetching analyses: {audits.error.message}
            </p>
            <Button size="sm" variant="glass" onClick={() => audits.refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          audits.data.map((analysis) => (
            <AuditCard
              key={analysis._id}
              label={analysis.url}
              link={`/dashboard/audits/${analysis._id}` as Route}
            />
          ))
        )}

        <NewAuditForm>
          {/* <AuditCard
            icon={Add}
            label="Create new case"
            className="border border-primary bg-secondary text-white"
          /> */}
          <button
            type="button"
            className={cn(
              "hover:-mt-1 flex h-28.5 flex-col items-center justify-center gap-4 rounded-2xl bg-primary/15 p-4 text-white shadow-primary transition hover:shadow-md md:h-39.5"
            )}
          >
            <Add className="size-7.5 shrink-0 rounded-md bg-primary p-1" />
            <span className="wrap-anywhere text-sm">Create new case</span>
          </button>
        </NewAuditForm>
      </div>
    </div>
  );
};

const AuditCard = ({
  icon: Icon = ArchiveBook,
  label = "Audit",
  className,
  link,
  onClick,
}: {
  icon?: typeof ArchiveBook;
  label?: string;
  className?: string;
  link?: Route;
  onClick?: () => void;
}) => {
  const Comp = link ? Link : "button";

  return (
    <Comp
      href={link ?? "/"}
      onClick={onClick}
      type="button"
      className={cn(
        "hover:-mt-1 flex h-28.5 flex-col items-center justify-center gap-4 rounded-2xl bg-primary/15 pt-4 shadow-primary transition hover:shadow-md md:h-39.5",
        className
      )}
    >
      <FolderIcon className="size-25 shrink-0" />
      <span className="wrap-anywhere flex w-full flex-col items-center justify-center gap-2 rounded-b-2xl bg-card px-6 py-3 font-semibold text-white text-xs">
        {label}
      </span>
    </Comp>
  );
};
