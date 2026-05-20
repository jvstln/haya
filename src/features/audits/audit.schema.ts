import { z } from "zod";
import { urlSchema } from "@/schemas";

export const auditTypes = [
  { label: "Landing Page", value: "landing_page" },
  { label: "Product/WebApp", value: "saas_product" },
] as const;

export const newAuditSchema = z.object({
  url: urlSchema,
  audit_type: z.enum(auditTypes.map((type) => type.value)),
});
