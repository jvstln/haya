"use client";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { CaseFilters as CaseFiltersType } from "@/features/analysis/analysis.type";
import { AnalyzedDetails } from "@/features/analysis/components/analysis-details";
import { CaseFilters as CaseFiltersComponent } from "@/features/analysis/components/case-filters";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import mockAnalysedImage from "@/public/mocks/analyzed-homepage.png";

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

export const CaseAnalysisPage = () => {
  const [filters, setFilters] = useState<CaseFiltersType>({
    screen: "desktop",
    page: "home",
    analysisView: "findings",
    quickAction: "conversionPsychology",
    showAnalysisDetails: true,
  });

  const isTablet = useBreakpoint("max-lg");

  if (isTablet && filters.showAnalysisDetails) {
    return (
      <AnalysisDetailsMobileView filters={filters} setFilters={setFilters} />
    );
  }

  return (
    <>
      <CaseFiltersComponent
        site={"http://cptfunded.com"}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="flex h-[calc(100vh-var(--header-height)-(var(--spacing)*13))] min-h-[400px] w-full">
        {/* Analyzed Image Section */}
        {!(isTablet && filters.showAnalysisDetails) && (
          <ScrollArea type="auto" className="flex-1 p-4">
            <div className="mx-auto max-w-4xl">
              <Image
                src={mockAnalysedImage}
                alt="Analyzed Image"
                className="mx-auto"
              />
            </div>
          </ScrollArea>
        )}

        {/* Analyzed Details Section */}
        {!isTablet && (
          <ScrollArea type="auto" className="w-125 border-l px-6 pt-10">
            <AnalyzedDetails filters={filters} />

            <div className="sticky bottom-0 bg-linear-to-t from-80% from-background pt-8 pb-4">
              <ScrollArea className="w-125 pb-2.5">
                <div className="flex gap-4">
                  {quickActionButtons.map(({ value, label }) => (
                    <Button
                      key={value}
                      variant="ghost"
                      data-active={filters.quickAction === value}
                      onClick={() =>
                        setFilters({ ...filters, quickAction: value })
                      }
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
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
