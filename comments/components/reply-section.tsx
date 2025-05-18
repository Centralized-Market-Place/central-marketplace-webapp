"use client";

import { useState, useEffect } from "react";
import { useReplies } from "@/comments/hooks/useReplies";
import { useReplyAction } from "@/comments/hooks/useReplyAction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReplyItem } from "./reply-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/providers/auth-context";
import { AlertCircle, MessageCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReplySectionProps {
  commentId: string;
  isReplying: boolean;
  onReplyCancel: () => void;
}

export function ReplySection({
  commentId,
  isReplying,
  onReplyCancel,
}: ReplySectionProps) {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(isReplying);
  const { replies, isLoading, isError, error, fetchNextPage, hasNextPage } =
    useReplies(5, commentId);
  const { createReply, isCreatingReply } = useReplyAction(commentId);
  const { isAuthenticated } = useAuthContext();

  // Update local state when parent component changes isReplying
  useEffect(() => {
    setShowReplyBox(isReplying);
  }, [isReplying]);

  const handleSubmitReply = () => {
    if (!replyText.trim() || !isAuthenticated) return;

    createReply({
      replySave: {
        message: replyText,
      },
      onSuccess: () => {
        setReplyText("");
        setShowReplyBox(false);
        onReplyCancel();
      },
    });
  };

  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyBox(false);
    onReplyCancel();
  };

  if (isError) {
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading replies: {error?.message || "Unknown error"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {isAuthenticated && (
        <div className="space-y-2">
          {showReplyBox ? (
            <>
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[80px]"
                disabled={isCreatingReply}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelReply}
                  disabled={isCreatingReply}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim() || isCreatingReply}
                >
                  {isCreatingReply ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setShowReplyBox(true)}
            >
              <MessageCircle className="h-4 w-4" />
              Write a reply
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3 pl-6 border-l-2 border-muted">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : replies.length === 0 ? (
          <p className="text-muted-foreground text-center py-2">
            No replies yet.
          </p>
        ) : (
          <div className="space-y-3">
            {replies.map((reply) => (
              <ReplyItem key={reply.id} rep={reply} commentId={commentId} />
            ))}

            {hasNextPage && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchNextPage()}
                >
                  Load More Replies
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
