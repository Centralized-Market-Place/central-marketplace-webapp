"use client";

import { useState } from "react";
import { useAuthContext } from "@/providers/auth-context";
import { useRouter } from "next/navigation";
import { useReports } from "@/reports/hooks/useReports";
import { ReportStatus, ReportTarget, ReportType } from "@/reports/schema";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportStatusBadge } from "@/reports/components/report-status-badge";
import { ReportTypeBadge } from "@/reports/components/report-type-badge";
import { ReportReviewDialog } from "@/reports/components/report-review-dialog";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Package,
  MessageSquare,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminReportsPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | undefined>(
    undefined
  );
  const [targetTypeFilter, setTargetTypeFilter] = useState<
    ReportTarget | undefined
  >(undefined);
  const [reportTypeFilter, setReportTypeFilter] = useState<
    ReportType | undefined
  >(undefined);

  const { reports, pagination, isLoading } = useReports({
    page,
    pageSize: 10,
    statusFilter,
    targetTypeFilter,
    reportTypeFilter,
    sortBy: "created_at",
    sortDesc: true,
  });

  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    router.push("/");
    return null;
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const clearFilters = () => {
    setStatusFilter(undefined);
    setTargetTypeFilter(undefined);
    setReportTypeFilter(undefined);
    setPage(1);
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <div className="min-h-screen bg-background/50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="bg-card rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Content Moderation</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Review and manage user reports
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {reports.filter((r) => r.status === "PENDING").length} pending
              </span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <div className="flex-1 sm:max-w-xs">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(
                    value === "ALL" ? undefined : (value as ReportStatus)
                  )
                }
              >
                <SelectTrigger className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 sm:max-w-xs">
              <Select
                value={targetTypeFilter}
                onValueChange={(value) =>
                  setTargetTypeFilter(
                    value === "ALL" ? undefined : (value as ReportTarget)
                  )
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by target type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All types</SelectItem>
                  <SelectItem value="PRODUCT">Products</SelectItem>
                  <SelectItem value="CHANNEL">Channels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 sm:max-w-xs">
              <Select
                value={reportTypeFilter}
                onValueChange={(value) =>
                  setReportTypeFilter(
                    value === "ALL" ? undefined : (value as ReportType)
                  )
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All report types</SelectItem>
                  <SelectItem value="SCAM">Scam</SelectItem>
                  <SelectItem value="NOT_RELATED">Not Related</SelectItem>
                  <SelectItem value="INAPPROPRIATE">Inappropriate</SelectItem>
                  <SelectItem value="SPAM">Spam</SelectItem>
                  <SelectItem value="FAKE_PRODUCT">Fake Product</SelectItem>
                  <SelectItem value="MISLEADING">Misleading</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters} size="sm">
              Clear Filters
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-16">
              <LoadingSpinner />
            </div>
          ) : reports.length === 0 ? (
            <Card className="border-dashed bg-card">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No reports found matching your filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {reports.map((report) => (
                  <Card
                    key={report.id}
                    className={cn(
                      "transition-all duration-200 hover:shadow-sm",
                      report.status === "PENDING" &&
                        "border-l-4 border-l-yellow-500",
                      report.status === "UNDER_REVIEW" &&
                        "border-l-4 border-l-blue-500",
                      report.status === "APPROVED" &&
                        "border-l-4 border-l-green-500",
                      report.status === "REJECTED" &&
                        "border-l-4 border-l-red-500"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {report.targetType === "PRODUCT" ? (
                              <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <h3 className="font-medium text-sm truncate">
                              {report.targetTitle ||
                                `${report.targetType} Report`}
                            </h3>
                            <Link
                              href={
                                report.targetType === "PRODUCT"
                                  ? `/?productId=${report.targetId}`
                                  : `/channels/${report.targetId}`
                              }
                              target="_blank"
                              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{report.reporterName || "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(report.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <span className="text-xs">
                              {report.reportType.replace("_", " ")}
                            </span>
                          </div>

                          {report.message && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {report.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                          <div className="flex items-center gap-2">
                            <ReportStatusBadge status={report.status} />
                            <ReportTypeBadge type={report.reportType} />
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={
                                report.targetType === "PRODUCT"
                                  ? `/?productId=${report.targetId}`
                                  : `/channels/${report.targetId}`
                              }
                              target="_blank"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs"
                              >
                                View
                              </Button>
                            </Link>
                            <ReportReviewDialog report={report}>
                              <Button size="sm" className="h-8 px-3 text-xs">
                                Review
                              </Button>
                            </ReportReviewDialog>
                          </div>
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
                  {Math.min(
                    (page - 1) * pagination.pageSize + 1,
                    pagination.total
                  )}{" "}
                  to {Math.min(page * pagination.pageSize, pagination.total)} of{" "}
                  {pagination.total} reports
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, totalPages || 1) },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
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
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= (totalPages || 1)}
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
    </div>
  );
}
