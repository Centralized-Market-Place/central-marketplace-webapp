import { ChannelSchema } from "@/channels/schema";
import { ReactionType } from "@/comments/schema";
import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string(),
  id: z.string(),
  description: z.string().optional(),
});

export const ProductSchema = z.object({
  channelId: z.string(),
  messageId: z.number().nullable(),
  telegramChannelId: z.number().nullable(),
  date: z.coerce.date(),
  title: z.string().nullable(),
  forwards: z.number(),
  views: z.number(),
  id: z.string(),
  description: z.string().nullable(),
  price: z.number().nullable(),
  isAvailable: z.boolean(),
  images: z.array(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  upvotes: z.number(),
  downvotes: z.number(),
  comments: z.number(),
  shares: z.number(),
  clicks: z.number().optional().nullable(),
  channel: ChannelSchema.nullable(),
  isBookmarked: z.boolean(),
  userReaction: ReactionType.nullable(),
  location: z.string().nullable(),
  link: z.string().nullable(),
});

export const ProductsSchema = z.object({
  items: z.array(ProductSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const ProductFilterSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  query: z.string().optional(),
  sortBy: z.string().optional(),
  sortDesc: z.boolean().optional(),
  channelId: z.string().optional(),
});

export const BookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  createdAt: z.coerce.date(),
});

export type Bookmark = z.infer<typeof BookmarkSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Products = z.infer<typeof ProductsSchema>;
export type ProductFilter = z.infer<typeof ProductFilterSchema>;
