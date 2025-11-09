import type z from "zod";
import type { analysisModeSchema, newAnalysisSchema } from "./analysis.schema";
import type * as AnalysisService from "./analysis.service";

export type AnalysisMode = z.infer<typeof analysisModeSchema>;
export type NewAnalysis = z.infer<typeof newAnalysisSchema>;
export type NewAnalysisInput = z.input<typeof newAnalysisSchema>;

export type AnalysisStatus = "pending" | "completed" | "failed";

export type AnalysisType = "Website_Analysis" | string; // Allowing string for potential future types

export interface Analysis {
  _id: string;
  url: string;
  status: AnalysisStatus;
  analysis_type: AnalysisType;
  createdAt: string;
  updatedAt: string;
  content: string;
}

export interface ParsedAnalysis extends Omit<Analysis, "content"> {
  content: ReturnType<typeof AnalysisService.parseContent>;
}
