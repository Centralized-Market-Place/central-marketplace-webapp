import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const UserRegisterSchema = z
  .object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
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

export const UserRole = z.enum(["USER", "SELLER", "ADMIN"]);

export const TelegramDataSchema = z.object({
  telegramId: z.number(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  username: z.string().nullable(),
  photoUrl: z.string().nullable(),
  authDate: z.coerce.date(),
});
export const PersonalInfoSchema = z.object({
  dateOfBirth: z.string().nullable(),
  gender: z.string().nullable(),
  nationality: z.string().nullable(),
  profilePicture: z.string().nullable(),
  bio: z.string().nullable(),
});

export const ContactInfoSchema = z.object({
  phoneNumber: z.string().nullable(),
  alternativeEmail: z.string().nullable(),
  preferredContactMethod: z.string().nullable(),
});

export const LocationInfoSchema = z.object({
  country: z.string().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
  postalCode: z.string().nullable(),
  timezone: z.string().nullable(),
});

export const CommunicationPreferencesSchema = z.object({
  language: z.string(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  notificationFrequency: z.string(),
});

export const PrivacySettingsSchema = z.object({
  profileVisibility: z.string(),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showLocation: z.boolean(),
  showActivity: z.boolean(),
});

export const VerificationStatusSchema = z.object({
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  identityVerified: z.boolean(),
  verificationMethod: z.string().nullable(),
  verificationDate: z.string().nullable(),
});

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  personalInfo: PersonalInfoSchema,
  contactInfo: ContactInfoSchema,
  locationInfo: LocationInfoSchema,
  communicationPreferences: CommunicationPreferencesSchema,
  privacySettings: PrivacySettingsSchema,
  verificationStatus: VerificationStatusSchema,
  passwordHash: z.string(),
  role: z.string(),
  isVerified: z.boolean(),
  sellerInfo: z.array(z.any()), // You can define a stricter schema if needed
  telegram: z.any().nullable(),
  lastLogin: z.string().nullable(),
  lastActive: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
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

export const UserSignUpSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.string(), // or z.enum(["USER", "SELLER", "ADMIN"]) if you want to restrict
  isVerified: z.boolean(),
  profilePicture: z.string().nullable(),
  lastLogin: z.string().nullable(),
  telegram: z.any().nullable(),
  sellerInfo: z.array(z.any()), // You can define a stricter schema if needed
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserRoleType = z.infer<typeof UserRole>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type TelegramLogin = z.infer<typeof TelegramLoginSchema>;
export type TelegramData = z.infer<typeof TelegramDataSchema>;
export type UserSignUp = z.infer<typeof UserSignUpSchema>;