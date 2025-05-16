import { createQueryKeyStructure } from "@/lib/query_keys";
import { UpdateUserInfo } from "./schemas";
import {
  PersonalInfoFormValues,
  ContactInfoFormValues,
  LocationInfoFormValues,
  CommunicationPreferencesFormValues,
  PrivacySettingsFormValues,
} from "./client-schemas";

export const userQueryKeys = createQueryKeyStructure("user");

export type CountryOption = {
  value: string;
  label: string;
};

export const countries: CountryOption[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "mx", label: "Mexico" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "ru", label: "Russia" },
  { value: "za", label: "South Africa" },
  { value: "ng", label: "Nigeria" },
  { value: "sg", label: "Singapore" },
  { value: "ae", label: "United Arab Emirates" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "kr", label: "South Korea" },
];

export const nationalities: CountryOption[] = [
  { value: "american", label: "American" },
  { value: "canadian", label: "Canadian" },
  { value: "british", label: "British" },
  { value: "australian", label: "Australian" },
  { value: "german", label: "German" },
  { value: "french", label: "French" },
  { value: "japanese", label: "Japanese" },
  { value: "chinese", label: "Chinese" },
  { value: "indian", label: "Indian" },
  { value: "brazilian", label: "Brazilian" },
  { value: "mexican", label: "Mexican" },
  { value: "italian", label: "Italian" },
  { value: "spanish", label: "Spanish" },
  { value: "russian", label: "Russian" },
  { value: "south_african", label: "South African" },
  { value: "nigerian", label: "Nigerian" },
  { value: "singaporean", label: "Singaporean" },
  { value: "emirati", label: "Emirati" },
  { value: "saudi", label: "Saudi" },
  { value: "korean", label: "Korean" },
];

export function formDataToUpdateUserInfo(
  formData: unknown,
  formType: string
): UpdateUserInfo {
  switch (formType) {
    case "personalInfo": {
      const data = formData as PersonalInfoFormValues;
      return {
        firstName: data.firstName,
        lastName: data.lastName,
        personalInfo: {
          dateOfBirth: data.dateOfBirth ?? null,
          gender: data.gender ?? null,
          nationality: data.nationality ?? null,
          profilePicture: data.profilePicture ?? null,
          bio: data.bio ?? null,
        },
      };
    }
    case "contactInfo": {
      const data = formData as ContactInfoFormValues;
      return {
        contactInfo: {
          phoneNumber: data.phoneNumber ?? null,
          alternativeEmail: data.alternativeEmail ?? null,
          preferredContactMethod: data.preferredContactMethod ?? null,
        },
      };
    }
    case "locationInfo": {
      const data = formData as LocationInfoFormValues;
      return {
        locationInfo: {
          country: data.country,
          city: data.city ?? null,
          address: data.address ?? null,
          postalCode: data.postalCode ?? null,
          timezone: data.timezone ?? null,
        },
      };
    }
    case "communicationPreferences": {
      const data = formData as CommunicationPreferencesFormValues;
      return {
        communicationPreferences: {
          language: data.language,
          emailNotifications: data.emailNotifications,
          smsNotifications: data.smsNotifications,
          marketingEmails: data.marketingEmails,
          notificationFrequency: data.notificationFrequency,
        },
      };
    }
    case "privacySettings": {
      const data = formData as PrivacySettingsFormValues;
      return {
        privacySettings: {
          profileVisibility: data.profileVisibility,
          showEmail: data.showEmail,
          showPhone: data.showPhone,
          showLocation: data.showLocation,
          showActivity: data.showActivity,
        },
      };
    }
    default:
      return {};
  }
}
