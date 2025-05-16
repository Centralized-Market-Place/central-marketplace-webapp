"use client";

import type { User } from "@/auth/shema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpdateUserInfo } from "../schemas";
import {
  LocationInfoClientSchema,
  LocationInfoFormValues,
} from "../client-schemas";
import { formDataToUpdateUserInfo, countries } from "../utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface LocationInfoFormProps {
  user: User;
  isEditing: boolean;
  onSave: (updatedData: UpdateUserInfo) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LocationInfoForm({
  user,
  isEditing,
  onSave,
  onCancel,
  isLoading,
}: LocationInfoFormProps) {
  const form = useForm<LocationInfoFormValues>({
    resolver: zodResolver(LocationInfoClientSchema),
    defaultValues: {
      country: user.locationInfo?.country || "",
      city: user.locationInfo?.city || null,
      address: user.locationInfo?.address || null,
      postalCode: user.locationInfo?.postalCode || null,
      timezone: user.locationInfo?.timezone || null,
    },
  });

  const handleSubmit = (data: LocationInfoFormValues) => {
    const updateData = formDataToUpdateUserInfo(data, "locationInfo");
    onSave(updateData);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Location Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Country</h3>
            <p className="mt-1">
              {user.locationInfo?.country
                ? countries.find((c) => c.value === user.locationInfo?.country)
                    ?.label || user.locationInfo?.country
                : "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">City</h3>
            <p className="mt-1">{user.locationInfo?.city || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="mt-1">
              {user.locationInfo?.address || "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Postal Code</h3>
            <p className="mt-1">
              {user.locationInfo?.postalCode || "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Timezone</h3>
            <p className="mt-1">
              {user.locationInfo?.timezone || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold">Edit Location Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timezone</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">
                        Pacific Time (UTC-8)
                      </SelectItem>
                      <SelectItem value="UTC-7">
                        Mountain Time (UTC-7)
                      </SelectItem>
                      <SelectItem value="UTC-6">
                        Central Time (UTC-6)
                      </SelectItem>
                      <SelectItem value="UTC-5">
                        Eastern Time (UTC-5)
                      </SelectItem>
                      <SelectItem value="UTC+0">
                        Greenwich Mean Time (UTC+0)
                      </SelectItem>
                      <SelectItem value="UTC+1">
                        Central European Time (UTC+1)
                      </SelectItem>
                      <SelectItem value="UTC+8">
                        China Standard Time (UTC+8)
                      </SelectItem>
                      <SelectItem value="UTC+9">
                        Japan Standard Time (UTC+9)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
