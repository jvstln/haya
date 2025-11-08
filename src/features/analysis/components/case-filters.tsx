"use client";
import { ArrowDown2 } from "iconsax-reactjs";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cn } from "@/lib/utils";
import { caseFiltersSchema } from "../analysis.schema";
import type {
  CaseFilters as CaseFiltersType,
  ParsedAnalysis,
} from "../analysis.type";

type CaseFiltersProps = {
  filters: CaseFiltersType;
  setFilters: Dispatch<SetStateAction<CaseFiltersType>>;
  analysis: ParsedAnalysis;
};

export const CaseFilters = ({
  filters,
  setFilters,
  analysis,
}: CaseFiltersProps) => {
  const isTablet = useBreakpoint("max-lg");

  return (
    <ScrollArea>
      <div className="sticky top-(--header-height) flex h-13 items-center gap-4 border-b bg-background p-3.5">
        <span>{analysis.url}</span>
        <Select
          value={filters.screen}
          onValueChange={(value: CaseFiltersType["screen"]) => {
            setFilters({ ...filters, screen: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a screen" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(caseFiltersSchema.shape.screen.enum).map(
              (screen) => (
                <SelectItem key={screen} value={screen}>
                  {screen}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <span className="ml-auto">Pages</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2">
          {Object.values(caseFiltersSchema.shape.page.enum).map((page) => (
            <Button
              key={page}
              variant="ghost"
              className={cn("px-4 capitalize")}
              data-active={page === filters.page}
              onClick={() => setFilters({ ...filters, page })}
            >
              {page} Page
            </Button>
          ))}
        </div>
        {isTablet ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                More
                <ArrowDown2 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => {
                  setFilters((f) => ({
                    ...f,
                    showAnalysisDetails: !f.showAnalysisDetails,
                  }));
                }}
              >
                Show Analysis {filters.showAnalysisDetails ? "UI" : "Details"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Separator orientation="vertical" />
            <span>Analyze</span>
            <Button
              variant="ghost"
              data-active={filters.analysisView === "findings"}
            >
              Findings
            </Button>
            <Button
              variant="ghost"
              data-active={filters.analysisView === "terminal"}
            >
              Terminal
            </Button>
          </>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
