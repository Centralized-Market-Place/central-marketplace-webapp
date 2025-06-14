"use client";

import { useState } from "react";
import { useAuthContext } from "@/providers/auth-context";
import { redirect } from "next/navigation";
import { UserRole, UserFilter } from "@/auth/shema";
import {
  useAdminUsers,
  DEFAULT_USER_FILTERS,
} from "@/auth/hooks/useAdminUsers";
import { useAdminUserActions } from "@/auth/hooks/useAdminUserActions";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminUsersPage() {
  const { user } = useAuthContext();
  const [filters, setFilters] = useState<UserFilter>(DEFAULT_USER_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "USER">("USER");

  const { users, pagination, isLoading, refetch } = useAdminUsers(filters);
  const { updateUserRole, isUpdating } = useAdminUserActions();

  if (user?.role !== UserRole.Enum.SUPER_ADMIN) {
    redirect("/");
  }

  const handleSearch = () => {
    setFilters({
      ...filters,
      query: searchQuery,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  const handleRoleUpdate = (userId: string, newRole: "ADMIN" | "USER") => {
    updateUserRole({
      userId,
      roleData: { role: newRole },
      onSuccess: () => {
        refetch();
      },
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "destructive";
      case "ADMIN":
        return "default";
      case "SELLER":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Shield className="h-3 w-3" />;
      case "ADMIN":
        return <Shield className="h-3 w-3" />;
      default:
        return <UserIcon className="h-3 w-3" />;
    }
  };

  const getPageNumbers = () => {
    if (!pagination) return [];

    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const currentPage = pagination.page;
    const pages = [];

    // Always show first page
    if (totalPages > 0) pages.push(1);

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    // Always show last page if more than 1 page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages.sort((a, b) => a - b);
  };

  return (
    <div className="min-h-screen bg-background/50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                User Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage user roles and permissions
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.role || "all"}
              onValueChange={(value) => {
                setFilters({
                  ...filters,
                  role:
                    value === "all"
                      ? undefined
                      : (value as "ADMIN" | "USER" | "SELLER" | "SUPER_ADMIN"),
                  page: 1,
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={UserRole.Enum.USER}>User</SelectItem>
                <SelectItem value={UserRole.Enum.SELLER}>Seller</SelectItem>
                <SelectItem value={UserRole.Enum.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.Enum.SUPER_ADMIN}>
                  Super Admin
                </SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isLoading}>
              Search
            </Button>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No users found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserIcon className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ID: {user.id.slice(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {user.email || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getRoleBadgeVariant(user.role)}
                              className="flex items-center gap-1 w-fit"
                            >
                              {getRoleIcon(user.role)}
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.isVerified ? "default" : "secondary"
                              }
                            >
                              {user.isVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {user.lastLogin
                                ? format(
                                    new Date(user.lastLogin),
                                    "MMM dd, yyyy"
                                  )
                                : "Never"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {format(new Date(user.createdAt), "MMM dd, yyyy")}
                            </span>
                          </TableCell>
                          <TableCell>
                            {user.role !== UserRole.Enum.SUPER_ADMIN && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRole(
                                        user.role === UserRole.Enum.ADMIN
                                          ? "USER"
                                          : "ADMIN"
                                      );
                                    }}
                                  >
                                    Change Role
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Change User Role
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to change{" "}
                                      {user.firstName} {user.lastName}&apos;s
                                      role from <strong>{user.role}</strong> to{" "}
                                      <strong>{selectedRole}</strong>?
                                      <br />
                                      <br />
                                      This action will immediately update their
                                      permissions.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleRoleUpdate(user.id, selectedRole)
                                      }
                                      disabled={isUpdating}
                                    >
                                      {isUpdating
                                        ? "Updating..."
                                        : "Update Role"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.total > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                  <p className="text-sm text-muted-foreground order-2 sm:order-1">
                    Showing{" "}
                    {Math.min(
                      (pagination.page - 1) * pagination.pageSize + 1,
                      pagination.total
                    )}{" "}
                    to{" "}
                    {Math.min(
                      pagination.page * pagination.pageSize,
                      pagination.total
                    )}{" "}
                    of {pagination.total} users
                  </p>

                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNum, index, array) => (
                        <div key={pageNum} className="flex items-center gap-1">
                          {index > 0 && array[index - 1] !== pageNum - 1 && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Button
                            variant={
                              pagination.page === pageNum
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="min-w-[2.5rem]"
                          >
                            {pageNum}
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        pagination.page * pagination.pageSize >=
                        pagination.total
                      }
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
