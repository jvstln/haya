import z from "zod";

// Password validation rules for UI display
export const passwordRequirements = [
  { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
  { id: "uppercase", label: "Contains uppercase letter", regex: /[A-Z]/ },
  { id: "number", label: "Contains number", regex: /[0-9]/ },
  { id: "symbol", label: "Contains symbol", regex: /[!@#$%^&*(),.?":{}|<>]/ },
];

export const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, { error: "Password must contain an uppercase letter" })
  .regex(/[0-9]/, { error: "Password must contain a number" })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    error: "Password must contain a symbol",
  });

export const signUpEmailSchema = z
  .object({
    name: z
      .preprocess(
        (val) =>
          typeof val === "string" && val.trim() === "" ? undefined : val,
        z.string().min(2, "Name must be at least 2 characters")
      )
      .optional(),
    email: z.email(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassWord"],
  });

export const verifyOtpSchema = z.object({
  code: z.string().length(6, { message: "OTP must be 6 characters" }),
});

export const resendVerificationSchema = z.object({
  email: z.email(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z
  .object({
    code: z.string().length(6, { message: "OTP must be 6 characters" }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
