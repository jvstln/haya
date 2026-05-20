"use client";

import { ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AuditIssue } from "../audit.type";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const getSeverityStyle = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "critical":
      return {
        bg: "bg-red-500",
        text: "text-red-400",
        glow: "shadow-[0_0_8px_rgba(239,68,68,0.4)]",
      };
    case "high":
      return {
        bg: "bg-amber-500",
        text: "text-amber-400",
        glow: "shadow-[0_0_8px_rgba(245,158,11,0.4)]",
      };
    case "medium":
      return {
        bg: "bg-sky-500",
        text: "text-sky-400",
        glow: "shadow-[0_0_8px_rgba(14,165,233,0.4)]",
      };
    default:
      return {
        bg: "bg-emerald-500",
        text: "text-emerald-400",
        glow: "shadow-[0_0_8px_rgba(34,197,94,0.4)]",
      };
  }
};

const getComplexityBadge = (complexity: string) => {
  switch (complexity?.toLowerCase()) {
    case "low":
      return (
        <Badge className="border-none bg-emerald-500/10 font-semibold text-emerald-400">
          Low Complexity
        </Badge>
      );
    case "high":
      return (
        <Badge className="border-none bg-red-500/10 font-semibold text-red-400">
          High Complexity
        </Badge>
      );
    default:
      return (
        <Badge className="border-none bg-sky-500/10 font-semibold text-sky-400">
          Medium Complexity
        </Badge>
      );
  }
};

// ---------------------------------------------------------------------------
// IssueDetailSheet
// ---------------------------------------------------------------------------

interface IssueDetailSheetProps {
  issue: AuditIssue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IssueDetailSheet = ({
  issue,
  open,
  onOpenChange,
}: IssueDetailSheetProps) => {
  if (!issue) return null;

  const severityStyle = getSeverityStyle(issue.severity);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="border-border/20 border-b px-5 py-4">
          <SheetTitle>Finding Details</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="flex flex-col gap-6 px-5 py-5">
            {/* Title + badges */}
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-base text-white leading-snug">
                {issue.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {issue.audit_category && (
                  <Badge className="border-none bg-primary/10 font-medium text-primary capitalize">
                    {issue.audit_category.replace(/_/g, " ")}
                  </Badge>
                )}
                <Badge
                  className={cn(
                    "border-none font-semibold capitalize",
                    severityStyle.text,
                    "bg-white/5",
                  )}
                >
                  <span
                    className={cn(
                      "mr-1.5 inline-block size-1.5 rounded-full",
                      severityStyle.bg,
                      severityStyle.glow,
                    )}
                  />
                  {issue.severity}
                </Badge>
              </div>
            </div>

            {/* Affected element screenshot placeholder */}
            {issue.affected_element && (
              <div className="overflow-hidden rounded-lg border border-white/8 bg-neutral-900/60">
                <div className="flex items-center gap-2 border-white/5 border-b px-3 py-2">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    Affected Element
                  </span>
                </div>
                <div className="px-3 py-3">
                  <code className="block truncate font-mono text-white/70 text-xs">
                    {issue.affected_element}
                  </code>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Description
              </p>
              <p className="text-sm text-white/80 leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Root Cause */}
            {issue.root_cause && (
              <div className="flex flex-col gap-1.5">
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Root cause
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {issue.root_cause}
                </p>
              </div>
            )}

            {/* Recommendation */}
            {issue.solution?.recommendation && (
              <div className="flex flex-col gap-1.5">
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Recommended fix
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {issue.solution.recommendation}
                </p>
              </div>
            )}

            {/* Implementation Steps */}
            {issue.solution?.implementation_steps &&
              issue.solution.implementation_steps.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                      Implementation steps
                    </p>
                    <div className="flex items-center gap-2">
                      {getComplexityBadge(issue.solution.complexity)}
                      {issue.solution.estimated_effort && (
                        <Badge className="flex items-center gap-1 border-white/10 bg-transparent font-semibold text-muted-foreground">
                          <Clock className="size-3" />
                          {issue.solution.estimated_effort}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {issue.solution.implementation_steps.map((step) => (
                      <div key={step} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-sm text-white/75 leading-relaxed">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Business Impact */}
            {issue.business_impact && (
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Business Impact
                </p>
                <Card className="border border-white/5 bg-neutral-900/50">
                  <CardContent className="pt-4">
                    <div className="mb-3 flex items-start justify-between gap-4 border-white/5 border-b pb-3">
                      <div>
                        <span className="mb-1 block text-muted-foreground text-xs">
                          Metric affected
                        </span>
                        <span className="font-semibold text-sm text-white leading-tight">
                          {issue.business_impact.metric_affected}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="mb-1 block text-muted-foreground text-xs">
                          Estimated improvement
                        </span>
                        <span className="block font-bold text-emerald-400 text-sm tracking-wide">
                          {issue.business_impact.estimated_improvement}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                      {issue.business_impact.impact_description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// ---------------------------------------------------------------------------
// IssuesView — the unified list + business impact summary
// (exported as ConversionOptimization for backward compat)
// ---------------------------------------------------------------------------

interface IssuesViewProps {
  issues: AuditIssue[];
}

const IssuesView = ({ issues }: IssuesViewProps) => {
  const [sheetIssue, setSheetIssue] = useState<AuditIssue | null>(null);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);

  const activeIssue =
    issues.find((i) => i.issue_id === activeIssueId) ?? issues[0];

  if (!issues.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 border-dashed bg-secondary/5 px-4 py-16 text-center">
        <Sparkles className="mb-3 size-12 text-muted-foreground/40" />
        <h4 className="mb-1 font-semibold text-base text-white">
          No Issues Found
        </h4>
        <p className="max-w-md text-muted-foreground text-sm">
          No issues were flagged in this category. Everything looks solid!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Issues Table */}
        <div className="overflow-hidden rounded-xl border border-white/5 bg-neutral-900/30 backdrop-blur-xs">
          {/* Header */}
          <div className="grid grid-cols-[100px_1fr_120px_60px] items-center border-white/5 border-b bg-neutral-950/20 px-6 py-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider max-sm:grid-cols-[80px_1fr_40px] max-sm:px-4">
            <div>Severity</div>
            <div>Issues</div>
            <div className="max-sm:hidden">Impact</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-white/5">
            {issues.map((issue) => {
              const isActive = activeIssue?.issue_id === issue.issue_id;
              const style = getSeverityStyle(issue.severity);
              return (
                <button
                  key={issue.issue_id}
                  type="button"
                  onClick={() => setActiveIssueId(issue.issue_id)}
                  className={cn(
                    "group grid w-full cursor-pointer grid-cols-[100px_1fr_120px_60px] items-center px-6 py-5 text-left outline-none transition-all duration-200 hover:bg-white/2 focus-visible:bg-white/2 max-sm:grid-cols-[80px_1fr_40px] max-sm:px-4",
                    isActive
                      ? "border-primary border-l-2 bg-white/3"
                      : "border-transparent border-l-2",
                  )}
                >
                  {/* Severity */}
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        style.bg,
                        style.glow,
                      )}
                    />
                    <span
                      className={cn(
                        "font-semibold text-xs capitalize tracking-wide",
                        style.text,
                      )}
                    >
                      {issue.severity}
                    </span>
                  </div>

                  {/* Issue Details */}
                  <div className="min-w-0 pr-4">
                    <h5 className="font-semibold text-sm text-white leading-tight transition-colors group-hover:text-primary max-sm:text-xs">
                      {issue.title}
                    </h5>
                    <p className="mt-1 line-clamp-1 text-muted-foreground/80 text-xs leading-relaxed max-sm:hidden">
                      {issue.description}
                    </p>
                  </div>

                  {/* Impact */}
                  <div className="max-sm:hidden">
                    <span className="font-semibold text-emerald-400 text-xs tracking-wide">
                      {issue.business_impact?.estimated_improvement ??
                        "Significant"}
                    </span>
                  </div>

                  {/* Action Arrow — opens sheet */}
                  <div className="flex justify-end">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSheetIssue(issue);
                      }}
                      appearance={"ghost"}
                      color={"secondary"}
                      size={"icon"}
                    >
                      <ArrowRight className="transition group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Business Impact Summary */}
        {activeIssue?.business_impact && (
          <div>
            <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Business Impact
            </p>
            <Card className="border border-white/5 bg-neutral-900/30 backdrop-blur-xs">
              <CardContent className="pt-5">
                <div className="mb-4 flex items-start justify-between gap-4 border-white/5 border-b pb-4">
                  <div>
                    <span className="mb-1 block text-muted-foreground text-xs">
                      Metric affected
                    </span>
                    <span className="font-semibold text-sm text-white leading-tight">
                      {activeIssue.business_impact.metric_affected}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="mb-1 block text-muted-foreground text-xs">
                      Estimated improvement
                    </span>
                    <span className="block font-bold text-emerald-400 text-sm tracking-wide">
                      {activeIssue.business_impact.estimated_improvement}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                  {activeIssue.business_impact.impact_description ??
                    activeIssue.description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <IssueDetailSheet
        issue={sheetIssue}
        open={!!sheetIssue}
        onOpenChange={(open) => !open && setSheetIssue(null)}
      />
    </>
  );
};

// Export under both names — ConversionOptimization is the established name,
// AuditDetailsCategoryView kept so any remaining imports don't break.
export const ConversionOptimization = IssuesView;
export const AuditDetailsCategoryView = IssuesView;
