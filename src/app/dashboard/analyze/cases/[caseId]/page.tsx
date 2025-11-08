import { CaseAnalysisPage } from "@/features/analysis/components/case-page";

export default async ({ params }: { params: Promise<{ caseId: string }> }) => {
  const { caseId } = await params;

  return <CaseAnalysisPage caseId={caseId} />;
};
