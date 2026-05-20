import type z from "zod";
import type { QueryParams } from "@/types";
import type { newAuditSchema } from "./audit.schema";

export type NewAudit = z.infer<typeof newAuditSchema>;
export type NewAuditInput = z.input<typeof newAuditSchema>;

export type AuditType = NewAudit["audit_type"];

export type AuditStatus = "pending" | "completed" | "failed" | "in_progress";

export type AuditFilters = QueryParams & {
  status?: AuditStatus;
  teamId?: string;
};

export interface AuditWithoutContent {
  _id: string;
  url: string;
  status: AuditStatus;
  teamId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  firstImageUrl?: string;
  audit_type: AuditType;

  customSections: AuditCustomSection[];
}

export type Audit = AuditWithoutContent & {
  content?: {
    audit_summary?: AuditSummary;
    pages: AuditPageV2[];
    categories?: AuditCategoryGroup[];
    totalPages: number;
    completedPages: number;
    progressPercentage: number;
    lastUpdated: string;
    growth_roadmap?: GrowthRoadmap;
    conversion_roadmap?: ConversionRoadmap;
  } | null;
};

// ============================================================================
// V1 Types (Legacy - kept for backwards compatibility)
// ============================================================================

export interface AuditPageV1 {
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

export type UploadedImage = {
  imageUrl: string;
  imagePublicId: string;
};

export interface AuditCustomSection {
  _id: string;
  sectionName: string;
  imageUrl: string;
  imagePublicId: string;
  aiAnalysis: AuditSectionAnalysis | null;
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

// ============================================================================
// V2 Types (New Analysis Engine)
// ============================================================================

export type AuditCategory =
  | "marketing"
  | "seo"
  | "visual_design"
  | "onboarding"
  | "conversion_optimization"
  | string;

export type IssueSeverity = "critical" | "high" | "medium" | "low";

export type Complexity = "low" | "medium" | "high";

export interface Solution {
  recommendation: string;
  implementation_steps: string[];
  complexity: Complexity;
  estimated_effort: string;
}

export interface BusinessImpact {
  metric_affected: string;
  impact_description: string;
  estimated_improvement: string;
}

export interface AuditIssue {
  issue_id: string;
  audit_category: AuditCategory;
  title: string;
  description: string;
  root_cause: string;
  affected_element: string;
  solution: Solution;
  business_impact: BusinessImpact;
  severity: IssueSeverity;
  priority_score: number;
  meta?: {
    issueNumber: number;
  };
}

export interface CategoryRoadmap {
  immediate_wins: string[];
  short_term_fixes: string[];
  strategic_improvements: string[];
}

export interface AuditCategoryGroup {
  id: string;
  name: string;
  score: number;
  issues: AuditIssue[];
  roadmap: CategoryRoadmap;
}

export interface PageStatus {
  status: "pending" | "in_progress" | "completed" | "failed";
  startedAt: string;
  completedAt: string;
}

export interface AuditPageV2 extends PageStatus {
  pageUrl: string;
  pageName: string;
  screenshotUrl: string;
  textContent: string;
  page_score: number;
  issues: AuditIssue[];
}

export interface AuditSummary {
  overall_score: number;
  critical_issues_count: number;
  quick_wins_count: number;
  total_findings: number;
  top_priority: string;
  business_health_verdict: string;
}

export interface GrowthRoadmap {
  immediate_wins: string[];
  short_term_fixes: string[];
  strategic_improvements: string[];
}

export interface ConversionRoadmap {
  immediate_wins: string[];
  short_term_fixes: string[];
  strategic_improvements: string[];
}

// ============================================================================
// Legacy type alias for backwards compatibility
// ============================================================================

/** @deprecated Use AuditPageV1 instead */
export type AuditPage = AuditPageV1;

export type PreAuditInfo = {
  status: boolean;
  rootUrl: string;
  pages: Array<{
    url: string;
    name: string;
  }>;
  pageCount: number;
  pricing: {
    pageCount: number;
    pricePerPage: number;
    totalPriceUsd: number;
    currency: string;
    network: string;
  };
  tokenBalance: {
    analysisTokens: number;
    tokenCostPerAnalysis: number;
    enoughForFreeAnalysis: boolean;
    freeTierMaxPages: number;
  };
  recommendation: string;
};
