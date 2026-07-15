import { api } from "@/lib/api";
import type { Pagination } from "@/types";
import type {
  Audit,
  AuditFilters,
  AuditWithoutContent,
  NewAudit,
  PreAuditInfo,
} from "./audit.type";

async function getAudits(params?: AuditFilters) {
  let data: {
    data: AuditWithoutContent[];
    pagination: Pagination;
  };

  if (params?.teamId) {
    const response = await api.get<{
      data: { analyses: AuditWithoutContent[] };
    }>(`/teams/${params.teamId}/analyses`, {
      params,
    });
    data = {
      data: response.data.data.analyses,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
        itemsPerPage: response.data.data.analyses.length,
        totalItems: response.data.data.analyses.length,
      },
    };
  } else {
    const response = await api.get<{
      data: AuditWithoutContent[];
      pagination: Pagination;
    }>("/analyze/analysis", {
      params,
    });

    data = response.data;
  }

  return data;
}

async function getAudit(auditId: string) {
  // Check if it is a not valid object id => it is probably a token for viewing public audits
  if (auditId.length > 24) {
    const response = await api.get<{ data: Audit }>(
      `/share/analysis/${auditId}`,
    );
    return response.data.data;
  }

  const response = await api.get<Audit>(`/analyze/analysis/${auditId}`);
  return response.data;
}

async function createAudit(payload: NewAudit) {
  const response = await api.post("/analyze/analysis", payload);
  return response.data;
}

async function deleteAudits() {
  const response = await api.delete("/analyze/analysis");
  return response.data;
}

async function deleteAudit(auditId: string) {
  const response = await api.delete(`/analyze/analysis/${auditId}`);
  return response.data;
}

async function exportPdf(auditId: string) {
  const response = await api.get<Blob>(
    `/analyze/analysis/${auditId}/download-pdf`,
    {
      responseType: "blob",
    },
  );
  return response.data;
}

async function getPreAuditInfo(payload: { url: string }) {
  const response = await api.post("/analyze/discover", payload);
  return response.data as PreAuditInfo;
}

async function updateShareAudit(params: { auditId: string; enabled: boolean }) {
  if (params.enabled) {
    const response = await api.post<{
      data: { shareToken: string; isShared: boolean };
    }>(`/analyze/analysis/${params.auditId}/share`);
    return response.data.data;
  }

  const response = await api.delete<{
    data: { shareToken: undefined; isShared: boolean };
  }>(`/analyze/analysis/${params.auditId}/share`);
  return response.data.data;
}

/** Returns true if audit is in progress or pending or NOT YET DEFINED */
function getIsAuditInProgress(audit?: Audit) {
  if (!audit) return true;
  return audit.status === "in_progress" || audit.status === "pending";
}

export {
  getAudits,
  getAudit,
  createAudit,
  deleteAudits,
  deleteAudit,
  exportPdf,
  getPreAuditInfo,
  updateShareAudit,
  getIsAuditInProgress,
};
