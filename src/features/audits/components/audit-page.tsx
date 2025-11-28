"use client";
import { Add, ArchiveBook } from "iconsax-reactjs";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudits } from "@/features/audits/audit.hook";
import { cn } from "@/lib/utils";
import { NewAuditForm } from "./audit-form";

export const AuditPage = () => {
  const audits = useAudits();

  return (
    <div className="bg-linear-to-b from-0% from-primary/40 via-transparent p-3 md:p-6">
      <h1 className="mb-4 text-h1 text-white">
        Let&apos;s get straight to work
      </h1>
      <p className="mb-6">Spot Ux friction before your users does.</p>

      {/* Cases */}
      <div className="flex flex-wrap gap-6">
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
          <AuditCard
            icon={Add}
            label="Create new case"
            className="border border-primary bg-secondary text-white"
          />
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
        "hover:-mt-1 flex h-28.5 w-43.75 flex-col items-center justify-center gap-4 rounded-2xl bg-primary/15 p-4 text-primary shadow-primary transition hover:shadow-md md:h-34.5 md:w-53",
        className
      )}
    >
      <Icon className="size-7.5 shrink-0 rounded-md bg-primary p-1 text-white" />
      <span className="wrap-anywhere text-sm">{label}</span>
    </Comp>
  );
};
