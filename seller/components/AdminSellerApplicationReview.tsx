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
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Building,
  Hash,
  Bot,
  FileText,
} from "lucide-react";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useAlert } from "@/providers/alert-provider";
import { SellerApplicationStatusEnum } from "@/seller/schema";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

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
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const alert = useAlert();

  const { application, isLoading: isLoadingApplication } =
    useSellerApplication(applicationId);

  const { reviewApplication, isLoading: isSubmittingReview } =
    useSellerApplicationReview();

  const handleApprove = () => {
    setActionType("approve");
    reviewApplication({
      data: {
        applicationId,
        status: SellerApplicationStatusEnum.Values.APPROVED,
        adminReviewNotes: reviewNotes || null,
      },
      onSuccess: () => {
        alert?.success(
          "Application approved successfully. The seller will need to log in again."
        );
        setShowDialog(false);
        setTimeout(onClose, 500);
      },
      onError: () => {
        setActionType(null);
      },
    });
  };

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      return;
    }

    setActionType("reject");
    reviewApplication({
      data: {
        applicationId,
        status: SellerApplicationStatusEnum.Values.REJECTED,
        adminReviewNotes: reviewNotes,
      },
      onSuccess: () => {
        setShowDialog(false);
        setTimeout(onClose, 500);
      },
      onError: () => {
        setActionType(null);
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            Review Seller Application
          </DialogTitle>
          <DialogDescription className="text-base">
            Review this seller application and approve or reject it based on the
            information provided.
          </DialogDescription>
        </DialogHeader>

        {isLoadingApplication ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : !application ? (
          <div className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium text-destructive">
              Application not found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              The application you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6 py-4">
              {/* Application Header */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {application.sellerInfo.businessName}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    Application ID: {application.id.slice(-8)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Submitted on{" "}
                  {new Date(application.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>

              {/* Application Details */}
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Building className="h-4 w-4" />
                      Business Name
                    </div>
                    <p className="text-base font-medium">
                      {application.sellerInfo.businessName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      TIN Number
                    </div>
                    <p className="text-base font-medium">
                      {application.sellerInfo.tinNumber}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Channel
                    </div>
                    <p className="text-base font-medium">
                      {application.sellerInfo.channelName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Bot className="h-4 w-4" />
                      Bot Admin Access
                    </div>
                    <Badge
                      variant={
                        application.sellerInfo.hasBotAdminAccess
                          ? "default"
                          : "secondary"
                      }
                    >
                      {application.sellerInfo.hasBotAdminAccess ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                {/* Government ID */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Government ID Document
                  </div>
                  <div className="border rounded-lg p-3 bg-muted/20">
                    <Image
                      src={application.sellerInfo.governmentId}
                      alt="Government ID"
                      width={200}
                      height={150}
                      className="rounded-md object-cover border"
                    />
                  </div>
                </div>

                <Separator />

                {/* Admin Review Notes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Admin Review Notes
                  </div>
                  <Textarea
                    placeholder="Add comments about this application (required for rejection)"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="min-h-[100px] resize-none"
                    disabled={isSubmittingReview}
                  />
                  {actionType === "reject" && !reviewNotes.trim() && (
                    <p className="text-sm text-destructive">
                      Review notes are required when rejecting an application.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={isSubmittingReview}
                className="min-w-[80px]"
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isSubmittingReview || !reviewNotes.trim()}
                className="gap-2 min-w-[100px]"
              >
                {isSubmittingReview && actionType === "reject" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                Reject
              </Button>

              <Button
                onClick={handleApprove}
                disabled={isSubmittingReview}
                className="gap-2 min-w-[100px]"
              >
                {isSubmittingReview && actionType === "approve" ? (
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
