import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CaseResult, NewAnalysis } from "./analysis.type";
import { toast } from "sonner";

export const getAnalysisResult = async (analysisId: string) => {
  const response = await api.get<CaseResult>(`/analyze/analysis/${analysisId}`);
  return response.data;
};

export const getAnalysisView = async (analysisId: string) => {
  const response = await api.get(`/analyze/analysis/${analysisId}/view`);
  return response.data;
};

export const useAnalysisResult = (analysisId: string) => {
  return useQuery({
    queryKey: ["analysisResult", analysisId],
    queryFn: () => getAnalysisResult(analysisId),
  });
};

export const useAnalysisView = (analysisId: string) => {
  return useQuery({
    queryKey: ["analysisView", analysisId],
    queryFn: () => getAnalysisView(analysisId),
  });
};

export const useCreateAnalysis = () => {
  return useMutation({
    mutationFn: async (analysisData: NewAnalysis) => {
      const response = await api.post<CaseResult>(`/analyze/analysis`, {
        url: analysisData.urls[0],
      });
      return response.data;
    },
    onError: (error) => toast.error(`Error: ${error.message}`),
  });
};
