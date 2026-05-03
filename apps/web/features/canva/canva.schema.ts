import { z } from "zod";

export const newSectionSchema = z.object({
  image: z
    .file()
    .max(1024 * 1024 * 5, "Image must be less than 5MB")
    .mime(["image/jpeg", "image/png", "image/webp"]),
  auditId: z.string().min(1),
});
