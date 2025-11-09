"use client";
import { ArrowLeft, Refresh } from "iconsax-reactjs";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BouncingTextLoader } from "@/components/bouncing-text-loader";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { CaseFilters } from "@/features/analysis/components/case-filters";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useAnalysis } from "../analysis.api";
import { AnalysisContent } from "./analysis-content";

export const CaseAnalysisPage = ({ caseId }: { caseId: string }) => {
  const analysis = useAnalysis(caseId);
  const isTablet = useBreakpoint("max-lg");

  const [filters, setFilters] = useState<Record<string, string | boolean>>({
    screen: "desktop",
    page: "home",
    analysisView: "findings",
    quickAction: "conversionPsychology",
    showAnalysisDetails: true,
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
        <Spinner className="-translate-1/2 absolute top-1/2 left-1/2 size-64 opacity-5" />
        <BouncingTextLoader text={analysis.data.url} variant="smooth" />
        <span>
          Analyzing "
          <Link
            href={analysis.data.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {analysis.data.url}
          </Link>
          "...
        </span>
        {analysis.refetchCount > 3 && (
          <span className="text-base">
            If it takes too long, try reloading the page
          </span>
        )}
        <div className="mt-4 flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/analyze/cases">View completed analysis</Link>
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            <Refresh className="[&:active_*]:animate-spin" />
            Reload Page
          </Button>
        </div>
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
        <Button asChild variant="outline" className="mt-4 hover:gap-4">
          <Link href="/dashboard/analyze">
            <ArrowLeft />
            Take me back
          </Link>
        </Button>
      </div>
    );
  }

  if (!isTablet) {
    return (
      <>
        <CaseFilters
          filters={filters}
          setFilters={setFilters}
          analysis={analysis.data}
        />

        <div className="flex h-[calc(100vh-var(--header-height)-(var(--spacing)*13))] min-h-[400px] w-full">
          {/* Analyzed Image Section */}
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

          <ScrollArea type="auto" className="w-125 border-l pt-4">
            <AnalysisContent analysis={analysis.data} />
          </ScrollArea>
        </div>
      </>
    );
  }

  console.log(analysis.data);

  return (
    <>
      <CaseFilters
        filters={filters}
        setFilters={setFilters}
        analysis={analysis.data}
      />

      {filters.showAnalysisDetails ? (
        <>
          {analysisHeader}
          <AnalysisContent analysis={analysis.data} />
        </>
      ) : (
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
    </>
  );
};
