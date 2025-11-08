"use client";
import { ArrowLeft } from "iconsax-reactjs";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import type { CaseFilters as CaseFiltersType } from "@/features/analysis/analysis.type";
import { AnalyzedDetails } from "@/features/analysis/components/analysis-details";
import { CaseFilters as CaseFiltersComponent } from "@/features/analysis/components/case-filters";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useAnalysis } from "../analysis.api";
import { AnalysisContent } from "./analysis-content";

const quickActionButtons: Array<{
  label: string;
  value: CaseFiltersType["quickAction"];
}> = [
  { label: "Conversion Psychology", value: "conversionPsychology" },
  {
    label: "Visual Hierarchy & Information Architecture",
    value: "visualHierarchy",
  },
] as const;

export const CaseAnalysisPage = ({ caseId }: { caseId: string }) => {
  const analysis = useAnalysis(caseId);
  const isTablet = useBreakpoint("max-lg");

  const [filters, setFilters] = useState<CaseFiltersType>({
    screen: "desktop",
    page: "home",
    analysisView: "findings",
    quickAction: "conversionPsychology",
    showAnalysisDetails: false,
  });

  const analysisHeader = (
    <div className="sticky top-(--header-height) z-10 h-20 bg-linear-to-b from-95% from-background p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h4 className="text-2xl">Analysis findings</h4>
        <Button
          variant="ghost"
          onClick={() =>
            setFilters((f) => ({ ...f, showAnalysisDetails: false }))
          }
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );

  if (analysis.isPending) {
    return (
      <div className="absolute inset-0 grid place-content-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  if (analysis.isError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-red-500">
        Error fetching analysis
        <Button
          className=""
          variant="outline"
          onClick={() => analysis.refetch()}
          isLoading={analysis.isRefetching}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (analysis.data.status === "pending") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-xl">
        <span>
          Analysis for "
          <Link
            href={analysis.data.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {analysis.data.url}
          </Link>
          " is not yet ready
        </span>
        <Button asChild variant="outline">
          <Link href="/dashboard/analyze/cases">View completed analysis</Link>
        </Button>
      </div>
    );
  }

  if (analysis.data.status === "failed") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-xl">
        <span className="text-red-500">
          Failed to analyze "
          <Link
            href={analysis.data.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {analysis.data.url}
          </Link>
          "
        </span>
        <Button asChild variant="outline" className="hover:gap-4">
          <Link href="/dashboard/analyze">
            <ArrowLeft />
            Take me back
          </Link>
        </Button>
      </div>
    );
  }

  if (isTablet && filters.showAnalysisDetails) {
    return <AnalysisContent analysis={analysis.data} />;
  }

  console.log(analysis.data);

  return (
    <>
      <CaseFiltersComponent
        filters={filters}
        setFilters={setFilters}
        analysis={analysis.data}
      />

      <div className="flex h-[calc(100vh-var(--header-height)-(var(--spacing)*13))] min-h-[400px] w-full">
        {/* Analyzed Image Section */}
        {!(isTablet && filters.showAnalysisDetails) && (
          <ScrollArea type="auto" className="flex-1 p-4">
            <div className="relative mx-auto min-h-40 max-w-4xl">
              {analysis.data?.content?.image && (
                <picture>
                  <img
                    src={analysis.data.content.image}
                    alt="Analyzed page"
                    className="mx-auto size-full"
                  />
                </picture>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Analyzed Details Section */}
        {filters.showAnalysisDetails && (
          <AnalysisContent analysis={analysis.data} />
        )}

        {!isTablet && (
          <ScrollArea type="auto" className="w-125 border-l pt-4">
            <AnalysisContent analysis={analysis.data} />
          </ScrollArea>
        )}
      </div>
    </>
  );
};

const AnalysisDetailsMobileView = ({
  filters,
  setFilters,
}: {
  filters: CaseFiltersType;
  setFilters: Dispatch<SetStateAction<CaseFiltersType>>;
}) => {
  return (
    <>
      <div className="sticky top-(--header-height) z-10 h-30 bg-linear-to-b from-95% from-background p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h4 className="text-lg">Analysis findings</h4>
          <Button
            variant="ghost"
            onClick={() =>
              setFilters((f) => ({ ...f, showAnalysisDetails: false }))
            }
          >
            <XIcon />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span>Analyze</span>
          <Button
            variant="ghost"
            data-active={filters.analysisView === "findings"}
            onClick={() => setFilters({ ...filters, analysisView: "findings" })}
          >
            Findings
          </Button>
          <Button
            variant="ghost"
            data-active={filters.analysisView === "terminal"}
            onClick={() => setFilters({ ...filters, analysisView: "terminal" })}
          >
            Terminal
          </Button>
        </div>
      </div>

      <div className="w-full px-6 pt-4">
        <AnalyzedDetails filters={filters} />
      </div>

      <div className="sticky bottom-0 bg-linear-to-t from-95% from-background">
        <ScrollArea>
          <div className="flex gap-4 p-2.5 px-6">
            {quickActionButtons.map(({ value, label }) => (
              <Button
                key={value}
                variant="ghost"
                data-active={filters.quickAction === value}
                onClick={() => setFilters({ ...filters, quickAction: value })}
              >
                {label}
              </Button>
            ))}
            <ScrollBar orientation="horizontal" />
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
