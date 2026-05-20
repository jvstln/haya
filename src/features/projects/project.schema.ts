import z from "zod";
import { urlSchema } from "@/schemas";

export const newProjectSchema = z.object({
  name: z.string().min(1),
  domain: urlSchema,
});

export const projectSettingsSchema = z.object({
  ...newProjectSchema.shape,
  isActive: z.boolean().optional(),
  settings: z.object({
    sessionReplay: z.boolean().optional(),
    heatmaps: z.boolean().optional(),
    trackClicks: z.boolean().optional(),
    trackScrolls: z.boolean().optional(),
    trackMousemove: z.boolean().optional(),
    maskInputs: z.boolean().optional(),
  }),
});
