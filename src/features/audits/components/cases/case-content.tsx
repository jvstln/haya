import { ArrowDown2 } from "iconsax-reactjs";
import Image from "next/image";
import { type CSSProperties, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn, random, toTitleCase } from "@/lib/utils";
import type {
  AuditSection,
  AuditSectionAnalysis,
  DetailedAuditSection,
} from "../../audit.type";

export const ProblemsAndSolutionsCaseSection = ({
  section,
}: {
  section: AuditSection;
}) => {
  return (
    <Collapsible className="rounded-md border text-white">
      <CollapsibleTrigger asChild>
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
            appearance="ghost"
            color="secondary"
            size="icon"
            className="ml-auto in-data-[state=open]:rotate-180"
          >
            <ArrowDown2 />
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-6 pb-4.5 text-sm [&_h3]:mb-4 [&_h3]:font-semibold [&_h3~:not(ul,li)]:ml-3 [&_h4]:mb-2 [&_h4]:font-medium [&_li]:mb-2 [&_section]:mb-4 [&_ul]:list-disc [&_ul]:pl-4">
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
        </div>
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

export const SeoCaseSection = ({ section }: { section: AuditSection }) => {
  return (
    <Collapsible className="rounded-md border text-white">
      <CollapsibleTrigger asChild>
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
          <div className="ml-auto flex items-center gap-2">
            {section.aiAnalysis?.uxScore && (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-medium text-xs">
                Score: {section.aiAnalysis.uxScore}/10
              </span>
            )}
            <Button
              appearance="ghost"
              color="secondary"
              size="icon"
              className="in-data-[state=open]:rotate-180"
            >
              <ArrowDown2 />
            </Button>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-4.5 text-sm [&_h3]:mb-4 [&_h3]:font-semibold [&_h3~:not(ul,li)]:ml-3 [&_h4]:mb-2 [&_h4]:font-medium [&_li]:mb-2 [&_section]:mb-4 [&_ul]:list-disc [&_ul]:pl-4">
        {section.aiAnalysis?.productClassification && (
          <section>
            <h3>Product Classification</h3>
            <ul className="list-none pl-0!">
              <li>
                <strong>Category: </strong>
                {section.aiAnalysis.productClassification.category}
              </li>
              <li>
                <strong>Primary User Goal: </strong>
                {section.aiAnalysis.productClassification.primaryUserGoal}
              </li>
              <li>
                <strong>Primary User Type: </strong>
                {section.aiAnalysis.productClassification.primaryUserType}
              </li>
            </ul>
          </section>
        )}

        {section.aiAnalysis?.issueDetails && (
          <section>
            <h3>Issue Details</h3>
            {section.aiAnalysis.issueDetails.length > 0 ? (
              <div className="flex flex-col gap-4">
                {section.aiAnalysis.issueDetails.map((detail, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: no unique id available
                    key={index}
                    className="rounded-md bg-white/5 p-3"
                  >
                    <div className="mb-2 font-medium">{detail.issue}</div>
                    <div className="mb-1 text-xs opacity-80">
                      <strong>Impact: </strong>
                      {detail.userImpact}
                    </div>
                    <div className="text-xs opacity-80">
                      <strong>Violated Law: </strong>
                      {detail.uxLawViolated}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic">No issues found</p>
            )}
          </section>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
