import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryclient";
import * as AuditService from "./audit.service";

export const useAudits = () => {
  return useQuery({
    queryKey: ["analyses"],
    queryFn: AuditService.getAudits,
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
      const status = query.state.data?.status;
      if (status && !["pending", "in_progress"].includes(status)) {
        refetchCount.current = 0;
        return false;
      }

      return 1000 * 2 ** ++refetchCount.current;
    },
  });

  return { ...query, refetchCount: refetchCount.current };
};

export const useCreateAudit = () => {
  return useMutation({
    mutationFn: AuditService.createAudit,
    onError: (error) => toast.error(`Error: ${error.message}`),
    onSuccess: () => toast.success("Case started successfully"),
  });
};

export const useDeleteAudits = () => {
  return useMutation({
    mutationFn: AuditService.deleteAudits,
    onError: (error) => toast.error(`Error: ${error.message}`),
    onSuccess: () => {
      toast.success("All analyses deleted successfully");
      invalidateQueries();
    },
  });
};

function invalidateQueries() {
  ["analysis", "analyses"].map((key) =>
    queryClient.invalidateQueries({ queryKey: [key] })
  );
}
