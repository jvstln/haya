import { z } from "zod";

export const analysisModeSchema = z.enum(["web", "webVsUi", "webVsWeb"]);

export const newAuditSchema = z.object({
  url: z.url(),
});
