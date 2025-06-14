"use client";

import { useAuthContext } from "@/providers/auth-context";
import { redirect, useRouter } from "next/navigation";
import { useAdminDashboardStats } from "@/reports/hooks/useAdminDashboardStats";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  AlertTriangle,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  Shield,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { stats, isLoading, error } = useAdminDashboardStats();

  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background/50 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-background/50 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                Error Loading Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Failed to load dashboard statistics. Please try again later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
    className,
  }: {
    title: string;
    value: number;
    icon: LucideIcon;
    description?: string;
    trend?: "up" | "down" | "neutral";
    className?: string;
  }) => (
    <Card
      className={cn("transition-all duration-200 hover:shadow-md", className)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp
              className={cn(
                "h-3 w-3 mr-1",
                trend === "up" && "text-green-500",
                trend === "down" && "text-red-500 rotate-180",
                trend === "neutral" && "text-gray-500"
              )}
            />
            <span className="text-xs text-muted-foreground">
              {trend === "up" && "Increasing"}
              {trend === "down" && "Decreasing"}
              {trend === "neutral" && "Stable"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background/50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Overview of marketplace activity and moderation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard
                title="Total Users"
                value={stats.users.totalUsers}
                icon={Users}
                description="All registered users"
                trend="up"
              />
              <StatCard
                title="Active Users"
                value={stats.users.activeUsers}
                icon={UserCheck}
                description="Recently active"
                trend="up"
              />
              <StatCard
                title="New Users (30d)"
                value={stats.users.newUsersLast30Days}
                icon={TrendingUp}
                description="Last 30 days"
                trend="up"
                className="border-l-4 border-l-green-500"
              />
              <StatCard
                title="Sellers"
                value={stats.users.sellerUsers}
                icon={Users}
                description="Verified sellers"
              />
              <StatCard
                title="Admins"
                value={stats.users.adminUsers}
                icon={Shield}
                description="Admin users"
              />
            </div>
          </div>

          {/* Reports Statistics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Content Moderation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Reports"
                value={stats.reports.totalReports}
                icon={FileText}
                description="All time reports"
              />
              <StatCard
                title="Pending Reports"
                value={stats.reports.pendingReports}
                icon={Clock}
                description="Awaiting review"
                className="border-l-4 border-l-yellow-500"
              />
              <StatCard
                title="Approved Reports"
                value={stats.reports.approvedReports}
                icon={CheckCircle}
                description="Action taken"
                className="border-l-4 border-l-green-500"
              />
              <StatCard
                title="Rejected Reports"
                value={stats.reports.rejectedReports}
                icon={XCircle}
                description="No action needed"
                className="border-l-4 border-l-red-500"
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Seller Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Applications"
                value={stats.sellerApplications.totalApplications}
                icon={FileText}
                description="All applications"
              />
              <StatCard
                title="Pending Review"
                value={stats.sellerApplications.pendingApplications}
                icon={Clock}
                description="Awaiting review"
                className="border-l-4 border-l-yellow-500"
              />
              <StatCard
                title="Approved"
                value={stats.sellerApplications.approvedApplications}
                icon={CheckCircle}
                description="Approved sellers"
                className="border-l-4 border-l-green-500"
              />
              <StatCard
                title="Rejected"
                value={stats.sellerApplications.rejectedApplications}
                icon={XCircle}
                description="Rejected applications"
                className="border-l-4 border-l-red-500"
              />
            </div>
          </div>

          {user.role === "SUPER_ADMIN" && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Admin Invitations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Invites"
                  value={stats.invites.totalInvites}
                  icon={Mail}
                  description="All invitations"
                />
                <StatCard
                  title="Pending"
                  value={stats.invites.pendingInvites}
                  icon={Clock}
                  description="Not yet accepted"
                  className="border-l-4 border-l-yellow-500"
                />
                <StatCard
                  title="Accepted"
                  value={stats.invites.acceptedInvites}
                  icon={CheckCircle}
                  description="Successfully joined"
                  className="border-l-4 border-l-green-500"
                />
                <StatCard
                  title="Expired"
                  value={stats.invites.expiredInvites}
                  icon={XCircle}
                  description="Expired invites"
                  className="border-l-4 border-l-red-500"
                />
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Review Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {stats.reports.pendingReports} reports awaiting review
                  </p>
                  <button
                    onClick={() => router.push("/admin/reports")}
                    className="text-sm text-primary hover:underline"
                  >
                    Go to Reports →
                  </button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Seller Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {stats.sellerApplications.pendingApplications} applications
                    pending
                  </p>
                  <button
                    onClick={() => router.push("/admin/seller-applications")}
                    className="text-sm text-primary hover:underline"
                  >
                    Review Applications →
                  </button>
                </CardContent>
              </Card>

              {user.role === "SUPER_ADMIN" && (
                <Card className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage {stats.users.totalUsers} users
                    </p>
                    <button
                      onClick={() => router.push("/admin/users")}
                      className="text-sm text-primary hover:underline"
                    >
                      Manage Users →
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
