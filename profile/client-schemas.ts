import { z } from "zod";

export const PersonalInfoClientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  profilePictureUrl: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
});

export const ContactInfoClientSchema = z.object({
  phoneNumber: z.string().nullable().optional(),
  alternativeEmail: z
    .string()
    .email("Invalid email format")
    .nullable()
    .optional(),
  preferredContactMethod: z.string().nullable().optional(),
});

export const LocationInfoClientSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
});

export const CommunicationPreferencesClientSchema = z.object({
  language: z.string().min(1, "Language is required"),
  emailNotifications: z.boolean().default(false),
  smsNotifications: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
  notificationFrequency: z.string().default("daily"),
});

export type PersonalInfoFormValues = z.infer<typeof PersonalInfoClientSchema>;
export type ContactInfoFormValues = z.infer<typeof ContactInfoClientSchema>;
export type LocationInfoFormValues = z.infer<typeof LocationInfoClientSchema>;
export type CommunicationPreferencesFormValues = z.infer<
  typeof CommunicationPreferencesClientSchema
>;