import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAudit } from "@/features/audits/audit.service";
import { AuditDetailsPage } from "@/features/audits/components/audit-details-page";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/shared/audits/[auditId]">): Promise<Metadata> {
  const { auditId } = await params;
  const token = String((await searchParams).token);

  try {
    const audit = await getAudit(token ?? auditId);
    const summary = audit.content?.audit_summary;
    const description = summary
      ? `Haya UX audit for ${audit.url} — ${summary.overall_score}/100 overall score with ${summary.total_findings} findings and ${summary.critical_issues_count} critical issues.`
      : `AI-powered UX audit report for ${audit.url}.`;

    return {
      title: `UX Audit Report for ${audit.url}`,
      description,
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        type: "website",
        title: `UX Audit Report for ${audit.url}`,
        description,
        url: `https://usehaya.io/shared/audits/${auditId}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `UX Audit Report for ${audit.url}`,
        description,
      },
    };
  } catch {
    return {
      title: "UX Audit Report",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

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
