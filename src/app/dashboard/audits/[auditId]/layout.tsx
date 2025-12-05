import type { Metadata } from "next";
import * as AuditService from "@/features/audits/audit.service";

export const generateMetadata = async ({
  params,
}: LayoutProps<"/dashboard/audits/[auditId]">): Promise<Metadata> => {
  const { auditId } = await params;
  const audit = await AuditService.getAudit(auditId);

  return {
    title: {
      template: `${audit.url} | %s - Haya`,
      default: `${audit.url} - Haya`,
    },
    description: `Audit description - ${audit.content}`,
  };
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
