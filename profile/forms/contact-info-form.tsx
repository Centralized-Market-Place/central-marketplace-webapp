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
  ContactInfoClientSchema,
  ContactInfoFormValues,
} from "../client-schemas";
import { formDataToUpdateUserInfo } from "../utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ContactInfoFormProps {
  user: User;
  isEditing: boolean;
  onSave: (updatedData: UpdateUserInfo) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ContactInfoForm({
  user,
  isEditing,
  onSave,
  onCancel,
  isLoading,
}: ContactInfoFormProps) {
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(ContactInfoClientSchema),
    defaultValues: {
      phoneNumber: user.contactInfo?.phoneNumber || null,
      alternativeEmail: user.contactInfo?.alternativeEmail || null,
      preferredContactMethod: user.contactInfo?.preferredContactMethod || null,
    },
  });

  const handleSubmit = (data: ContactInfoFormValues) => {
    const updateData = formDataToUpdateUserInfo(data, "contactInfo");
    onSave(updateData);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1">{user.email || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Alternative Email
            </h3>
            <p className="mt-1">
              {user.contactInfo?.alternativeEmail || "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
            <p className="mt-1">
              {user.contactInfo?.phoneNumber || "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Preferred Contact Method
            </h3>
            <p className="mt-1">
              {user.contactInfo?.preferredContactMethod || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold">Edit Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormLabel>Email (Primary)</FormLabel>
            <Input
              value={user.email || "Not specified"}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              Primary email cannot be changed here
            </p>
          </div>
          <FormField
            control={form.control}
            name="alternativeEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternative Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
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
            name="preferredContactMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Contact Method</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
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
