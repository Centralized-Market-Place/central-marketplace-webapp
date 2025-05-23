"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PasswordResetConfirm, PasswordResetConfirmSchema } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import LoadingIcon from "@/components/state/loading";
import { PasswordInput } from "@/components/common/password-input";
import { usePasswordReset } from "../hooks/usePasswordReset";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm({ token = "" }: { token: string }) {
  const { confirmReset, isConfirmLoading } = usePasswordReset();
  const router = useRouter();

  const form = useForm<PasswordResetConfirm>({
    resolver: zodResolver(PasswordResetConfirmSchema),
    defaultValues: {
      token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: PasswordResetConfirm) => {
    confirmReset(data, {
      onSuccess: () => {
        setTimeout(() => router.push("/login"), 2000);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isConfirmLoading}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isConfirmLoading}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isConfirmLoading} className="w-full">
          {isConfirmLoading && <LoadingIcon className="w-4 h-4 mr-2" />}Reset
          Password
        </Button>
      </form>
    </Form>
  );
}
