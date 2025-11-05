import {
  getAnalysisResult,
  getAnalysisView,
} from "@/features/analysis/analysis.api";
import { CaseAnalysisPage } from "@/features/analysis/components/case-page";

export default async ({ params }: { params: Promise<{ caseId: string }> }) => {
  const { caseId } = await params;
  try {
    const view = await getAnalysisView(caseId);
    const result = await getAnalysisResult(caseId);

    console.log("view", view);
    console.log("result", result);
  } catch (error) {
    console.log(error);
  }

  return <CaseAnalysisPage />;
};
