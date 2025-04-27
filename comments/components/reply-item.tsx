"use client";

import { useState } from "react";
import type { Comment } from "@/comments/schema";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReaction } from "@/comments/hooks/useReaction";
import { useReplyAction } from "@/comments/hooks/useReplyAction";
import { useAuthContext } from "@/providers/auth-context";
import { formatDistanceToNow } from "date-fns";
import {
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Edit,
  X,
  Check,
  User2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, formatNumber } from "@/lib/utils";

interface ReplyItemProps {
  rep: Comment;
  commentId: string;
}

export function ReplyItem({ rep, commentId }: ReplyItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(rep.message);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { createReaction, isLoading } = useReaction(rep.id);
  const { updateReply, deleteReply, isUpdatingReply, isDeletingReply } =
    useReplyAction(commentId);
  const { isAuthenticated, user } = useAuthContext();

  const isReplyOwner = user?.id === rep.userId;
  const [reply, setReply] = useState({ ...rep });

  const handleReaction = (reactionType: "like" | "dislike") => {
    if (!isAuthenticated) return;

    createReaction({
      reactionSave: {
        targetId: reply.id,
        targetType: "comment",
        reactionType,
      },
      onSuccess: () => {
        setReply((prev) => {
          if (!prev) return prev;
          if (reactionType === "like") {
            return {
              ...prev,
              likes:
                prev.userReaction === "like" ? prev.likes - 1 : prev.likes + 1,
              dislikes:
                prev.dislikes - (prev.userReaction === "dislike" ? 1 : 0),
              userReaction: prev.userReaction === "like" ? null : "like",
            };
          } else if (reactionType === "dislike") {
            return {
              ...prev,
              dislikes:
                prev.userReaction === "dislike"
                  ? prev.dislikes - 1
                  : prev.dislikes + 1,
              likes: prev.likes - (prev.userReaction === "like" ? 1 : 0),
              userReaction: prev.userReaction === "dislike" ? null : "dislike",
            };
          }
          return prev;
        });
      },
    });
  };

  const handleUpdateReply = () => {
    if (!editText.trim() || editText === reply.message) {
      setIsEditing(false);
      return;
    }

    updateReply({
      replyId: reply.id,
      replySave: {
        message: editText,
      },
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleDeleteReply = () => {
    deleteReply({
      replyId: reply.id,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <div className="py-2">
      <div className="flex gap-2">
        <Avatar className="size-6 flex items-center justify-center border-[1px] rounded-full">
          <User2 className="size-3" />
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">User</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(reply.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {isReplyOwner && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing || isDeletingReply}
                >
                  <Edit size={12} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isEditing || isDeletingReply}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[60px]"
                disabled={isUpdatingReply}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(reply.message);
                  }}
                  disabled={isUpdatingReply}
                  className="h-7 text-xs"
                >
                  <X size={12} className="mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpdateReply}
                  disabled={
                    !editText.trim() ||
                    editText === reply.message ||
                    isUpdatingReply
                  }
                  className="h-7 text-xs"
                >
                  <Check size={12} className="mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm mt-1">{reply.message}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 h-6 px-2 text-xs"
              onClick={() => handleReaction("like")}
              disabled={isLoading || !isAuthenticated}
            >
              <ThumbsUp
                className={cn(reply.userReaction === "like" && "fill-current")}
                size={12}
              />
              {formatNumber(reply.likes)}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 h-6 px-2 text-xs"
              onClick={() => handleReaction("dislike")}
              disabled={!isAuthenticated || isLoading}
            >
              <ThumbsDown
                className={cn(
                  reply.userReaction === "dislike" && "fill-current"
                )}
                size={12}
              />
              {formatNumber(reply.dislikes)}
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              reply.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReply}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingReply ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
