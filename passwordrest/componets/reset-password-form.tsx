"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordResetConfirm, PasswordResetConfirmSchema } from "../../auth/shema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/state/loading";
import { PasswordInput } from "@/components/common/password-input";

export default function ResetPasswordForm({
  onSave,
  isLoading = false,
  message = "",
  token = "",
}: {
  onSave: (data: PasswordResetConfirm) => void;
  isLoading?: boolean;
  message?: string;
  token: string;
}) {
  const form = useForm<PasswordResetConfirm>({
    resolver: zodResolver(PasswordResetConfirmSchema),
    defaultValues: { token, new_password: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} disabled={isLoading} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <LoadingIcon className="w-4 h-4" />}Reset Password
        </Button>
        {message && <p className="text-sm text-center text-green-600">{message}</p>}
      </form>
    </Form>
  );
} 