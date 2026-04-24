import { api } from "@/lib/api";
import type { NewSection } from "./canva.type";

export async function createSection(payload: NewSection) {
  const formData = new FormData();
  formData.append("image", payload.image);
  formData.append("auditId", payload.auditId);

  const response = await api.post<{
    data: { imageUrl: string; imagePublicId: string };
  }>("/comments/custom/analyze", formData);
  return response.data.data;
}

export async function analyzeSectionImage(payload: {
  auditId: string;
  imageUrl: string;
}) {
  const response = await api.post("/comments/custom/analyze", payload);
  return response.data;
}
