"use client";

import { User } from "@/auth/shema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Upload } from "lucide-react";
import { UpdateUserInfo } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  PersonalInfoClientSchema,
  PersonalInfoFormValues,
} from "../client-schemas";
import { formDataToUpdateUserInfo, nationalities } from "../utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Custom styles for the DatePicker to support dark mode
import "./date-picker.css";

interface PersonalInfoFormProps {
  user: User;
  isEditing: boolean;
  onSave: (updatedData: UpdateUserInfo) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PersonalInfoForm({
  user,
  isEditing,
  onSave,
  onCancel,
  isLoading,
}: PersonalInfoFormProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(PersonalInfoClientSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.personalInfo?.dateOfBirth || null,
      gender: user.personalInfo?.gender || null,
      nationality: user.personalInfo?.nationality || null,
      profilePicture: user.personalInfo?.profilePicture || null,
      bio: user.personalInfo?.bio || null,
    },
  });

  const handleSubmit = (data: PersonalInfoFormValues) => {
    // Convert form data to the expected format
    const updateData = formDataToUpdateUserInfo(data, "personalInfo");
    onSave(updateData);
  };

  const formatDobDisplay = (dobString: string | null | undefined) => {
    if (!dobString) return "Not specified";
    try {
      return format(new Date(dobString), "PPP");
    } catch {
      return dobString;
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={user.personalInfo?.profilePicture || undefined}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback className="text-xl">{`${user.firstName.charAt(
              0
            )}${user.lastName.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              First Name
            </h3>
            <p className="mt-1 text-foreground">{user.firstName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Last Name
            </h3>
            <p className="mt-1 text-foreground">{user.lastName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Date of Birth
            </h3>
            <p className="mt-1 text-foreground">
              {formatDobDisplay(user.personalInfo?.dateOfBirth)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Gender
            </h3>
            <p className="mt-1 text-foreground">
              {user.personalInfo?.gender || "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Nationality
            </h3>
            <p className="mt-1 text-foreground">
              {user.personalInfo?.nationality
                ? nationalities.find(
                    (n) => n.value === user.personalInfo?.nationality
                  )?.label || user.personalInfo?.nationality
                : "Not specified"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
          <p className="mt-1 whitespace-pre-line text-foreground">
            {user.personalInfo?.bio || "No bio provided"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={form.getValues("profilePicture") || undefined}
                alt={`${form.getValues("firstName")} ${form.getValues(
                  "lastName"
                )}`}
              />
              <AvatarFallback className="text-xl">
                {`${form.getValues("firstName").charAt(0)}${form
                  .getValues("lastName")
                  .charAt(0)}`}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
            >
              <Upload className="h-4 w-4" />
              <span className="sr-only">Upload profile picture</span>
            </Button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Edit Personal Information
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={() => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Controller
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) =>
                            field.onChange(date ? date.toISOString() : null)
                          }
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                          dropdownMode="select"
                          showMonthDropdown
                          dateFormat="MMMM d, yyyy"
                          placeholderText="Select date of birth"
                          className={cn(
                            "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            mounted && theme === "dark"
                              ? "date-picker-dark"
                              : ""
                          )}
                          disabled={isLoading}
                          calendarClassName={
                            mounted && theme === "dark"
                              ? "date-picker-dark-calendar"
                              : ""
                          }
                          dayClassName={() =>
                            cn(
                              mounted && theme === "dark"
                                ? "date-picker-dark-day"
                                : ""
                            )
                          }
                        />
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((nationality) => (
                        <SelectItem
                          key={nationality.value}
                          value={nationality.value}
                        >
                          {nationality.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  {...field}
                  value={field.value || ""}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
