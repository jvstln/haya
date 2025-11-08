import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import * as AnalysisService from "./analysis.service";

/**
 * Fetch a single analysis
 * @param analysisId The analysis id of the analysis to fetch
 */
export const useAnalysis = (analysisId: string) => {
  return useQuery({
    queryKey: ["analysis", analysisId],
    queryFn: () => AnalysisService.getAnalysis(analysisId),
    select(data) {
      return {
        ...data,
        content: AnalysisService.parseContent(data.content),
      };
    },
  });
};

/**
 * Fetch ALL analysis
 */
export const useAnalyses = () => {
  return useQuery({
    queryKey: ["analyses"],
    queryFn: AnalysisService.getAnalyses,
  });
};

export const useCreateAnalysis = () => {
  return useMutation({
    mutationFn: AnalysisService.createAnalysis,
    onError: (error) => toast.error(`Error: ${error.message}`),
  });
};
