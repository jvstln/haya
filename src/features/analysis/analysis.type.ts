import type z from "zod";
import type {
  analysisModeSchema,
  caseFiltersSchema,
  newAnalysisSchema,
} from "./analysis.schema";

export type CaseFilters = z.infer<typeof caseFiltersSchema>;

export type AnalysisMode = z.infer<typeof analysisModeSchema>;
export type NewAnalysis = z.infer<typeof newAnalysisSchema>;
export type NewAnalysisInput = z.input<typeof newAnalysisSchema>;
