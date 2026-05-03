import { formatDistanceToNow } from "date-fns";
import { Trash } from "iconsax-reactjs";
import type { Route } from "next";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { cn } from "@workspace/ui/lib/utils";
import type { AuditWithoutContent } from "../audit.type";

type AuditCardProps = {
  audit: AuditWithoutContent;
  onDelete?: (audit: AuditWithoutContent) => void;
};

export const AuditCard = ({ audit, onDelete }: AuditCardProps) => {
  return (
    <DashboardCard
      href={`/dashboard/audits/${audit._id}` as Route}
      image={audit.firstImageUrl}
      classNames={{
        root: cn(
          audit.status === "failed"
            ? "border-destructive"
            : audit.status === "in_progress"
              ? "border-blue-500"
              : audit.status === "pending"
                ? "border-amber-500"
                : undefined,
        ),
      }}
      content={
        <>
          <Avatar className="size-6">
            <AvatarImage src="" />
            <AvatarFallback className="text-sm">UN</AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-col gap-2">
            <span className="max-w-32 truncate font-semibold text-body-4 text-white">
              {audit.url}
            </span>
            <span className="text-muted-foreground text-xxs">
              Audited{" "}
              {formatDistanceToNow(audit.createdAt, {
                addSuffix: true,
              })}
            </span>
          </span>
        </>
      }
      actions={[
        ...(onDelete
          ? [
              {
                label: "Delete",
                icon: <Trash />,
                onClick: () => onDelete(audit),
                variant: "destructive" as const,
              },
            ]
          : []),
      ]}
    />
  );
};
