import { SellerInfoSchema } from "@/seller/schema";
import { PersonalInfoSchema, ContactInfoSchema, LocationInfoSchema, CommunicationPreferencesSchema, PrivacySettingsSchema, VerificationStatusSchema } from "@/profile/schemas";
import { User } from "lucide-react";
import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const UserRegisterSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const UserRole = z.enum(["USER", "SELLER", "ADMIN", "SUPER_ADMIN"]);

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
  firstName: z.string(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  profilePictureUrl: z.string().nullable().optional(),
  personalInfo: PersonalInfoSchema.nullable().optional(),
  contactInfo: ContactInfoSchema.nullable().optional(),
  locationInfo: LocationInfoSchema.nullable().optional(),
  communicationPreferences: CommunicationPreferencesSchema.nullable().optional(),
  privacySettings: PrivacySettingsSchema.nullable().optional(),
  verificationStatus: VerificationStatusSchema.nullable().optional(),
  role: UserRole,
  isVerified: z.boolean(),
  sellerInfos: z.array(SellerInfoSchema),
  telegram: TelegramDataSchema.nullable(),
  lastLogin: z.coerce.date().nullable(),
  lastActive: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});


export const TelegramLoginSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  username: z.string().nullable(),
  photoUrl: z.string().nullable(),
  authDate: z.number(),
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