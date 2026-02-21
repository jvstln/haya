import type z from "zod";
import type { QueryParams } from "@/types/type";
import type { newAuditSchema } from "./audit.schema";
import type * as AnalysisService from "./audit.service";

export type NewAudit = z.infer<typeof newAuditSchema>;
export type NewAuditInput = z.input<typeof newAuditSchema>;

export type AuditStatus = "pending" | "completed" | "failed" | "in_progress";

export type AuditFilters = QueryParams & {
  status?: AuditStatus;
};

export type AuditType = "Website_Analysis" | string; // Allowing string for potential future types

export interface AuditWithoutContent {
  _id: string;
  url: string;
  status: AuditStatus;
  analysis_type: AuditType;
  createdAt: string;
  updatedAt: string;
}

export interface RawAudit extends AuditWithoutContent {
  content: string;
}

export interface ParsedAudit extends AuditWithoutContent {
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
  aiAnalysis: AuditSectionAnalysis | null;
  meta: {
    sectionNumber: number;
    accent: `--color-${string}`;
  };
}

export type AuditSectionAnalysis = {
  problems: string[];
  solutions: string[];
  issueDetails: Array<{
    issue: string;
    userImpact: string;
    uxLawViolated: string;
  }>;
  productClassification: {
    category: string;
    primaryUserGoal: string;
    primaryUserType: string;
  };
  uxScore: number;
};
