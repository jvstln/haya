import { urlSchema } from "@/schemas";
import { z } from "zod";

export const newAuditSchema = z.object({
  url: urlSchema,
  pageCount: z.int().min(1).default(1).optional(),
});
