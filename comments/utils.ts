import { createQueryKeyStructure } from "@/lib/query_keys";

export const commentKeys = createQueryKeyStructure("comment");
export const replyKeys = createQueryKeyStructure("reply");
export const reactionKeys = createQueryKeyStructure("reaction");

export const formatDistanceToNow = (date: Date) => {
  const now = new Date();
  const nowUtc = new Date(now.toISOString());

  const diff = nowUtc.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diff / 1000);
  const diffInMinutes = Math.floor(diff / (1000 * 60));
  const diffInHours = Math.floor(diff / (1000 * 60 * 60));
  const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    return `${diffInDays} days ago`;
  }
};
