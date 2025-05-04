import { z } from "zod";

export const SellerApplicationStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const SellerInfoSchema = z.object({
  businessName: z.string(),
  tinNumber: z.string(),
  channelId: z.string(),
  channelName: z.string(),
  governmentId: z.string(),
  hasBotAdminAccess: z.boolean(),
  verifiedChannelOwnership: z.boolean(),
});

export const SellerApplicationSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
  status: SellerApplicationStatusEnum,
  sellerInfo: SellerInfoSchema,
  adminReviewNotes: z.string().nullable(),
});

export const SellerApplicationSaveSchema = z.object({
  businessName: z.string(),
  tinNumber: z.string(),
  channelId: z.string(),
  channelName: z.string(),
  governmentId: z.string(),
});

export const SellerApplicationReviewSchema = z.object({
  applicationId: z.string(),
  status: SellerApplicationStatusEnum,
  adminReviewNotes: z.string().nullable(),
});

export const BotStatusSchema = z.object({
  hasBotAdminAccess: z.boolean(),
  verifiedChannelOwnership: z.boolean(),
});

export const PaginatedSellerApplicationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  items: z.array(SellerApplicationSchema),
});

export type SellerApplication = z.infer<typeof SellerApplicationSchema>;
export type SellerApplicationSave = z.infer<typeof SellerApplicationSaveSchema>;
export type SellerApplicationReview = z.infer<
  typeof SellerApplicationReviewSchema
>;
export type SellerApplicationStatus = z.infer<
  typeof SellerApplicationStatusEnum
>;
export type SellerInfo = z.infer<typeof SellerInfoSchema>;
export type BotStatus = z.infer<typeof BotStatusSchema>;
export type SellerApplications = z.infer<
  typeof PaginatedSellerApplicationSchema
>;
