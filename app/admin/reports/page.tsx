"use client";

import { useState } from "react";
import { useAuthContext } from "@/providers/auth-context";
import { useRouter } from "next/navigation";
import { useReports } from "@/reports/hooks/useReports";
import { ReportStatus, ReportTarget, ReportType } from "@/reports/schema";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Content Moderation
              </h1>
              <p className="text-muted-foreground mt-1">
                Review and manage user reports
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">
                {reports.filter((r) => r.status === "PENDING").length} pending
                reviews
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
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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

            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-16">
              <LoadingSpinner />
            </div>
          ) : reports.length === 0 ? (
            <Card className="border-dashed bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  No Reports Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  There are no reports matching your current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {reports.map((report) => (
                  <Card
                    key={report.id}
                    className={cn(
                      "overflow-hidden transition-all duration-200 hover:shadow-md bg-card",
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
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {report.targetType === "PRODUCT" ? (
                              <Package className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            )}
                            <CardTitle className="text-lg text-foreground">
                              {report.targetTitle ||
                                `${report.targetType} Report`}
                            </CardTitle>
                            <Link
                              href={
                                report.targetType === "PRODUCT"
                                  ? `/?productId=${report.targetId}`
                                  : `/channels/${report.targetId}`
                              }
                              target="_blank"
                              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>By {report.reporterName || "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(report.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ReportStatusBadge status={report.status} />
                          <ReportTypeBadge type={report.reportType} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Target Type
                            </h4>
                            <p className="font-medium text-foreground">
                              {report.targetType}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Report Type
                            </h4>
                            <p className="font-medium text-foreground">
                              {report.reportType.replace("_", " ")}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              View Content
                            </h4>
                            <Link
                              href={
                                report.targetType === "PRODUCT"
                                  ? `/?productId=${report.targetId}`
                                  : `/channels/${report.targetId}`
                              }
                              target="_blank"
                              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm"
                            >
                              <span>
                                View {report.targetType.toLowerCase()}
                              </span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Status
                            </h4>
                            <p className="font-medium text-foreground">
                              {report.status.replace("_", " ")}
                            </p>
                          </div>
                          {report.reviewedAt && (
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">
                                Reviewed At
                              </h4>
                              <p className="font-medium text-foreground">
                                {new Date(
                                  report.reviewedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {report.message && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Report Message
                          </h4>
                          <p className="text-sm bg-muted/30 dark:bg-muted/10 p-3 rounded-lg border">
                            {report.message}
                          </p>
                        </div>
                      )}

                      {report.adminNotes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Admin Notes
                          </h4>
                          <p className="text-sm bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                            {report.adminNotes}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <ReportReviewDialog report={report}>
                          <Button variant="outline" size="sm">
                            Review Report
                          </Button>
                        </ReportReviewDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pagination.pageSize + 1} to{" "}
                    {Math.min(page * pagination.pageSize, pagination.total)} of{" "}
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
                        { length: Math.min(5, totalPages) },
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
                      disabled={page >= totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
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
