import { z } from "zod";

export const PersonalInfoSchema = z.object({
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  profilePicture: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
});

export const ContactInfoSchema = z.object({
  phoneNumber: z.string().nullable().optional(),
  alternativeEmail: z.string().nullable().optional(),
  preferredContactMethod: z.string().nullable().optional(),
});

export const LocationInfoSchema = z.object({
  country: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
});

export const CommunicationPreferencesSchema = z.object({
  language: z.string().nullable().optional(),
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

export const updateUserInfoSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  personalInfo: PersonalInfoSchema.nullable().optional(),
  contactInfo: ContactInfoSchema.nullable().optional(),
  locationInfo: LocationInfoSchema.nullable().optional(),
  communicationPreferences: CommunicationPreferencesSchema.nullable().optional(),
  privacySettings: PrivacySettingsSchema.nullable().optional(),
});


export type UpdateUserInfo = z.infer<typeof updateUserInfoSchema>;
export type CommunicationPreferences = z.infer<typeof CommunicationPreferencesSchema>;