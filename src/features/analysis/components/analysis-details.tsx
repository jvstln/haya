"use client";
import { ArrowDown2 } from "iconsax-reactjs";
import { AlertTriangle, CheckCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CaseFilters } from "../analysis.type";

export const AnalyzedDetails = ({ filters }: { filters: CaseFilters }) => {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col text-muted-foreground text-sm leading-7",
        "[&_h3]:flex [&_h3]:items-center [&_h3]:gap-2 [&_h3]:text-white [&_section]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
      )}
    >
      <div className="mb-6 flex w-full items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-rose-300 font-bold text-sm">
            1
          </span>
          Hero Section Findings
        </h2>
        <Button variant="ghost">
          <ArrowDown2 />
        </Button>
      </div>

      <section>
        <h3>Visual Hierarchy & Information Architecture</h3>

        <h3>
          <CheckCircle size={18} /> Strengths
        </h3>
        <ul>
          <li>
            Headline (“Empowering Traders Financial Independence”) is large and
            centered—visually dominant.
          </li>
          <li>Subheadline adds clarity and supports the main value.</li>
          <li>
            CTA buttons (“CPT Funded Challenge” and “Login”) are clearly
            distinguishable and centered.
          </li>
          <li>Icons/benefits below the CTAs help reinforce trust.</li>
        </ul>
      </section>

      <section>
        <h3>
          <AlertTriangle size={18} /> Issues
        </h3>
        <ul>
          <li>
            The headline font is very large and capitalized, which can hurt
            readability and add cognitive load.
          </li>
          <li>
            The call-to-action contrast and button hierarchy are not
            optimal—both CTAs have equal weight, which can confuse users.
          </li>
          <li>
            Supporting info icons like “UPTP 80% PROFIT” are hard to scan due to
            inconsistent iconography or hierarchy.
          </li>
        </ul>
      </section>

      <section>
        <h3>
          <Wrench size={18} /> Suggested Fixes
        </h3>
        <ul>
          <li>
            Reduce headline size and use sentence case for better readability.
          </li>
          <li>
            Make “CPT Funded Challenge” the primary CTA (colored) and “Login”
            secondary (outlined or ghost).
          </li>
          <li>
            Introduce icons or visual cues with benefit badges to break text
            monotony.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-sm">Conversion Psychology</h2>
        <h3>
          <CheckCircle size={18} /> Strengths
        </h3>
        <ul>
          <li>Call-to-action placement and clarity encourage interaction.</li>
          <li>
            Make “CPT Funded Challenge” the primary CTA (colored) and “Login”
            secondary (outlined or ghost).
          </li>
          <li>
            Introduce icons or visual cues with benefit badges to break text
            monotony.
          </li>
        </ul>
      </section>
    </div>
  );
};
