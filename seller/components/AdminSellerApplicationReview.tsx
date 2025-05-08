import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSellerApplicationReview } from "@/seller/hooks/useSellerApplicationReview";
import { useSellerApplication } from "@/seller/hooks/useSellerApplication";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useAlert } from "@/providers/alert-provider";

interface AdminSellerApplicationReviewProps {
  applicationId: string;
  onClose: () => void;
}

export function AdminSellerApplicationReview({
  applicationId,
  onClose,
}: AdminSellerApplicationReviewProps) {
  const [reviewNotes, setReviewNotes] = useState("");
  const [showDialog, setShowDialog] = useState(true);
  const alert = useAlert();

  const { application, isLoading: isLoadingApplication } =
    useSellerApplication(applicationId);

  const { reviewApplication, isLoading: isSubmittingReview } =
    useSellerApplicationReview();

  const handleApprove = () => {
    reviewApplication({
      data: {
        applicationId,
        status: "APPROVED",
        adminReviewNotes: reviewNotes || null,
      },
      onSuccess: () => {
        alert?.success(
          "Application approved successfully. The seller will need to log in again."
        );
        setShowDialog(false);
        setTimeout(onClose, 500);
      },
    });
  };

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      return;
    }

    reviewApplication({
      data: {
        applicationId,
        status: "REJECTED",
        adminReviewNotes: reviewNotes,
      },
      onSuccess: () => {
        setShowDialog(false);
        setTimeout(onClose, 500);
      },
    });
  };

  return (
    <Dialog
      open={showDialog}
      onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) setTimeout(onClose, 200);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Seller Application</DialogTitle>
          <DialogDescription>
            Review this seller application and approve or reject it based on the
            information provided.
          </DialogDescription>
        </DialogHeader>

        {isLoadingApplication ? (
          <div className="py-6 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : !application ? (
          <div className="py-6 text-center text-red-500">
            Application not found
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Business Name</h3>
                <p>{application.sellerInfo.businessName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">TIN Number</h3>
                <p>{application.sellerInfo.tinNumber}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Channel</h3>
                <p>{application.sellerInfo.channelName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Admin Notes</h3>
                <Textarea
                  placeholder="Add comments about this application (required for rejection)"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={isSubmittingReview}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isSubmittingReview || !reviewNotes.trim()}
                className="gap-2"
              >
                {isSubmittingReview ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                Reject
              </Button>

              <Button
                onClick={handleApprove}
                disabled={isSubmittingReview}
                className="gap-2"
              >
                {isSubmittingReview ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Approve
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
