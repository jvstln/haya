import type z from "zod";
import type { QueryParams } from "@/types/type";
import type { newAuditSchema } from "./audit.schema";
import type * as AnalysisService from "./audit.service";

export type NewAudit = z.infer<typeof newAuditSchema>;
export type NewAuditInput = z.input<typeof newAuditSchema>;

export type AuditStatus = "pending" | "completed" | "failed" | "in_progress";

export type AuditQueryParams = QueryParams & {
  status?: AuditStatus;
};

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

export interface ParsedAudit extends Omit<Audit, "content"> {
  content: ReturnType<typeof AnalysisService.parseContent>;
}

export interface AuditPage {
  pageName: string;
  pageUrl: string;
  sections: AuditSection[];
}

export interface AuditSection {
  category: string;
  screenshotUrl: string;
  textContent: string;
  aiAnalysis: {
    problems: string[];
    solutions: string[];
  } | null;
  meta: {
    sectionNumber: number;
    accent: `--color-${string}`;
  };
}

/** @deprecated use AuditSection */
export interface DetailedAuditSection extends Omit<AuditSection, "aiAnalysis"> {
  aiAnalysis: DetailedAiAnalysis;
}

/** @deprecated use AuditSection.aiAnalysis */
export interface DetailedAiAnalysis {
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
}
