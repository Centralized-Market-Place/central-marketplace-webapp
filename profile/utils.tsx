import { createQueryKeyStructure } from "@/lib/query_keys";
import { UpdateUserInfo } from "./schemas";
import {
  PersonalInfoFormValues,
  ContactInfoFormValues,
  LocationInfoFormValues,
  CommunicationPreferencesFormValues,
} from "./client-schemas";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

countries.registerLocale(enLocale);

export const userQueryKeys = createQueryKeyStructure("user");

export type CountryOption = {
  value: string;
  label: string;
};

// Generate comprehensive list of countries from ISO data
export const countriesList: CountryOption[] = Object.entries(
  countries.getNames("en")
)
  .map(([code, name]) => ({
    value: code.toLowerCase(),
    label: name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const nationalities: CountryOption[] = countriesList;

export function SearchableCombobox({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  options: CountryOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={false}
      >
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList className="h-[10rem] overflow-auto">
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

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
        profilePictureUrl: data.profilePictureUrl,
        personalInfo: {
          dateOfBirth: data.dateOfBirth ?? undefined,
          gender: data.gender ?? undefined,
          nationality: data.nationality ?? undefined,
          bio: data.bio ?? undefined,
        },
      };
    }
    case "contactInfo": {
      const data = formData as ContactInfoFormValues;
      return {
        contactInfo: {
          phoneNumber: data.phoneNumber ?? undefined,
          alternativeEmail: data.alternativeEmail ?? undefined,
          preferredContactMethod: data.preferredContactMethod ?? undefined,
        },
      };
    }
    case "locationInfo": {
      const data = formData as LocationInfoFormValues;
      return {
        locationInfo: {
          country: data.country,
          city: data.city ?? undefined,
          address: data.address ?? undefined,
          postalCode: data.postalCode ?? undefined,
          timezone: data.timezone ?? undefined,
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
    default:
      return {};
  }
}
