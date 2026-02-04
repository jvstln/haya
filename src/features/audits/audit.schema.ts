import { z } from "zod";

export const analysisModeSchema = z.enum(["web", "webVsUi", "webVsWeb"]);

export const newAuditSchema = z.object({
  url: z
    .string()
    .transform((val) => val.trim().replace(/^(?!(.+?):\/\/)/, "https://"))
    .pipe(z.url()),
});
