import { z } from "zod";

export const ReportType = z.enum([
  "SCAM",
  "NOT_RELATED",
  "INAPPROPRIATE",
  "SPAM",
  "FAKE_PRODUCT",
  "MISLEADING",
  "OTHER",
]);

export const ReportTarget = z.enum(["PRODUCT", "CHANNEL"]);

export const ReportStatus = z.enum([
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
]);

export const ReportSchema = z.object({
  id: z.string(),
  reporterId: z.string(),
  targetId: z.string(),
  targetType: ReportTarget,
  reportType: ReportType,
  message: z.string().nullable(),
  status: ReportStatus,
  reviewedBy: z.string().nullable(),
  reviewedAt: z.coerce.date().nullable(),
  adminNotes: z.string().nullable(),
  reporterName: z.string().nullable(),
  targetTitle: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const ReportsSchema = z.object({
  items: z.array(ReportSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const ReportCreateSchema = z.object({
  targetId: z.string(),
  targetType: ReportTarget,
  reportType: ReportType,
  message: z.string().optional(),
});

export const ReportReviewSchema = z.object({
  status: ReportStatus,
  adminNotes: z.string().optional(),
});

export const ReportFilterSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  statusFilter: ReportStatus.optional(),
  targetTypeFilter: ReportTarget.optional(),
  reportTypeFilter: ReportType.optional(),
  sortBy: z.string().optional(),
  sortDesc: z.boolean().optional(),
});

export const ReportStatisticsSchema = z.object({
  totalReports: z.number(),
  pendingReports: z.number(),
  approvedReports: z.number(),
  rejectedReports: z.number(),
});

export const SellerApplicationStatisticsSchema = z.object({
  totalApplications: z.number(),
  pendingApplications: z.number(),
  approvedApplications: z.number(),
  rejectedApplications: z.number(),
});

export const UserStatisticsSchema = z.object({
  totalUsers: z.number(),
  activeUsers: z.number(),
  adminUsers: z.number(),
  sellerUsers: z.number(),
  newUsersLast30Days: z.number(),
});

export const InviteStatisticsSchema = z.object({
  totalInvites: z.number(),
  pendingInvites: z.number(),
  acceptedInvites: z.number(),
  expiredInvites: z.number(),
});

export const AdminDashboardStatsSchema = z.object({
  reports: ReportStatisticsSchema,
  sellerApplications: SellerApplicationStatisticsSchema,
  users: UserStatisticsSchema,
  invites: InviteStatisticsSchema,
});

export type ReportType = z.infer<typeof ReportType>;
export type ReportTarget = z.infer<typeof ReportTarget>;
export type ReportStatus = z.infer<typeof ReportStatus>;
export type Report = z.infer<typeof ReportSchema>;
export type Reports = z.infer<typeof ReportsSchema>;
export type ReportCreate = z.infer<typeof ReportCreateSchema>;
export type ReportReview = z.infer<typeof ReportReviewSchema>;
export type ReportFilter = z.infer<typeof ReportFilterSchema>;
export type ReportStatistics = z.infer<typeof ReportStatisticsSchema>;
export type SellerApplicationStatistics = z.infer<
  typeof SellerApplicationStatisticsSchema
>;
export type UserStatistics = z.infer<typeof UserStatisticsSchema>;
export type InviteStatistics = z.infer<typeof InviteStatisticsSchema>;
export type AdminDashboardStats = z.infer<typeof AdminDashboardStatsSchema>;
