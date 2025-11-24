import type z from "zod";
import type { newAuditSchema } from "./audit.schema";
import type * as AnalysisService from "./audit.service";

export type NewAudit = z.infer<typeof newAuditSchema>;
export type NewAuditInput = z.input<typeof newAuditSchema>;

export type AuditStatus = "pending" | "completed" | "failed";

export type AuditType = "Website_Analysis" | string; // Allowing string for potential future types

export interface Audit {
  _id: string;
  url: string;
  status: AuditStatus;
  analysis_type: AuditType;
  createdAt: string;
  updatedAt: string;
  content: string;
}

export interface ParsedAnalysis extends Omit<Audit, "content"> {
  content: ReturnType<typeof AnalysisService.parseContent>;
}

export interface AuditSection {
  category: string;
  screenshotUrl: string;
  textContent: string;
  aiAnalysis: {
    visual_hierarchy_and_information_architecture: {
      element_order_by_importance: string;
      layout_guides_user_to_conversion: string;
      above_the_fold_effectiveness: string;
    };
    conversion_psychology: {
      hero_communication: string;
      primary_cta: string;
      friction_and_cognitive_load: string;
    };
    ux_laws_and_violations: Array<{
      law: string;
      violation: boolean;
      explanation: string;
    }>;
    clarity_and_readability: {
      text_legibility_across_devices: string;
      accessibility_wcag_2_1: string;
      jargon_free_messaging: string;
    };
    industry_specific_best_practices: {
      ai_saas: string;
      blockchain: string;
      b2b: string;
      web3_or_onchain_apps: string;
    };
    accessibility_and_inclusivity: {
      wcag_contrast_and_alt_text: string;
      screen_reader_and_keyboard_navigation: string;
    };
    suggested_fixes_for_ux_violations: Array<{
      broken_law: string;
      suggested_solutions: string[];
    }>;
    benchmark_comparison: {
      hero_section_comparison: string;
    };
  };
  meta: {
    sectionNumber: number;
    accent: `--color-${string}`;
  };
}
