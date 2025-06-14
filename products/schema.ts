import { ChannelSchema } from "@/channels/schema";
import { ReactionType } from "@/comments/schema";
import { Filter } from "lucide-react";
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
  link: z.array(z.string()),
  phone: z.array(z.string()),
  categories: z.array(z.string()),
});

export const ProductsSchema = z.object({
  items: z.array(ProductSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export const ProductUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  isAvailable: z.boolean().optional(),
  phone: z.array(z.string()).optional(),
  location: z.string().optional(),
});

export const ProductFilterSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  query: z.string().optional(),
  sortBy: z.string().optional(),
  sortDesc: z.boolean().optional(),
  channelId: z.string().optional(),
  channelIds: z.array(z.string()).optional(),
  categories: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  channelIds: z.array(z.string()).optional(),
});

export const BookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  createdAt: z.coerce.date(),
});


// Update schema to match the API response structure
export const FilterCategorySchema = z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    items: z.array(z.object({
        id: z.string(),
        createdAt: z.string().nullable(),
        updatedAt: z.string().nullable(),
        categoryName: z.string(),
    })),
});


export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

export type Bookmark = z.infer<typeof BookmarkSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Products = z.infer<typeof ProductsSchema>;
export type ProductFilter = z.infer<typeof ProductFilterSchema>;
export type FilterCategoryType = z.infer<typeof FilterCategorySchema>;
