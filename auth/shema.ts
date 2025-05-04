import { SellerInfoSchema } from "@/seller/schema";
import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const UserRegisterSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    name: z.string().min(1, { message: "Name is required" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const UserRole = z.enum(["USER", "SELLER", "ADMIN"]);

export const TelegramDataSchema = z.object({
  telegramId: z.number(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  username: z.string().nullable(),
  photoUrl: z.string().nullable(),
  authDate: z.coerce.date(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  image: z.string().nullable(),
  role: UserRole,
  lastLogin: z.coerce.date().nullable(),
  isVerified: z.boolean(),
  sellerInfo: SellerInfoSchema.nullable(),
  telegram: TelegramDataSchema.optional().nullable(),
});

export const TelegramLoginSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string().nullable(),
  username: z.string().nullable(),
  photo_url: z.string().nullable(),
  auth_date: z.number(),
  hash: z.string(),
});

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserRoleType = z.infer<typeof UserRole>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type TelegramLogin = z.infer<typeof TelegramLoginSchema>;
export type TelegramData = z.infer<typeof TelegramDataSchema>;
