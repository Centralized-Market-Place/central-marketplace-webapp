import { z } from "zod";

export const ChannelSchema = z.object({
  id: z.number(),
  title: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  thumbnail_url: z.string().optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
  created_at: z.coerce.date().optional().nullable(),
  total_products: z.number().optional(),
  participants: z.number(),
  trust_score: z.number().optional(),
  verified: z.boolean().optional(),
  restricted: z.boolean().optional(),
  scam: z.boolean().optional(),
  has_geo: z.boolean().optional(),
  has_link: z.boolean().optional(),
  broadcast: z.boolean(),
  date_created: z.coerce.date().optional().nullable(),
});

export const ChannelsSchema = z.object({
  items: z.array(ChannelSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type Channel = z.infer<typeof ChannelSchema>;
export type Channels = z.infer<typeof ChannelsSchema>;
