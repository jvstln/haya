import { api } from "@/lib/api";
import type { NewSection } from "./canva.type";

export async function createSection(payload: NewSection) {
  const formData = new FormData();
  formData.append("image", payload.image);
  formData.append("auditId", payload.auditId);

  const response = await api.post("/comments/custom/analyze", formData);
  return response.data;
}
