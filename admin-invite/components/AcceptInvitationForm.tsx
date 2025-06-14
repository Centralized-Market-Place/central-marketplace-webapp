"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminInvitationAccept, adminInvitationAcceptSchema } from "../schema";
import { useAdminInviteActions } from "../hooks/useAdminInviteAction";
import { useRouter } from "next/navigation";

interface AcceptInvitationFormProps {
  token: string;
  email?: string;
}

export function AcceptInvitationForm({
  token,
  email,
}: AcceptInvitationFormProps) {
  const router = useRouter();
  const { acceptInvitation, isAccepting } = useAdminInviteActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminInvitationAccept>({
    resolver: zodResolver(adminInvitationAcceptSchema),
    defaultValues: {
      token,
    },
  });

  const onSubmit = (data: AdminInvitationAccept) => {
    acceptInvitation({
      acceptData: data,
      onSuccess: () => {
        router.push(
          "/login?message=Account created successfully. Please login."
        );
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Admin Invitation</CardTitle>
          <CardDescription>
            {email
              ? `Complete your account setup for ${email}`
              : "Complete your account setup"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("token")} />

            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name (Optional)</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isAccepting}>
              {isAccepting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
