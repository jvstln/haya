import { ArrowUp2 } from "iconsax-reactjs";
import Image from "next/image";
import { type CSSProperties, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn, random, toTitleCase } from "@/lib/utils";
import type { AuditSection, DetailedAuditSection } from "../../audit.type";

export const CaseSection = ({ section }: { section: AuditSection }) => {
  return (
    <Collapsible className="rounded-md border text-white">
      <CollapsibleTrigger title={section.textContent} asChild>
        <div className="flex w-full cursor-pointer items-center gap-3 px-6 pt-4.5 pb-6">
          <div
            className="flex size-5 shrink-0 items-center justify-center rounded-full p-1 text-background text-xs"
            style={{ background: `var(${section.meta.accent})` }}
          >
            {section.meta.sectionNumber}
          </div>
          <h2 className="truncate font-semibold text-sm">
            {section.category !== "content"
              ? section.category
              : section.textContent}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto in-data-[state=open]:rotate-180"
          >
            <ArrowUp2 />
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-4.5 text-sm [&_h3]:mb-4 [&_h3]:font-semibold [&_h3~:not(ul,li)]:ml-3 [&_h4]:mb-2 [&_h4]:font-medium [&_li]:mb-2 [&_section]:mb-4 [&_ul]:list-disc [&_ul]:pl-4">
        <Collapsible
          className="-m-2 mb-4 rounded-md border p-2"
          defaultOpen={false}
        >
          <CollapsibleTrigger asChild>
            <h3 className="mb-0! flex cursor-pointer items-center justify-between gap-2">
              Content
              <span
                className="ml-auto rounded-sm border px-1 py-0.5 text-xs"
                style={{ backgroundColor: `var(${section.meta.accent})` }}
              >
                {section.category}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="in-data-[state=open]:rotate-180"
              >
                <ArrowUp2 />
              </Button>
            </h3>
          </CollapsibleTrigger>
          <CollapsibleContent>{section.textContent}</CollapsibleContent>
        </Collapsible>

        <section>
          <h3>Problems</h3>
          {section.aiAnalysis?.problems ? (
            <ul>
              {section.aiAnalysis.problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          ) : (
            <p className="italic">No problems found</p>
          )}
        </section>

        <section>
          <h3>Solutions</h3>
          {section.aiAnalysis?.solutions ? (
            <ul className="marker:content-[✔️✅☑️]">
              {section.aiAnalysis.solutions.map((solution) => (
                <li key={solution}>{solution}</li>
              ))}
            </ul>
          ) : (
            <p className="italic">No solutions found</p>
          )}
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
};

/** @deprecated Use the CaseSection instead */
export const DetailedCaseSection = ({
  section,
}: {
  section: DetailedAuditSection;
}) => {
  return (
    <Collapsible className="rounded-md border text-white">
      <CollapsibleTrigger title={section.textContent} asChild>
        <div className="flex w-full cursor-pointer items-center gap-3 px-6 pt-4.5 pb-6">
          <div
            className="flex size-5 shrink-0 items-center justify-center rounded-full p-1 text-background text-xs"
            style={{ background: `var(${section.meta.accent})` }}
          >
            {section.meta.sectionNumber}
          </div>
          <h2 className="truncate font-semibold text-sm">
            {section.category !== "content"
              ? section.category
              : section.textContent}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto in-data-[state=open]:rotate-180"
          >
            <ArrowUp2 />
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-4.5 text-sm [&_h3]:mb-4 [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:font-medium [&_li]:mb-2 [&_ul]:list-disc [&_ul]:pl-4">
        {section.aiAnalysis.visual_hierarchy_and_information_architecture && (
          <>
            <h3>Visual Hierarchy &amp; Information Architecture</h3>
            <ul>
              {Object.entries(
                section.aiAnalysis.visual_hierarchy_and_information_architecture
              ).map(([key, value]) => (
                <li key={key}>
                  <strong>{toTitleCase(key)}: </strong>
                  {value}
                </li>
              ))}
            </ul>
          </>
        )}

        {section.aiAnalysis.accessibility_and_inclusivity && (
          <>
            <h3>Accessibility &amp; Inclusivity</h3>
            <ul>
              {Object.entries(
                section.aiAnalysis.accessibility_and_inclusivity
              ).map(([key, value]) => (
                <li key={key}>
                  <strong>{toTitleCase(key)}: </strong>
                  {value}
                </li>
              ))}
            </ul>
          </>
        )}

        {section.aiAnalysis.benchmark_comparison && (
          <>
            <h3>Benchmark Comparison</h3>
            <ul>
              {Object.entries(section.aiAnalysis.benchmark_comparison).map(
                ([key, value]) => (
                  <li key={key}>
                    <strong>{toTitleCase(key)}: </strong>
                    {value}
                  </li>
                )
              )}
            </ul>
          </>
        )}

        {section.aiAnalysis.clarity_and_readability && (
          <>
            <h3>Clarity &amp; Readability</h3>
            <ul>
              {Object.entries(section.aiAnalysis.clarity_and_readability).map(
                ([key, value]) => (
                  <li key={key}>
                    <strong>{toTitleCase(key)}: </strong>
                    {value}
                  </li>
                )
              )}
            </ul>
          </>
        )}

        {section.aiAnalysis.conversion_psychology && (
          <>
            <h3>Conversion Psychology</h3>
            <ul>
              {Object.entries(section.aiAnalysis.conversion_psychology).map(
                ([key, value]) => (
                  <li key={key}>
                    <strong>{toTitleCase(key)}: </strong>
                    {value}
                  </li>
                )
              )}
            </ul>
          </>
        )}

        {section.aiAnalysis.industry_specific_best_practices && (
          <>
            <h3>Industry Specific Best Practices</h3>
            <ul>
              {Object.entries(
                section.aiAnalysis.industry_specific_best_practices
              ).map(([key, value]) => (
                <li key={key}>
                  <strong>{toTitleCase(key)}: </strong>
                  {value}
                </li>
              ))}
            </ul>
          </>
        )}

        {section.aiAnalysis.ux_laws_and_violations.length > 0 && (
          <>
            <h3>UX Laws and Violations</h3>
            {section.aiAnalysis.ux_laws_and_violations.map((violation) => (
              <div
                className={cn(
                  "not-last:mb-2 rounded-md p-4",
                  violation.violation ? "bg-red-500/20" : "bg-green-500/20"
                )}
                key={violation.law}
              >
                <h4>{violation.law}</h4>
                <p>{violation.explanation}</p>
              </div>
            ))}
          </>
        )}

        {section.aiAnalysis.suggested_fixes_for_ux_violations.length > 0 && (
          <>
            <h3>Suggested Fixes for UX Violations</h3>
            {section.aiAnalysis.suggested_fixes_for_ux_violations.map((fix) => (
              <div className={cn("not-last:mb-2 px-2")} key={fix.broken_law}>
                <h4>{fix.broken_law}</h4>
                <ul>
                  {fix.suggested_solutions.map((solution) => (
                    <li key={solution}>{solution}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const CaseImageSection = ({ section }: { section: AuditSection }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative border-(--accent-fade) border-2 not-first:border-t border-b shadow-(--accent-color) last:border-b-2 hover:border-(--accent-color) hover:shadow-md"
      style={
        {
          "--accent-fade": `oklch(from var(${section.meta.accent}) l c h / 0.5)`,
          "--accent-color": `var(${section.meta.accent})`,
        } as CSSProperties
      }
    >
      <Image
        src={section.screenshotUrl}
        alt={`${section.textContent}`}
        width={0}
        height={0}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="h-auto w-full"
        onLoad={() => setIsLoaded(true)}
      />
      {isLoaded && (
        <div
          className="absolute z-10 flex size-10 items-center justify-center rounded-full bg-(--accent-color) p-1 text-background text-lg"
          style={{
            top: `${random(1, 5)}%`,
            right: `${random(2, 60)}%`,
          }}
        >
          {section.meta.sectionNumber}
        </div>
      )}
    </div>
  );
};
