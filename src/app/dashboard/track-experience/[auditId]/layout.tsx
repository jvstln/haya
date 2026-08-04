import type { Metadata } from "next";
import * as AuditService from "@/features/audits/audit.service";

export const generateMetadata = async ({
  params,
}: LayoutProps<"/dashboard/track-experience/[auditId]">): Promise<Metadata> => {
  try {
    const { auditId } = await params;
    const audit = await AuditService.getAudit(auditId);

    const summary = audit.content?.audit_summary;
    const description = summary
      ? `Haya UX audit for ${audit.url} — ${summary.overall_score}/100 overall score with ${summary.total_findings} findings.`
      : `AI-powered UX audit for ${audit.url}.`;

    return {
      title: audit.url,
      description,
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch (_error) {
    return {
      title: "Audit analysis",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
