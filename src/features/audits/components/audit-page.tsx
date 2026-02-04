"use client";
import { FolderOpen, SearchNormal, Trash } from "iconsax-reactjs";
import { MoreVertical } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FolderIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
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
import { setOnboardingFormDialogView } from "@/features/auth/components/onboarding-dialog";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { useDeleteAudit } from "../audit.hook";
import type { AuditQueryParams } from "../audit.type";
import { NewAuditForm } from "./audit-form";

export const AuditPage = () => {
  const [filters, setFilters] = useFilters<AuditQueryParams>();
  const audits = useAudits(filters);
  const { isAuthenticated } = useAuth();
  const { mutate: deleteAudit } = useDeleteAudit();

  return (
    <div className="relative flex min-h-screen w-full flex-col gap-6 p-3 md:p-6">
      {/* Gradient background */}
      <div
        className="-z-10 absolute inset-x-0 top-0 h-39.25"
        style={{
          background:
            "linear-gradient(152.36deg, rgba(122, 99, 255, 0.38) 22.82%, #121212 82.58%)",
          opacity: 0.7,
          filter: "blur(50px)",
        }}
      />

      <NewAuditBanner />

      <div className="flex items-center justify-between">
        <p className="text-h3">All audits</p>
        <div className="relative w-48 transition-[width] duration-300 focus-within:w-sm">
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
        <div
          className="grid gap-6 [--audit-card-width:175px] md:[--audit-card-width:212px]"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(var(--audit-card-width), 1fr))",
          }}
        >
          {audits.isPending ? (
            <div className="flex min-h-32 items-center justify-center">
              <HayaSpinner />
            </div>
          ) : audits.isError ? (
            <div className="flex h-28.5 w-43.75 flex-col items-center justify-center gap-2 rounded-2xl border border-destructive p-2 text-center md:h-34.5 md:w-53">
              <p className="text-red-500 text-sm">
                Error fetching analyses: {audits.error.message}
              </p>
              <Button
                size="sm"
                variant="glass"
                onClick={() => audits.refetch()}
              >
                Retry
              </Button>
            </div>
          ) : (
            audits.data.data.map((analysis) => (
              <AuditCard
                key={analysis._id}
                label={analysis.url}
                link={`/dashboard/audits/${analysis._id}` as Route}
                onDelete={() => deleteAudit(analysis._id)}
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
    </div>
  );
};

const AuditCard = ({
  label = "Audit",
  className,
  link,
  onDelete,
}: {
  label?: string;
  className?: string;
  link: Route;
  onDelete: () => void;
}) => {
  return (
    <Link
      href={link}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-secondary p-4 text-center shadow-primary transition hover:shadow-sm",
        className,
      )}
    >
      <FolderIcon className="size-24 shrink-0" />
      <span className="wrap-anywhere flex w-full flex-col items-center justify-center gap-2 rounded-b-2xl font-semibold text-white text-xs">
        {label}
      </span>

      {/* Overlay */}

      <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-secondary text-white opacity-0 transition-opacity group-hover:opacity-100">
        <FolderOpen className="size-7.5 shrink-0 rounded-md bg-primary p-1" />
        <span className="font-semibold text-sm">Open report</span>
      </span>

      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <MoreVertical className="mt-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
};

const NewAuditBanner = () => {
  const { isAuthenticated } = useAuth();
  const [isAuditFormOpen, setIsAuditFormOpen] = useState(false);

  const handleNewAudit = () => {
    if (isAuthenticated) {
      setIsAuditFormOpen(true);
    } else {
      setOnboardingFormDialogView("login");
    }
  };

  return (
    <div
      className="flex overflow-hidden rounded-xl border border-transparent"
      style={{
        background: `
          linear-gradient(87.5deg, rgba(30, 30, 30, 0.26) 1.42%, oklch(from var(--color-primary) l c h / 0.26) 99.44%),
          url(/images/noise-texture.png) padding-box,
          linear-gradient(87.5deg, rgba(30, 30, 30, 0.26) 1.42%, oklch(from var(--color-primary) l c h / 0.26) 99.44%),
          linear-gradient(to bottom right, var(--color-background), var(--color-background)) padding-box,
          linear-gradient(to bottom right, var(--color-primary), var(--color-primary-compliment)) border-box`,
      }}
    >
      <div className="flex w-full basis-3/5 flex-col items-start gap-4 px-4 py-5 md:gap-6 md:p-8">
        <h1 className="text-base text-white lg:text-h1">
          UX Insights That Improve Conversions, Not Opinion
        </h1>
        <p className="text-xs max-md:hidden lg:text-base">
          Haya gives you a real UX audit with data-driven recommendations so you
          know what to fix, why it matters, and how it impacts growth.
        </p>
        {/* Text for mobile */}
        <p className="text-xs md:hidden">
          Haya gives you a real UX audit with data-driven recommendations.
        </p>
        <Button
          className="hidden animate-border-glow rounded-full md:block"
          size="lg"
          onClick={handleNewAudit}
        >
          Audit website now
        </Button>
        {/* Button for mobile */}
        <Button
          className="animate-border-glow rounded-full md:hidden"
          onClick={handleNewAudit}
        >
          Audit website now
        </Button>
      </div>
      <div className="relative basis-2/5">
        <Image
          src="/images/archive-illustration.svg"
          alt="New audit"
          fill
          className="object-cover object-left-top"
        />
      </div>

      <NewAuditForm open={isAuditFormOpen} onOpenChange={setIsAuditFormOpen} />
    </div>
  );
};
