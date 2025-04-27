import { ReactionType } from "@/comments/schema";
import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string(),
  id: z.string(),
  description: z.string().optional(),
});

export const ProductSchema = z.object({
  channelId: z.number(),
  messageId: z.number(),
  forwards: z.number(),
  views: z.number(),
  id: z.string(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  isAvailable: z.boolean().optional(),
  images: z.array(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  upvotes: z.number(),
  downvotes: z.number(),
  comments: z.number(),
  postedAt: z.coerce.date().optional(),
  userReaction: ReactionType.nullable()
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

export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Products = z.infer<typeof ProductsSchema>;
export type ProductFilter = z.infer<typeof ProductFilterSchema>;
