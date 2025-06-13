"use client";

import { useState } from "react";
import { useComments } from "@/comments/hooks/useComments";
import { useCommentAction } from "@/comments/hooks/useCommentAction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentItem } from "./comment-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/providers/auth-context";
import { AlertCircle, MessageSquarePlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CommentSectionProps {
  productId: string;
}

export function CommentSection({ productId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const { comments, isLoading, isError, error, fetchNextPage, hasNextPage } =
    useComments(10, productId);
  const { createComment, isCreatingComment } = useCommentAction(productId);
  const { isAuthenticated } = useAuthContext();

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    createComment({
      commentSave: {
        message: commentText,
      },
      onSuccess: () => {
        setCommentText("");
        setShowCommentBox(false);
      },
    });
  };

  const handleCancelComment = () => {
    setCommentText("");
    setShowCommentBox(false);
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading comments: {error?.message || "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {isAuthenticated ? (
        <div className="space-y-2">
          {showCommentBox ? (
            <>
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[100px]"
                disabled={isCreatingComment}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancelComment}
                  disabled={isCreatingComment}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isCreatingComment}
                >
                  {isCreatingComment ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="outline"
              className="w-full flex gap-2 justify-center items-center"
              onClick={() => setShowCommentBox(true)}
            >
              <MessageSquarePlus className="h-4 w-4" />
              Write a comment
            </Button>
          )}
        </div>
      ) : (
        <Alert>
          <AlertDescription>Please sign in to post a comment.</AlertDescription>
        </Alert>
      )}

      {
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Comments</h3>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comm={comment} />
              ))}

              {hasNextPage && (
                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => fetchNextPage()}>
                    Load More Comments
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      }
    </div>
  );
}
