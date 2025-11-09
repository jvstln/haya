import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import * as AnalysisService from "./analysis.service";

/**
 * Fetch a single analysis
 * @param analysisId The analysis id of the analysis to fetch
 */
export const useAnalysis = (analysisId: string) => {
  const refetchCount = useRef(0);

  const query = useQuery({
    queryKey: ["analysis", analysisId],
    queryFn: () => AnalysisService.getAnalysis(analysisId),
    select(data) {
      return {
        ...data,
        content: AnalysisService.parseContent(data.content),
      };
    },
    refetchInterval(query) {
      // Refetch analysis every ^2 seconds (exponentially.. 2 4 8 16s) if status is pending
      const status = query.state.data?.status;
      if (!status || status !== "pending") {
        refetchCount.current = 0;
        return false;
      }

      return 1000 * 2 ** ++refetchCount.current;
    },
  });

  return { ...query, refetchCount: refetchCount.current };
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
    onSuccess: () => toast.success("Analysis started successfully"),
  });
};

export const useDeleteAnalyses = () => {
  return useMutation({
    mutationFn: AnalysisService.deleteAnalyses,
    onError: (error) => toast.error(`Error: ${error.message}`),
    onSuccess: () => {
      toast.success("All analyses deleted successfully");
      invalidateQueries();
    },
  });
};

function invalidateQueries() {
  ["analysis", "analyses"].map((key) =>
    queryClient.invalidateQueries({ queryKey: [key] })
  );
}
