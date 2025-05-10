import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSellerApplicationMutation } from "@/seller/hooks/useSellerApplicationMutation";
import { SellerApplicationSave } from "@/seller/schema";
import { FileUpload } from "@/seller/components/FileUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface SellerApplicationFormProps {
  channelId: string;
  channelName: string;
  onApplicationSubmitted: () => void;
}

export function SellerApplicationForm({
  channelId,
  channelName,
  onApplicationSubmitted,
}: SellerApplicationFormProps) {
  // Form state
  const [businessName, setBusinessName] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [governmentId, setGovernmentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mutations
  const { submitApplication, isLoading } = useSellerApplicationMutation();

  // Form validation
  const isFormValid = businessName && tinNumber && governmentId;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isFormValid) return;

    setIsSubmitting(true);

    const applicationData: SellerApplicationSave = {
      businessName,
      tinNumber,
      channelId,
      channelName,
      governmentId,
    };

    submitApplication({
      data: applicationData,
      onSuccess: () => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        // Call the parent callback after a short delay to allow the user to see the success message
        setTimeout(() => {
          onApplicationSubmitted();
        }, 2000);
      },
      onError: () => {
        setIsSubmitting(false);
        setSubmitError("Failed to submit application. Please try again.");
      },
    });
  };

  // Handle file upload
  const handleFileUpload = (fileUrl: string) => {
    setGovernmentId(fileUrl);
  };

  if (submitSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Submitted Successfully</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your seller application has been submitted. We will review your
              information and get back to you shortly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Complete Your Seller Application</CardTitle>
        <CardDescription>
          Provide additional information about your business to complete your
          seller application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your business or store name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tinNumber">
                  Tax Identification Number (TIN)
                </Label>
                <Input
                  id="tinNumber"
                  placeholder="Your TIN number"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This information is required for tax purposes.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channelInfo">Telegram Channel</Label>
                <Input
                  id="channelInfo"
                  value={channelName + " (" + channelId + ")"}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="governmentId">Government Issued ID</Label>
                <FileUpload
                  onFileSelected={handleFileUpload}
                  folder="government-ids"
                />
                <p className="text-xs text-muted-foreground">
                  Please upload a clear image of a valid government ID. Accepted
                  formats: JPG, PNG, PDF (max 10MB).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isLoading || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              By submitting this application, you agree to our terms and
              conditions for sellers.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
