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

export const BotChannelFormSchema = z.object({
  channelId: z.string().min(1, { message: "Channel username is required" }),
  channelName: z.string().min(1, { message: "Channel name is required" }),
});

export const SellerApplicationFormSchema = z.object({
  businessName: z.string().min(1, { message: "Business name is required" }),
  tinNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "TIN must be exactly 10 digits" }),
  governmentId: z.string().min(1, { message: "Government ID is required" }),
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
export type BotChannelForm = z.infer<typeof BotChannelFormSchema>;
export type SellerApplicationForm = z.infer<typeof SellerApplicationFormSchema>;
