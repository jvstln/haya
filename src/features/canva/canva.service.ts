import { api } from "@/lib/api";
import type { NewSection } from "./canva.type";

export async function createSection(payload: NewSection) {
  const formData = new FormData();
  formData.append("image", payload.image);
  // TODO: Rename analysisId to auditId when the backend updates this field
  formData.append("analysisId", payload.auditId);

  const response = await api.post("/comments/custom/analyze", formData);
  return response.data;
}
