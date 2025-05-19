"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordResetRequest, PasswordResetRequestSchema } from "@/auth/shema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/state/loading";

export default function ForgotPasswordForm({
  onSave,
  isLoading = false,
  message = "",
}: {
  onSave: (data: PasswordResetRequest) => void;
  isLoading?: boolean;
  message?: string;
}) {
  const form = useForm<PasswordResetRequest>({
    resolver: zodResolver(PasswordResetRequestSchema),
    defaultValues: { email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <LoadingIcon className="w-4 h-4" />}Send Reset Link
        </Button>
        {message && <p className="text-sm text-center text-green-600">{message}</p>}
      </form>
    </Form>
  );
} 