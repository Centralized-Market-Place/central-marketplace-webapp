import { z } from "zod";

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