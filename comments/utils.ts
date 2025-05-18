import { createQueryKeyStructure } from "@/lib/query_keys";
import { formatTimeAgo } from "@/lib/utils";

export const commentKeys = createQueryKeyStructure("comment");
export const replyKeys = createQueryKeyStructure("reply");
export const reactionKeys = createQueryKeyStructure("reaction");

export const formatDistanceToNow = formatTimeAgo;
