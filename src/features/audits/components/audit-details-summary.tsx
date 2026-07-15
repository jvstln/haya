import type { UseQueryResult } from "@tanstack/react-query";
import { Information } from "iconsax-reactjs";
import {
  DashboardSummary,
  DashboardSummaryCard,
} from "@/components/dashboard-ui";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceholderArrays } from "@/lib/utils";
import type { Audit } from "../audit.type";

type AuditDetailsSummaryProps = { audit: UseQueryResult<Audit> };

export const AuditDetailsSummary = ({ audit }: AuditDetailsSummaryProps) => {
  if (audit.isPending) {
    return (
      <div className="flex gap-4 *:grow">
        {getPlaceholderArrays(4).map(({ id }) => (
          <Skeleton key={id} className="h-24" />
        ))}
      </div>
    );
  }

  if (!audit.data?.content?.audit_summary) {
    return (
      <Card className="items-center text-center">
        <CardTitle className="text-amber-500 text-h3">
          No summary info collected
        </CardTitle>
        <span className="text-amber-300">
          You can try analyzing the url again.
        </span>
      </Card>
    );
  }

  return (
    <DashboardSummary>
      <DashboardSummaryCard
        title="Top priority"
        value={audit.data.content.audit_summary?.top_priority}
      />
      {[
        // {
        //   label: "Business health",
        //   value: audit.data.content.audit_summary.business_health_verdict,
        //   className: "[--fg:var(--color-green-500)]",
        // },
        {
          label: "Top issues",
          value: audit.data.content.audit_summary?.critical_issues_count,
          className: "[--fg:var(--color-red-500)]",
        },
        {
          label: "Quick wins",
          value: audit.data.content.audit_summary?.quick_wins_count,
          className: "[--fg:var(--color-yellow-500)]",
        },
        {
          label: "Overall score",
          value: audit.data.content.audit_summary?.overall_score,
          className: "[--fg:var(--color-blue-500)]",
        },
        // {
        //   label: "Total findings",
        //   value: audit.data.content.audit_summary.total_findings,
        //   className: "[--fg:var(--color-blue-500)]",
        // },
      ].map((info) => (
        <DashboardSummaryCard
          key={info.label}
          title={info.label}
          value={info.value}
          icon={Information}
          className={info.className}
        />
      ))}
    </DashboardSummary>
  );
};
