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
import { Flag } from "lucide-react";
import { ReportCreate, ReportCreateSchema, ReportTarget } from "../schema";
import { useCreateReport } from "../hooks/useReportActions";

interface CreateReportDialogProps {
  targetId: string;
  targetType: ReportTarget;
  targetTitle?: string;
  children?: React.ReactNode;
}

export function CreateReportDialog({
  targetId,
  targetType,
  targetTitle,
  children,
}: CreateReportDialogProps) {
  const [open, setOpen] = useState(false);
  const { createReport, isLoading } = useCreateReport();

  const form = useForm<ReportCreate>({
    resolver: zodResolver(ReportCreateSchema),
    defaultValues: {
      targetId,
      targetType,
      reportType: "OTHER",
      message: "",
    },
  });

  const onSubmit = async (data: ReportCreate) => {
    createReport({
      reportData: data,
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const reportTypeOptions = [
    { value: "SCAM", label: "Scam" },
    { value: "NOT_RELATED", label: "Not Related" },
    { value: "INAPPROPRIATE", label: "Inappropriate Content" },
    { value: "SPAM", label: "Spam" },
    { value: "FAKE_PRODUCT", label: "Fake Product" },
    { value: "MISLEADING", label: "Misleading Information" },
    { value: "OTHER", label: "Other" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Flag className="h-4 w-4 mr-2" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {targetType.toLowerCase()}</DialogTitle>
          <DialogDescription>
            Help us maintain a safe marketplace by reporting inappropriate
            content.
            {targetTitle && (
              <span className="block mt-1 font-medium">
                Reporting: {targetTitle}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reportTypeOptions.map((option) => (
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide additional context about this report..."
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
                {isLoading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
