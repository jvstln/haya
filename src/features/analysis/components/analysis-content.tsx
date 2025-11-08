"use client";

import { AlertCircle, CheckCircle, ChevronUp, XCircle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toTitleCase } from "@/lib/utils";
import type { ParsedAnalysis } from "../analysis.type";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Collapsible className="mb-4 overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
    <CollapsibleTrigger className="flex w-full items-center justify-between bg-linear-to-r from-blue-100/10 to-indigo-100/10 px-6 py-4 transition-all data-[state=closed]:[&_svg]:rotate-180">
      <h3 className="font-semibold text-lg">{title}</h3>
      <ChevronUp />
    </CollapsibleTrigger>
    <CollapsibleContent className="px-6 py-4">{children}</CollapsibleContent>
  </Collapsible>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-3">
    <p className="mb-1 font-medium text-sm text-white">{label}</p>
    <p className="">{value}</p>
  </div>
);

export const AnalysisContent = ({ analysis }: { analysis: ParsedAnalysis }) => {
  const analysisArray = (analysis.content?.original?.sections as any[]) || [];
  const currentAnalysis = analysisArray[0];

  const renderObjectAsInfoItems = (obj: any) => {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value !== "string") return null;

      return <InfoItem key={key} label={toTitleCase(key)} value={value} />;
    });
  };

  return (
    <div className="mx-auto min-h-screen w-full p-6">
      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-sm">
        <h2 className="mb-3 font-semibold text-xl">Content Overview</h2>

        <div className="rounded border border-white/10 p-4">
          <p className="mb-1 font-medium text-sm">Text Content:</p>
          <pre className="whitespace-pre-wrap">
            {currentAnalysis.textContent}
          </pre>
        </div>
      </div>

      {currentAnalysis.aiAnalysis
        .visual_hierarchy_and_information_architecture && (
        <Section title="Visual Hierarchy & Information Architecture">
          {renderObjectAsInfoItems(
            currentAnalysis.aiAnalysis
              .visual_hierarchy_and_information_architecture
          )}
        </Section>
      )}

      {currentAnalysis.aiAnalysis.conversion_psychology && (
        <Section title="Conversion Psychology">
          {renderObjectAsInfoItems(
            currentAnalysis.aiAnalysis.conversion_psychology
          )}
        </Section>
      )}

      {currentAnalysis.aiAnalysis.ux_laws_and_violations && (
        <Section title="UX Laws & Violations">
          <div className="space-y-4">
            {currentAnalysis.aiAnalysis.ux_laws_and_violations.map(
              (law: any, index: number) => (
                <div
                  key={`${index}-${law.law}`}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-2 flex items-center gap-3">
                    {law.violation ? (
                      <XCircle className="shrink-0 text-red-500" size={20} />
                    ) : (
                      <CheckCircle
                        className="shrink-0 text-green-500"
                        size={20}
                      />
                    )}
                    <h4 className="font-semibold text-gray-900">{law.law}</h4>
                    <span
                      className={`ml-auto rounded px-2 py-1 font-medium text-xs ${
                        law.violation
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {law.violation ? "Violation" : "Compliant"}
                    </span>
                  </div>
                  <p className="ml-8 text-gray-700 text-sm">
                    {law.explanation}
                  </p>
                </div>
              )
            )}
          </div>
        </Section>
      )}

      {currentAnalysis.aiAnalysis.clarity_and_readability && (
        <Section title="Clarity & Readability">
          {renderObjectAsInfoItems(
            currentAnalysis.aiAnalysis.clarity_and_readability
          )}
        </Section>
      )}

      {currentAnalysis.aiAnalysis.industry_specific_best_practices && (
        <Section title="Industry-Specific Best Practices">
          {renderObjectAsInfoItems(
            currentAnalysis.aiAnalysis.industry_specific_best_practices
          )}
        </Section>
      )}

      {currentAnalysis.aiAnalysis.accessibility_and_inclusivity && (
        <Section title="Accessibility & Inclusivity">
          {renderObjectAsInfoItems(
            currentAnalysis.aiAnalysis.accessibility_and_inclusivity
          )}
        </Section>
      )}

      {currentAnalysis.aiAnalysis.suggested_fixes_for_ux_violations && (
        <Section title="Suggested Fixes for UX Violations">
          <div className="space-y-4">
            {currentAnalysis.aiAnalysis.suggested_fixes_for_ux_violations.map(
              (fix: any, index: number) => (
                <div
                  key={`${index}-${fix.broken_law}`}
                  className="rounded-lg border border-amber-200 bg-amber-50 p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle
                      className="shrink-0 text-amber-600"
                      size={20}
                    />
                    <h4 className="font-semibold text-gray-900">
                      {fix.broken_law}
                    </h4>
                  </div>
                  <p className="mb-2 font-medium text-gray-700 text-sm">
                    Suggested Solutions:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-1">
                    {fix.suggested_solutions.map(
                      (solution: any, idx: number) => (
                        <li
                          key={`${idx}-${solution}`}
                          className="text-gray-700 text-sm"
                        >
                          {solution}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )
            )}
          </div>
        </Section>
      )}

      {currentAnalysis.aiAnalysis.benchmark_comparison && (
        <Section title="Benchmark Comparison">
          {renderObjectAsInfoItems(
            currentAnalysis.aiAnalysis.benchmark_comparison
          )}
        </Section>
      )}
    </div>
  );
};
