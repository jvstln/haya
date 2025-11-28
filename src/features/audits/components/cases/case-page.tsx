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
import { cn, random } from "@/lib/utils";
import { useAudit } from "../../audit.hook";
import type { AuditPage } from "../../audit.type";
import { CaseSection } from "./case-content";

export const CasePage = () => {
  const params = useParams();
  const [currentView, setCurrentView] = useState<"image" | "content">("image");
  const isMobile = useBreakpoint("max-md");

  const audit = useAudit(String(params.auditId));
  const [currentPage, setCurrentPage] = useState<AuditPage | null>(null);

  // if audit content is loaded and currentPage is not set, set it to the first page
  // Pattern is supported (from react docs)
  if (audit.data?.content?.pages && !currentPage) {
    console.log(audit.data.content.pages);
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
    <div className="flex flex-col gap-4 bg-linear-to-b from-0% from-primary/40 via-transparent p-4">
      <div className="flex items-center gap-5">
        <Button size="sm" variant="glass-primary" asChild>
          <Link href="/dashboard/audits">
            <ArrowLeft />
            Back to Audit Dashboard
          </Link>
        </Button>
        <Button variant="glass-primary" size="sm" className="ml-auto">
          <Share />
          Share Findings
        </Button>
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
          "flex grid-cols-2 flex-col rounded-xl border-transparent bg-secondary max-md:border md:grid"
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
            isMobile && currentView !== "image" && "hidden"
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
            value={currentPage?.pageUrl}
            onValueChange={(value) => {
              const page = audit.data?.content?.pages?.find(
                (p) => p.pageUrl === value
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
            isMobile && currentView !== "content" && "hidden"
          )}
          style={{
            background:
              "linear-gradient(var(--color-secondary), var(--color-secondary)) padding-box, linear-gradient(to left, var(--color-primary), var(--color-primary-compliment)) border-box",
          }}
        >
          <div className="mr-4 text-white text-xs">Audit Report</div>
          <Button variant="ghost" size="sm" data-active>
            Findings
          </Button>
          <Button variant="ghost" size="sm">
            Terminal
          </Button>
        </div>

        {/* bottom left and image view*/}
        <div
          className={cn(
            "flex flex-col rounded-b-xl border-transparent px-4 py-8 md:border-r",
            isMobile && currentView !== "image" && "hidden"
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
              <div
                key={section.textContent}
                className="relative border-(--accent-fade) border-2 not-first:border-t border-b last:border-b-2 hover:border-(--accent-color)"
                style={
                  {
                    "--accent-fade": `oklch(from var(${section.meta.accent}) l c h / 0.5)`,
                    "--accent-color": `var(${section.meta.accent})`,
                  } as React.CSSProperties
                }
              >
                <picture>
                  <img
                    src={section.screenshotUrl}
                    alt={`${audit.data.url} Audit`}
                  />
                </picture>
                <div
                  className="absolute z-10 flex size-10 items-center justify-center rounded-full bg-(--accent-color) p-1 text-background text-lg"
                  style={{
                    top: `${random(1, 5)}%`,
                    right: `${random(2, 60)}%`,
                  }}
                >
                  {section.meta.sectionNumber}
                </div>
              </div>
            ))
          )}
        </div>

        {/* bottom right and content view */}
        <div
          className={cn(
            "flex flex-col gap-2 rounded-b-xl border-transparent px-4 py-8 md:border-l",
            isMobile && currentView !== "content" && "hidden"
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
            currentPage?.sections.map((section) => (
              <CaseSection key={section.textContent} section={section} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
