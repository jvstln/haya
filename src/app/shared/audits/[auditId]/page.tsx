import { notFound } from "next/navigation";
import { getAudit } from "@/features/audits/audit.service";
import { AuditDetailsPage } from "@/features/audits/components/audit-details-page";

export default async function SharedAuditRoute({
  params,
  searchParams,
}: PageProps<"/shared/audits/[auditId]">) {
  const { auditId } = await params;
  const token = String((await searchParams).token);

  try {
    await getAudit(token ?? auditId);
  } catch {
    notFound();
  }

  return <AuditDetailsPage auditId={token ?? auditId} />;
}
