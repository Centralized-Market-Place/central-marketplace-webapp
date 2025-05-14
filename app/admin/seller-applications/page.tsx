"use client";

import { useState } from "react";
import { useAdminSellerApplications } from "@/seller/hooks/useAdminSellerApplications";
import { SellerApplicationStatus } from "@/seller/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
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

  if (user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background/50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Seller Applications
            </h1>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by business name or channel name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
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
                  <SelectTrigger>
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
              <CardHeader>
                <CardTitle className="text-foreground">
                  No Applications Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  There are no seller applications matching your current
                  filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4">
                {applications.map((application) => (
                  <Card
                    key={application.id}
                    className={cn(
                      "overflow-hidden transition-all duration-200 hover:shadow-md bg-card",
                      application.status === "PENDING" &&
                        "border-l-4 border-l-orange-500",
                      application.status === "APPROVED" &&
                        "border-l-4 border-l-green-500",
                      application.status === "REJECTED" &&
                        "border-l-4 border-l-red-500"
                    )}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                          <CardTitle className="text-xl text-foreground">
                            {application.sellerInfo.businessName}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Submitted on{" "}
                            {new Date(application.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <SellerApplicationStatusBadge
                          status={application.status}
                          className="w-fit"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            TIN Number
                          </h3>
                          <p className="font-medium text-foreground">
                            {application.sellerInfo.tinNumber}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Channel
                          </h3>
                          <p className="font-medium text-foreground">
                            {application.sellerInfo.channelName}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Channel ID
                          </h3>
                          <p className="font-medium text-foreground">
                            {application.sellerInfo.channelId}
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Bot Admin Status
                          </h3>
                          <p
                            className={cn(
                              "font-medium",
                              application.sellerInfo.hasBotAdminAccess
                                ? "text-green-500 dark:text-green-400"
                                : "text-red-500 dark:text-red-400"
                            )}
                          >
                            {application.sellerInfo.hasBotAdminAccess
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                      </div>

                      {application.status !== "PENDING" &&
                        application.adminReviewNotes && (
                          <div className="mt-4 p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border">
                            <h3 className="text-sm font-medium text-foreground mb-2">
                              Admin Notes
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {application.adminReviewNotes}
                            </p>
                          </div>
                        )}

                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          Government ID
                        </h3>
                        <div className="relative overflow-hidden rounded-lg border bg-muted/30 dark:bg-muted/10 hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors">
                          <Image
                            src={application.sellerInfo.governmentId}
                            alt="Government ID"
                            width={200}
                            height={120}
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {application.status === "PENDING" && (
                        <div className="mt-6">
                          <Button
                            onClick={() =>
                              setSelectedApplicationId(application.id)
                            }
                            className="w-full sm:w-auto"
                            size="lg"
                          >
                            Review Application
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination controls */}
              {pagination && pagination.total > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                  <p className="text-sm text-muted-foreground order-2 sm:order-1">
                    Showing {Math.min((page - 1) * 10 + 1, pagination.total)} to{" "}
                    {Math.min(page * 10, pagination.total)} of{" "}
                    {pagination.total} applications
                  </p>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page * 10 >= pagination.total}
                      onClick={() => setPage(page + 1)}
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

      {selectedApplicationId && (
        <AdminSellerApplicationReview
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
        />
      )}
    </div>
  );
}
