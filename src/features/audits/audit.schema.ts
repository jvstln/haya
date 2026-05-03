import { z } from "zod";

export const newAuditSchema = z.object({
  url: z
    .string()
    .transform((val) => val.trim().replace(/^(?!(.+?):\/\/)/, "https://"))
    .pipe(z.url()),
  pageCount: z.int().min(1).default(1).optional(),
});
