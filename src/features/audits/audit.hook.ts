import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import * as AuditService from "./audit.service";
import type { AuditFilters } from "./audit.type";
import { urlSchema } from "@/schemas";

export const useAudits = (params: AuditFilters = {}) => {
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
      // Refetch audit every 5 seconds if status is pending
      if (
        !query.state.data ||
        !AuditService.getIsAuditInProgress(query.state.data)
      ) {
        refetchCount.current = 0;
        return false;
      }

      return 5 * 1000; // 5 seconds
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
      queryClient.invalidateQueries({ queryKey: ["pre-audit-info"] });
    },
  });
};

export const useDeleteAudits = () => {
  return useMutation({
    mutationFn: AuditService.deleteAudits,
    onError: (error) => toast.error(`Error: ${error.message}`),
    onSuccess: (data) => {
      toast.success(data.message || "All audits deleted successfully");
      invalidateAuditQueries();
    },
  });
};

export const useDeleteAudit = () => {
  return useMutation({
    mutationFn: AuditService.deleteAudit,
    onError: (error) => toast.error(`Error: ${error.message}`),
    onSuccess: (data) => {
      toast.success(data.message || "Audit deleted successfully");
      invalidateAuditQueries();
    },
  });
};

export const usePreAuditInfo = (_payload: { url: string }) => {
  const { data: url, success: isUrlValid } = urlSchema.safeParse(_payload.url);
  const payload = { ..._payload, url: url || "" };

  return useQuery({
    queryKey: ["pre-audit-info", payload],
    queryFn: () => AuditService.getPreAuditInfo(payload),
    enabled: isUrlValid,
  });
};

export const useStaticPreAuditInfo = () => {
  return usePreAuditInfo({ url: window.location.origin });
};

export function invalidateAuditQueries() {
  ["audits", "audit"].map((key) =>
    queryClient.invalidateQueries({ queryKey: [key] }),
  );
}
