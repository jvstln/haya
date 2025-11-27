import type z from "zod";
import type { signupEmailSchema } from "./auth.schema";

export type SignupEmail = z.infer<typeof signupEmailSchema>;
