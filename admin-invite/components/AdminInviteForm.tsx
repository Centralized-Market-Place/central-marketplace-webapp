"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminInvite, adminInviteSchema } from "../schema";
import { useAdminInviteActions } from "../hooks/useAdminInviteAction";
import { UserRole } from "@/auth/shema";
import { Plus } from "lucide-react";

interface AdminInviteFormProps {
  onSuccess?: () => void;
}

export function AdminInviteForm({ onSuccess }: AdminInviteFormProps) {
  const [open, setOpen] = useState(false);
  const { createInvite, isCreating } = useAdminInviteActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminInvite>({
    resolver: zodResolver(adminInviteSchema),
    defaultValues: {
      role: UserRole.Enum.ADMIN,
    },
  });

  const onSubmit = (data: AdminInvite) => {
    createInvite({
      inviteData: data,
      onSuccess: () => {
        reset();
        setOpen(false);
        onSuccess?.();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Admin User</DialogTitle>
          <DialogDescription>
            Send an invitation to a new admin user. They will receive an email
            with instructions to set up their account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
