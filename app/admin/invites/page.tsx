"use client";

import { useAuthContext } from "@/providers/auth-context";
import { redirect } from "next/navigation";
import { AdminInviteForm } from "@/admin-invite/components/AdminInviteForm";
import { AdminInvitesList } from "@/admin-invite/components/AdminInvitesList";
import { UserRole } from "@/auth/shema";

export default function AdminInvitesPage() {
  const { user } = useAuthContext();

  if (user?.role !== UserRole.Enum.SUPER_ADMIN) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background/50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Admin Invitations
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage admin user invitations and track their status
              </p>
            </div>
            <AdminInviteForm />
          </div>

          <AdminInvitesList />
        </div>
      </div>
    </div>
  );
}
