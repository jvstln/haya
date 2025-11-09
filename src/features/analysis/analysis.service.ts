import z from "zod";
import { api } from "@/lib/api";
import type { Analysis, NewAnalysis } from "./analysis.type";

/**
 * Fetch ALL analysis
 */
async function getAnalyses() {
  const response = await api.get<Omit<Analysis, "content">[]>(
    "/analyze/analysis"
  );
  return response.data;
}

/**
 * Fetch a single analysis
 * @param analysisId The analysis id of the analysis to fetch
 */
async function getAnalysis(analysisId: string) {
  const response = await api.get<Analysis>(`/analyze/analysis/${analysisId}`);
  return response.data;
}

async function getAnalysisView(analysisId: string) {
  const response = await api.get(`/analyze/analysis/${analysisId}/view`);
  return response.data;
}

async function createAnalysis(analysisData: NewAnalysis) {
  const response = await api.post<Analysis>("/analyze/analysis", {
    url: analysisData.urls[0],
  });
  return response.data;
}

async function deleteAnalyses() {
  const response = await api.delete("/analyze/analysis");
  return response.data;
}

function parseContent(content: string) {
  try {
    const jsonContent = z.json().parse(JSON.parse(content));
    if (!jsonContent || typeof jsonContent !== "object") return null;

    if (Array.isArray(jsonContent)) {
      return null;
    }

    let image = (jsonContent.sections as any[])?.[0].screenshot as string;
    if (!image.startsWith("data:image")) {
      image = `data:image/png;base64,${image}`;
    }

    return {
      image,
      imageInBase64: image.slice(image.indexOf(",") + 1),
      original: jsonContent,
    };
  } catch (error) {
    console.log("Error parsing analysis content", error, content);
    return null;
  }
}

export {
  getAnalyses,
  getAnalysis,
  getAnalysisView,
  createAnalysis,
  deleteAnalyses,
  parseContent,
};
