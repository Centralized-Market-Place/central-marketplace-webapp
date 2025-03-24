import { z } from "zod";

export const CommentSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  message: z.string(),
  likes: z.number(),
  dislikes: z.number(),
  userId: z.string(),
  postId: z.string(),
  parentId: z.string().nullable(),
});

export const CommentSaveSchema = z.object({
  message: z.string(),
  likes: z.number().optional(),
  dislikes: z.number().optional(),
});

export const CommentsSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  items: z.array(CommentSchema),
});

export type Comment = z.infer<typeof CommentSchema>;
export type CommentSave = z.infer<typeof CommentSaveSchema>;
export type Comments = z.infer<typeof CommentsSchema>;
