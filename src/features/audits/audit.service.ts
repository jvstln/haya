import { api } from "@/lib/api";
import { shuffleArray } from "@/lib/utils";
import type { Audit, AuditPage, AuditSection, NewAudit } from "./audit.type";

async function getAudits() {
  const response = await api.get<Omit<Audit, "content">[]>("/analyze/analysis");
  return response.data;
}

async function getAudit(auditId: string) {
  const response = await api.get<Audit>(`/analyze/analysis/${auditId}`);
  return response.data;
}

async function createAudit(payload: NewAudit) {
  const response = await api.post<Audit>("/analyze/analysis", payload);
  return response.data;
}

async function deleteAudits() {
  const response = await api.delete("/analyze/analysis");
  return response.data;
}

function parseContent(content: string) {
  try {
    let jsonContent = JSON.parse(content);
    if (!jsonContent || typeof jsonContent !== "object") return null;

    const colors: AuditSection["meta"]["accent"][] = shuffleArray([
      "--color-red-300",
      "--color-yellow-300",
      "--color-green-300",
      "--color-blue-300",
      "--color-purple-300",
      "--color-pink-300",
      "--color-emerald-300",
    ]);

    // Add section metadata to content
    jsonContent = {
      ...jsonContent,
      pages: jsonContent.pages.map((page: AuditPage) => ({
        ...page,
        sections: page.sections.map((section: AuditSection, index: number) => ({
          ...section,
          meta: {
            sectionNumber: index + 1,
            accent: colors[index],
          },
        })),
      })),
    };

    return jsonContent as { pages: AuditPage[] };
  } catch (error) {
    console.log("Error parsing analysis content", error, content);
    return null;
  }
}

export { getAudits, getAudit, createAudit, deleteAudits, parseContent };
