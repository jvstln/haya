import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import * as AuditService from "./audit.service";
import type { AuditQueryParams } from "./audit.type";

export const useAudits = (params: AuditQueryParams = {}) => {
  return useQuery({
    queryKey: ["audits", params],
    queryFn: () => AuditService.getAudits(params),
  });
};

export const useAudit = (auditId: string) => {
  const refetchCount = useRef(0);

  const query = useQuery({
    queryKey: ["audit", auditId],
    queryFn: () => AuditService.getAudit(auditId),
    select(data) {
      return {
        ...data,
        content: AuditService.parseContent(data.content),
      };
    },
    refetchInterval(query) {
      // Refetch analysis every ^2 seconds (exponentially.. 2 4 8 16s) if status is pending
      if (
        !query.state.data ||
        !AuditService.getIsAuditInProgress(query.state.data)
      ) {
        refetchCount.current = 0;
        return false;
      }

      return (10 + ++refetchCount.current) * 1000; // 10 seconds + refetchCount seconds
    },
    enabled: !!auditId,
  });

  return { ...query, refetchCount: refetchCount.current };
};

export const useCreateAudit = () => {
  return useMutation({
    mutationFn: AuditService.createAudit,
    onError: (error) => toast.error(`Error: ${error.message}`),
    onSuccess: (data) => {
      toast.success(data.message || "Case started successfully");
    },
  });
};

export const useDeleteAudits = () => {
  return useMutation({
    mutationFn: AuditService.deleteAudits,
    onError: (error) => toast.error(`Error: ${error.message}`),
    onSuccess: (data) => {
      toast.success(data.message || "All audits deleted successfully");
      invalidateQueries();
    },
  });
};

export const useDeleteAudit = () => {
  return useMutation({
    mutationFn: AuditService.deleteAudit,
    onError: (error) => toast.error(`Error: ${error.message}`),
    onSuccess: (data) => {
      toast.success(data.message || "Audit deleted successfully");
      invalidateQueries();
    },
  });
};

function invalidateQueries() {
  ["audits", "audit"].map((key) =>
    queryClient.invalidateQueries({ queryKey: [key] }),
  );
}
