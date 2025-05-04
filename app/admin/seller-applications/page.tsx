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

export default function AdminSellerApplicationsPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [page, setPage] = useState(1);
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
  });

  if (user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Applications</h1>

        <div className="flex items-center gap-4">
          <div className="w-[180px]">
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
                <SelectValue placeholder="Filter by status" />
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
        <Card>
          <CardHeader>
            <CardTitle>No Applications Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              There are no seller applications matching your current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {applications.map((application) => (
              <Card key={application.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {application.sellerInfo.businessName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Submitted on{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <SellerApplicationStatusBadge status={application.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                        TIN Number
                      </h3>
                      <p>{application.sellerInfo.tinNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                        Channel
                      </h3>
                      <p>{application.sellerInfo.channelName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                        Channel ID
                      </h3>
                      <p>{application.sellerInfo.channelId}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                        Bot Admin Status
                      </h3>
                      <p
                        className={
                          application.sellerInfo.hasBotAdminAccess
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {application.sellerInfo.hasBotAdminAccess
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                    {application.status !== "PENDING" &&
                      application.adminReviewNotes && (
                        <div className="col-span-2">
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                            Admin Notes
                          </h3>
                          <p>{application.adminReviewNotes}</p>
                        </div>
                      )}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Government ID
                    </h3>
                    <div className="border rounded-md p-2 bg-muted/50">
                      <Image
                        // src={application.sellerInfo.governmentId}
                        src="/bot_admin_access.png"
                        alt="Government ID (placeholder)"
                        width={120}
                        height={80}
                      />
                    </div>
                  </div>

                  {application.status === "PENDING" && (
                    <div className="mt-6 flex gap-4">
                      <Button
                        onClick={() => setSelectedApplicationId(application.id)}
                        className="flex-1"
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
            <div className="flex justify-between items-center mt-8">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min((page - 1) * 10 + 1, pagination.total)} to{" "}
                {Math.min(page * 10, pagination.total)} of {pagination.total}{" "}
                applications
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page * 10 >= pagination.total}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedApplicationId && (
        <AdminSellerApplicationReview
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
        />
      )}
    </div>
  );
}
