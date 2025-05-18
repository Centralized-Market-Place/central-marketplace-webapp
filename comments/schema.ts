import { UserSchema } from "@/auth/shema";
import { z } from "zod";

export const ReactionTarget = z.enum(["comment", "product"]);
export const ReactionType = z.enum(["like", "dislike", "upvote", "downvote"]);

export const CommentSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  message: z.string(),
  likes: z.number(),
  dislikes: z.number(),
  userId: z.string(),
  productId: z.string(),
  user: UserSchema.nullable(),
  parentId: z.string().nullable(),
  userReaction: ReactionType.nullable(),
});

export const ReactionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  targetId: z.string(),
  targetType: ReactionTarget,
  reactionType: ReactionType,
});

export const ReactionSaveSchema = z.object({
  targetId: z.string(),
  targetType: ReactionTarget,
  reactionType: ReactionType,
});

export const CommentSaveSchema = z.object({
  message: z.string(),
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
export type ReactionSave = z.infer<typeof ReactionSaveSchema>;
export type Reaction = z.infer<typeof ReactionSchema>;
