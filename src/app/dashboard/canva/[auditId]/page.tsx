import { CanvaPage } from "@/features/canva/components/canva-page";

const CanvaAuditId = async ({
  params,
}: PageProps<"/dashboard/canva/[auditId]">) => {
  const { auditId } = await params;

  return <CanvaPage auditId={auditId} />;
};

export default CanvaAuditId;
