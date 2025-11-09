import { z } from "zod";

export const analysisModeSchema = z.enum(["web", "webVsUi", "webVsWeb"]);

export const newAnalysisSchema = z.object({
  attachments: z.array(z.file()).optional(),
  mode: analysisModeSchema,
  urls: z
    .array(z.string())
    .transform((val) => val.filter(Boolean))
    .pipe(z.array(z.url()).min(1, "At least one URL is required")),
});
