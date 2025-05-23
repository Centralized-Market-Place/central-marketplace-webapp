"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordResetRequest, PasswordResetRequestSchema } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/state/loading";
import { usePasswordReset } from "../hooks/usePasswordReset";

export default function ForgotPasswordForm() {
  const { requestReset, isRequestLoading } = usePasswordReset();

  const form = useForm<PasswordResetRequest>({
    resolver: zodResolver(PasswordResetRequestSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: PasswordResetRequest) => {
    requestReset(data, {
      onSuccess: () => {
        form.reset(); // Reset form after successful submission
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled={isRequestLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isRequestLoading} className="w-full">
          {isRequestLoading && <LoadingIcon className="w-4 h-4 mr-2" />}Send
          Reset Link
        </Button>
      </form>
    </Form>
  );
}
