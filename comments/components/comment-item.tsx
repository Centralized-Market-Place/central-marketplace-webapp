"use client";

import { useState } from "react";
import type { Comment } from "@/comments/schema";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ReplySection } from "./reply-section";
import { useReaction } from "@/comments/hooks/useReaction";
import { useCommentAction } from "@/comments/hooks/useCommentAction";
import { useAuthContext } from "@/providers/auth-context";
import { formatDistanceToNow } from "@/comments/utils";
import {
  MessageSquare,
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

interface CommentItemProps {
  comm: Comment;
}

export function CommentItem({ comm }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [editText, setEditText] = useState(comm.message);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { createReaction, isLoading } = useReaction(comm.id);
  const { updateComment, deleteComment, isUpdatingComment, isDeletingComment } =
    useCommentAction(comm.productId);
  const { isAuthenticated, user } = useAuthContext();

  const isCommentOwner = user?.id === comm.userId;

  const [comment, setComment] = useState({ ...comm });

  const handleReaction = (reactionType: "like" | "dislike") => {
    if (!isAuthenticated) return;

    createReaction({
      reactionSave: {
        targetId: comment.id,
        targetType: "comment",
        reactionType,
      },
      onSuccess: () => {
        setComment((prev) => {
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

  const handleUpdateComment = () => {
    if (!editText.trim() || editText === comment.message) {
      setIsEditing(false);
      return;
    }

    updateComment({
      commentId: comment.id,
      commentSave: {
        message: editText,
      },
      onSuccess: () => {
        setIsEditing(false);
        setComment((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            message: editText,
          };
        });
      },
    });
  };

  const handleDeleteComment = () => {
    deleteComment({
      commentId: comment.id,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="size-8 flex items-center justify-center border-[1px] rounded-full">
            <User2 className="size-4" />
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">User</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(comment.createdAt)}
                </span>
              </div>

              {isCommentOwner && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing || isDeletingComment}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isEditing || isDeletingComment}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[80px]"
                  disabled={isUpdatingComment}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(comment.message);
                    }}
                    disabled={isUpdatingComment}
                  >
                    <X size={16} className="mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleUpdateComment}
                    disabled={
                      !editText.trim() ||
                      editText === comment.message ||
                      isUpdatingComment
                    }
                  >
                    <Check size={16} className="mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-1">{comment.message}</p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-2 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-8"
            onClick={() => handleReaction("like")}
            disabled={isLoading || !isAuthenticated}
          >
            <ThumbsUp
              className={cn(comment.userReaction === "like" && "fill-current")}
              size={14}
            />
            {formatNumber(comment.likes)}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-8"
            onClick={() => handleReaction("dislike")}
            disabled={isLoading || !isAuthenticated}
          >
            <ThumbsDown
              className={cn(
                comment.userReaction === "dislike" && "fill-current"
              )}
              size={14}
            />
            {formatNumber(comment.dislikes)}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 h-8"
            onClick={() => setShowReplies(!showReplies)}
          >
            <MessageSquare size={14} />
            {showReplies ? "Hide Replies" : "Show Replies"}
          </Button>
        </div>

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isReplying) {
                setIsReplying(false);
              } else {
                setIsReplying(true);
                setShowReplies(true);
              }
            }}
          >
            {isReplying ? "Cancel" : "Reply"}
          </Button>
        )}
      </CardFooter>

      {showReplies && (
        <div className="px-4 pb-4">
          <ReplySection
            commentId={comment.id}
            isReplying={isReplying}
            onReplyCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingComment ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
