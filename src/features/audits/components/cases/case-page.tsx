"use client";
import { ArrowLeft, Share, Warning2 } from "iconsax-reactjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
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
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { useAudit } from "../../audit.hook";
import { getIsAuditInProgress } from "../../audit.service";
import type { AuditPage } from "../../audit.type";
import { ShareAuditDialog } from "../share-audit-dialog";
import {
  CaseImageSection,
  ProblemsAndSolutionsCaseSection,
  SeoCaseSection,
} from "./case-content";

export const CasePage = () => {
  const params = useParams();
  const [currentView, setCurrentView] = useState<"image" | "content">("image");
  const [currentReportView, setCurrentReportView] = useState<
    "problemsAndSolutions" | "seo"
  >("problemsAndSolutions");
  const isMobile = useBreakpoint("max-md");

  const audit = useAudit(String(params.auditId));
  const [currentPage, setCurrentPage] = useState<AuditPage | null>(null);

  // if audit content is loaded and currentPage is not set, set it to the first page
  // Pattern is supported (from react docs)
  if (audit.data?.content?.pages && !currentPage) {
    setCurrentPage(audit.data.content.pages?.[0]);
  }

  if (audit.isError) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center p-4">
        <Empty className="border-destructive/20 bg-destructive/5 shadow-sm">
          <EmptyMedia
            variant="icon"
            className="bg-destructive/10 text-destructive"
          >
            <Warning2 size={40} variant="Bulk" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-destructive">
              Something went wrong
            </EmptyTitle>
            <EmptyDescription>
              {audit.error.message || "We couldn't load the audit details"}.
              Please try again or contact support if the problem persists.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => audit.refetch()} variant="outline">
              Try Again
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 from-0% from-primary/20 via-transparent p-4 max-md:bg-linear-to-b">
      <div className="flex flex-wrap items-center gap-2 md:gap-5">
        <Button size="sm" variant="glass-primary" asChild>
          <Link href="/dashboard/audits">
            <ArrowLeft />
            Back to Audit Dashboard
          </Link>
        </Button>
        {currentPage && (
          <a
            href={currentPage.pageUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs"
          >
            {currentPage.pageUrl}
          </a>
        )}

        {audit.data && (
          <ShareAuditDialog audit={audit.data}>
            <Button variant="glass-primary" size="sm" className="ml-auto">
              <Share />
              Share Findings
            </Button>
          </ShareAuditDialog>
        )}
      </div>

      {/* Control to switch between image view and content view only on mobile */}
      <div
        className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-center p-4 backdrop-blur-2xs md:hidden"
        style={{
          background:
            "linear-gradient(to right, rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.9) 20% 80%, rgb(0 0 0 / 0.5))",
          boxShadow: "0px -10px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="mb-7 flex items-center justify-center gap-2 rounded-full bg-secondary p-2">
          <Button
            // size="lg"
            variant={currentView === "image" ? "default" : "ghost"}
            className="rounded-full"
            onClick={() => setCurrentView("image")}
          >
            Image View
          </Button>
          <Button
            // size="lg"
            variant={currentView === "content" ? "default" : "ghost"}
            className="rounded-full"
            onClick={() => setCurrentView("content")}
          >
            Content View
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "flex grid-cols-2 flex-col rounded-xl border-transparent bg-secondary max-md:border md:grid",
        )}
        style={{
          background:
            "linear-gradient(var(--color-secondary), var(--color-secondary)) padding-box, linear-gradient(to top right, var(--color-primary), var(--color-primary-compliment)) border-box",
        }}
      >
        {/* top left image control */}
        <div
          className={cn(
            "flex items-center gap-1 border-transparent p-4 max-md:rounded-t-xl md:rounded-s-xl md:border-r md:border-b",
            isMobile && currentView !== "image" && "hidden",
          )}
          style={{
            background:
              "linear-gradient(var(--color-secondary), var(--color-secondary)) padding-box, linear-gradient(to right, var(--color-primary), var(--color-primary-compliment)) border-box",
          }}
        >
          <Button variant="ghost" size="sm" data-active>
            Desktop
          </Button>
          <Button variant="ghost" size="sm">
            Mobile
          </Button>
          <Select
            value={currentPage?.pageUrl || ""}
            onValueChange={(value) => {
              const page = audit.data?.content?.pages?.find(
                (p) => p.pageUrl === value,
              );
              if (page) setCurrentPage(page);
            }}
          >
            <SelectTrigger className="ml-auto">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {audit.data?.content?.pages?.map((page) => (
                <SelectItem key={page.pageUrl} value={page.pageUrl}>
                  {page.pageName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* top right content control */}
        <div
          className={cn(
            "flex items-center gap-1 border-transparent p-4 max-md:rounded-t-xl md:rounded-e-xl md:border-b md:border-l",
            isMobile && currentView !== "content" && "hidden",
          )}
          style={{
            background:
              "linear-gradient(var(--color-secondary), var(--color-secondary)) padding-box, linear-gradient(to left, var(--color-primary), var(--color-primary-compliment)) border-box",
          }}
        >
          <div className="mr-4 text-white text-xs">Audit Report</div>
          <Button
            variant="ghost"
            size="sm"
            data-active={currentReportView === "problemsAndSolutions"}
            onClick={() => setCurrentReportView("problemsAndSolutions")}
          >
            UX Insight
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-active={currentReportView === "seo"}
            onClick={() => setCurrentReportView("seo")}
          >
            SEO Insight
          </Button>
        </div>

        {/* bottom left and image view*/}
        <div
          className={cn(
            "flex flex-col rounded-b-xl border-transparent px-4 py-8 md:border-r",
            isMobile && currentView !== "image" && "hidden",
          )}
          style={{
            background:
              "linear-gradient(var(--color-secondary), var(--color-secondary)) padding-box, linear-gradient(to top, var(--color-primary), var(--color-primary-compliment)) border-box",
          }}
        >
          {audit.isPending ? (
            <div className="flex flex-col items-center gap-2">
              <HayaSpinner />
              <span className="text-sm">Preparing images</span>
            </div>
          ) : (
            currentPage?.sections.map((section) => (
              <CaseImageSection key={section.textContent} section={section} />
            ))
          )}
          {getIsAuditInProgress(audit.data) && (
            <div
              className="-mt-20 pointer-events-none flex flex-col items-center gap-2 rounded-xl bg-secondary pt-12"
              style={{
                maskImage:
                  "radial-gradient(ellipse at top, transparent 20%, black 70%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at top, transparent 20%, black 70%)",
              }}
            >
              <HayaSpinner />
            </div>
          )}
        </div>

        {/* bottom right and content view */}
        <div
          className={cn(
            "flex flex-col gap-2 rounded-b-xl border-transparent px-4 py-8 md:border-l",
            isMobile && currentView !== "content" && "hidden",
          )}
          style={{
            background:
              "linear-gradient(var(--color-secondary), var(--color-secondary)) padding-box, linear-gradient(to top, var(--color-primary), var(--color-primary-compliment))",
          }}
        >
          {audit.isPending ? (
            <div className="flex flex-col items-center gap-2">
              <HayaSpinner />
              <span className="text-sm">Analysing site details</span>
            </div>
          ) : (
            currentPage?.sections.map((section) =>
              currentReportView === "seo" ? (
                <SeoCaseSection
                  key={section.meta.sectionNumber}
                  section={section}
                />
              ) : (
                <ProblemsAndSolutionsCaseSection
                  key={section.meta.sectionNumber}
                  section={section}
                />
              ),
            )
          )}
          {getIsAuditInProgress(audit.data) && (
            <div
              className="-mt-20 pointer-events-none flex flex-col items-center gap-2 rounded-xl bg-secondary pt-12"
              style={{
                maskImage:
                  "radial-gradient(ellipse at top, transparent 20%, black 70%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at top, transparent 20%, black 70%)",
              }}
            >
              <HayaSpinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
