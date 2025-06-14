import { apiPost } from "@/services/api";
import { Report, ReportCreate, ReportReview, ReportSchema } from "../schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys } from "../utils";
import { useAuthContext } from "@/providers/auth-context";
import { API_URL, getErrorField } from "@/lib/utils";
import humps from "humps";
import { useAlert } from "@/providers/alert-provider";

export function useCreateReport() {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const alert = useAlert();

  const createReport = async ({
    reportData,
  }: {
    reportData: ReportCreate;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }) => {
    return await apiPost<Report>(
      `${API_URL}/api/v1/reports`,
      ReportSchema,
      humps.decamelizeKeys(reportData),
      token ?? undefined
    );
  };

  const createReportMutation = useMutation({
    mutationFn: createReport,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      alert?.success("Report submitted successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.(error);
      alert?.error(getErrorField(error, "detail") || "Failed to submit report");
    },
  });

  return {
    createReport: createReportMutation.mutate,
    isLoading: createReportMutation.isPending,
    isError: createReportMutation.isError,
    error: createReportMutation.error,
  };
}

export function useReviewReport() {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const alert = useAlert();

  const reviewReport = async ({
    reportId,
    reviewData,
  }: {
    reportId: string;
    reviewData: ReportReview;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }) => {
    return await apiPost<Report>(
      `${API_URL}/api/v1/reports/${reportId}/review`,
      ReportSchema,
      humps.decamelizeKeys(reviewData),
      token ?? undefined
    );
  };

  const reviewReportMutation = useMutation({
    mutationFn: reviewReport,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.()
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      alert?.success("Report reviewed successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.(error);
      alert?.error(getErrorField(error, "detail") || "Failed to review report");
    },
  });

  return {
    reviewReport: reviewReportMutation.mutate,
    isLoading: reviewReportMutation.isPending,
    isError: reviewReportMutation.isError,
    error: reviewReportMutation.error,
  };
}
