import { z } from "zod";

// ─── Signup ───────────────────────────────────────────────
// Step 1: hanya email
export const signupEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// Step 2: username + password
export const signupCredentialsSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Must contain at least one number or special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error ditaruh di field confirmPassword
  });

// Step 3: terms & conditions
export const signupTermsSchema = z.object({
  termsAccepted: z.literal(true, {
    message: "You must accept the terms and privacy policy",
  }),
});

// ─── Login ────────────────────────────────────────────────
export const loginEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export const loginOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Please enter the 6-digit code")
    .regex(/^\d+$/, "Code must contain numbers only"),
});

export const loginCredentialsSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

// ─── Inferred Types ───────────────────────────────────────
export type SignupEmailInput = z.infer<typeof signupEmailSchema>;
export type SignupCredentialsInput = z.infer<typeof signupCredentialsSchema>;
export type SignupTermsInput = z.infer<typeof signupTermsSchema>;
export type LoginEmailInput = z.infer<typeof loginEmailSchema>;
export type LoginOtpInput = z.infer<typeof loginOtpSchema>;
export type LoginCredentialsInput = z.infer<typeof loginCredentialsSchema>;
