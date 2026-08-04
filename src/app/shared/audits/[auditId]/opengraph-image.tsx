import { getAudit } from "@/features/audits/audit.service";
import type { Audit } from "@/features/audits/audit.type";
import { OG_IMAGE_SIZE, renderAuditOgImage } from "./audit-og-image";

export const alt = "Haya UX Audit Report";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ auditId: string }>;
}) {
  const { auditId } = await params;

  let audit: Audit | null = null;
  try {
    audit = await getAudit(auditId);
  } catch {
    // Not publicly accessible (e.g. shared via ?token=): render branded fallback.
  }

  return renderAuditOgImage(audit);
}
