import type { UserSchema } from "@/auth/shema"
import type { infer as Infer } from "zod"


export const mockUser: Infer<typeof UserSchema>= {
  id: "user-123",
  firstName: "Nicole",
  lastName: "Smith",
  email: "nicole@example.com",
  personalInfo: {
    dateOfBirth: "1990-05-15",
    gender: "female",
    nationality: "United States",
    profilePicture: null,
    bio: "Product designer with 5+ years of experience in UI/UX design.",
  },
  contactInfo: {
    phoneNumber: "+1 (555) 123-4567",
    alternativeEmail: "nicole.design@example.com",
    preferredContactMethod: "email",
  },
  locationInfo: {
    country: "United States",
    city: "San Francisco",
    address: "123 Main Street, Apt 4B",
    postalCode: "94105",
    timezone: "UTC-8",
  },
  communicationPreferences: {
    language: "en",
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    notificationFrequency: "daily",
  },
  privacySettings: {
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showActivity: true,
  },
  verificationStatus: {
    emailVerified: true,
    phoneVerified: false,
    identityVerified: false,
    verificationMethod: null,
    verificationDate: null,
  },
  passwordHash: "hashed_password_here",
  role: "user",
  isVerified: true,
  sellerInfo: [],
  telegram: null,
  lastLogin: "2023-05-10T15:30:00Z",
  lastActive: "2023-05-10T16:45:00Z",
  createdAt: "2022-01-15T10:00:00Z",
  updatedAt: "2023-05-10T16:45:00Z",
}
