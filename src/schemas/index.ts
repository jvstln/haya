import z from "zod";

// -------- Zod Error Customization -----------------
z.config({
  // customError: createErrorMap(),
});

// -------- Utility schemas -----------------
export const urlSchema = z
  .string()
  .transform((val) => val.trim().replace(/^(?!(.+?):\/\/)/, "https://"))
  .pipe(z.url());
