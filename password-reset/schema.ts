import { z } from "zod";

export const PasswordResetRequestSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const PasswordResetConfirmSchema = z
  .object({
    token: z.string(),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const PasswordResetResponseSchema = z.object({
  message: z.string(),
});

export type PasswordResetRequest = z.infer<typeof PasswordResetRequestSchema>;
export type PasswordResetConfirm = z.infer<typeof PasswordResetConfirmSchema>;
export type PasswordResetResponse = z.infer<typeof PasswordResetResponseSchema>;
