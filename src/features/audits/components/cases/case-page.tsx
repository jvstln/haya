"use client";
import { ArrowLeft, Share } from "iconsax-reactjs";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HayaSpinner } from "@/components/ui/spinner";
import { random } from "@/lib/utils";
import { useAudit } from "../../audit.hook";
import { CaseSection } from "./case-content";

export const CasePage = () => {
  const params = useParams();
  const audit = useAudit(String(params.auditId));

  if (audit.isError) return "error";

  console.log(audit.data);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-5">
        <Button size="sm" variant="glass-primary">
          <ArrowLeft />
          Back to Audit Dashboard
        </Button>
        <Button variant="glass-primary" size="sm" className="ml-auto">
          <Share />
          Share Findings
        </Button>
      </div>

      <div className="grid grid-cols-2 rounded-xl bg-secondary">
        {/* top left */}
        <div
          className="flex items-center gap-1 rounded-s-xl border-transparent border-r border-b p-4"
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
          <Button variant="ghost" size="sm" className="ml-auto" data-active>
            Home
          </Button>
          <Button variant="ghost" size="sm">
            About
          </Button>
        </div>

        {/* top right */}
        <div
          className="flex items-center gap-1 rounded-e-xl border-transparent border-b p-4"
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

        {/* bottom left */}
        <div
          className="flex flex-col rounded-b-xl border-transparent border-r px-4 py-8"
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
            audit.data.content?.sections.map((section) => (
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

        {/* bottom right */}
        <div
          className="flex flex-col gap-2 rounded-b-xl border-transparent border-l px-4 py-8"
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
            audit.data.content?.sections.map((section) => (
              <CaseSection key={section.textContent} section={section} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
