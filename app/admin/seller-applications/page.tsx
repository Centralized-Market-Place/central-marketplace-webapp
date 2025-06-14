"use client";

import { useState } from "react";
import { useAdminSellerApplications } from "@/seller/hooks/useAdminSellerApplications";
import { SellerApplicationStatus } from "@/seller/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { SellerApplicationStatusBadge } from "@/seller/components/SellerApplicationStatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSellerApplicationReview } from "@/seller/components/AdminSellerApplicationReview";
import { useAuthContext } from "@/providers/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Building,
  Hash,
  Bot,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminSellerApplicationsPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    SellerApplicationStatus | undefined
  >(undefined);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  const { applications, pagination, isLoading } = useAdminSellerApplications({
    page,
    pageSize: 10,
    status: selectedStatus,
    search: searchQuery,
  });

  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background/50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Seller Applications</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Review and manage seller applications
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by business name or channel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <div className="w-full sm:w-[180px]">
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(
                      value === "ALL"
                        ? undefined
                        : (value as SellerApplicationStatus)
                    )
                  }
                >
                  <SelectTrigger className="h-9">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-16">
              <LoadingSpinner />
            </div>
          ) : applications.length === 0 ? (
            <Card className="border-dashed bg-card">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No seller applications found matching your filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {applications.map((application) => (
                  <Card
                    key={application.id}
                    className={cn(
                      "transition-all duration-200 hover:shadow-sm",
                      application.status === "PENDING" &&
                        "border-l-4 border-l-orange-500",
                      application.status === "APPROVED" &&
                        "border-l-4 border-l-green-500",
                      application.status === "REJECTED" &&
                        "border-l-4 border-l-red-500"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* Main Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-lg truncate">
                                {application.sellerInfo.businessName}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(
                                    application.createdAt
                                  ).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                            <SellerApplicationStatusBadge
                              status={application.status}
                              className="flex-shrink-0"
                            />
                          </div>

                          {/* Key Details Grid */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Hash className="h-3 w-3" />
                                <span>TIN</span>
                              </div>
                              <p className="text-sm font-medium truncate">
                                {application.sellerInfo.tinNumber}
                              </p>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Building className="h-3 w-3" />
                                <span>Channel</span>
                              </div>
                              <p className="text-sm font-medium truncate">
                                {application.sellerInfo.channelName}
                              </p>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <FileText className="h-3 w-3" />
                                <span>Channel ID</span>
                              </div>
                              <p className="text-sm font-medium truncate">
                                {application.sellerInfo.channelId}
                              </p>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Bot className="h-3 w-3" />
                                <span>Bot Access</span>
                              </div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  application.sellerInfo.hasBotAdminAccess
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                )}
                              >
                                {application.sellerInfo.hasBotAdminAccess
                                  ? "Yes"
                                  : "No"}
                              </p>
                            </div>
                          </div>

                          {/* Admin Notes */}
                          {application.status !== "PENDING" &&
                            application.adminReviewNotes && (
                              <div className="bg-muted/30 dark:bg-muted/10 rounded-md p-3 mb-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Admin Notes
                                </p>
                                <p className="text-sm line-clamp-2">
                                  {application.adminReviewNotes}
                                </p>
                              </div>
                            )}
                        </div>

                        {/* Government ID & Actions */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                          <div className="w-full lg:w-auto">
                            <p className="text-xs font-medium text-muted-foreground mb-2">
                              Government ID
                            </p>
                            <div className="relative overflow-hidden rounded-md border bg-muted/30 dark:bg-muted/10 hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors">
                              <Image
                                src={application.sellerInfo.governmentId}
                                alt="Government ID"
                                width={120}
                                height={80}
                                className="object-cover"
                              />
                            </div>
                          </div>

                          {application.status === "PENDING" && (
                            <Button
                              onClick={() =>
                                setSelectedApplicationId(application.id)
                              }
                              size="sm"
                              className="w-full lg:w-auto lg:min-w-[100px]"
                            >
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Always show pagination */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  {Math.min((page - 1) * 10 + 1, pagination?.total || 0)} to{" "}
                  {Math.min(page * 10, pagination?.total || 0)} of{" "}
                  {pagination?.total || 0} applications
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      {
                        length: Math.min(
                          5,
                          Math.ceil((pagination?.total || 0) / 10) || 1
                        ),
                      },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil((pagination?.total || 0) / 10)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedApplicationId && (
        <AdminSellerApplicationReview
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
        />
      )}
    </div>
  );
}
