"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye } from "lucide-react";
import { Report, ReportReview, ReportReviewSchema } from "../schema";
import { useReviewReport } from "../hooks/useReportActions";

interface ReportReviewDialogProps {
  report: Report;
  children?: React.ReactNode;
}

export function ReportReviewDialog({
  report,
  children,
}: ReportReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const { reviewReport, isLoading } = useReviewReport();

  const form = useForm<ReportReview>({
    resolver: zodResolver(ReportReviewSchema),
    defaultValues: {
      status: report.status,
      adminNotes: report.adminNotes || "",
    },
  });

  const onSubmit = async (data: ReportReview) => {
    reviewReport({
      reportId: report.id,
      reviewData: data,
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Review
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Report</DialogTitle>
          <DialogDescription>
            Review and update the status of this report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Report Details
            </h4>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">Reporter:</span>{" "}
                {report.reporterName || "Unknown"}
              </p>
              <p>
                <span className="font-medium">Target:</span>{" "}
                {report.targetTitle || "Unknown"}
              </p>
              <p>
                <span className="font-medium">Type:</span> {report.reportType}
              </p>
              <p>
                <span className="font-medium">Target Type:</span>{" "}
                {report.targetType}
              </p>
              {report.message && (
                <div>
                  <span className="font-medium">Message:</span>
                  <p className="mt-1 text-sm text-muted-foreground bg-muted p-2 rounded">
                    {report.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about your review decision..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
