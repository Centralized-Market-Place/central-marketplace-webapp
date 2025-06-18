import { z } from "zod";

export const ChannelSchema = z.object({
  id: z.string(),
  title: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional().nullable(),
  updatedAt: z.coerce.date().optional().nullable(),
  dateCreated: z.coerce.date().optional().nullable(),
  totalProducts: z.number().optional(),
  participants: z.number(),
  trustScore: z.number().optional(),
  verified: z.boolean().optional(),
  restricted: z.boolean().optional(),
  scam: z.boolean().optional(),
  hasGeo: z.boolean().optional(),
  hasLink: z.boolean().optional(),
  broadcast: z.boolean(),
  telegramId: z.number(),
  isSellerVerified: z.boolean().optional(),
});

export const ChannelsSchema = z.object({
  items: z.array(ChannelSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const ChannelFilterSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  query: z.string().optional(),
  sortBy: z.string().optional(),
  sortDesc: z.boolean().optional(),
  channelName: z.string().optional(),
});

export const ChannelUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

export const SellerAnalyticsSchema = z.object({
  totalProducts: z.number(),
  totalViews: z.number(),
  averagePrice: z.number(),
  availabilityPercentage: z.number(),
});

export type Channel = z.infer<typeof ChannelSchema>;
export type SellerAnalytics = z.infer<typeof SellerAnalyticsSchema>;
export type Channels = z.infer<typeof ChannelsSchema>;
export type ChannelFilter = z.infer<typeof ChannelFilterSchema>;
export type ChannelUpdate = z.infer<typeof ChannelUpdateSchema>;
