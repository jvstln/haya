import z from "zod";

export const urlSchema = z
  .string()
  .transform((val) => val.trim().replace(/^(?!(.+?):\/\/)/, "https://"))
  .pipe(z.url());
