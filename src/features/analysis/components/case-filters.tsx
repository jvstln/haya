"use client";
import { ArrowDown2 } from "iconsax-reactjs";
import Link from "next/link";
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
import type { ParsedAnalysis } from "../analysis.type";

type CaseFiltersProps = {
  filters: Record<string, string | boolean>;
  setFilters: Dispatch<SetStateAction<Record<string, string | boolean>>>;
  analysis: ParsedAnalysis;
};

export const CaseFilters = ({
  analysis,
  filters,
  setFilters,
}: CaseFiltersProps) => {
  const isTablet = useBreakpoint("max-lg");

  return (
    <ScrollArea>
      <div className="sticky top-(--header-height) flex h-13 items-center gap-4 border-b bg-background p-3.5">
        <span>{analysis.url}</span>
        <Select
          onValueChange={(value) => {
            setFilters({ ...filters, screen: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a screen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto">Pages</span>
        <Separator orientation="vertical" />
        <div className="flex gap-2">
          {["home"].map((page) => (
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
                Show analysis {filters.showAnalysisDetails ? "UI" : "details"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/analyze/cases">
                  View completed analysis
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Separator orientation="vertical" />
            <span>Analyze</span>
          </>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
