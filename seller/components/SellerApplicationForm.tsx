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
  const [governmentId, setGovernmentId] = useState(
    "https://example.com/placeholder-id-url"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutations
  const { submitApplication, isLoading } = useSellerApplicationMutation();

  // Form validation
  const isFormValid = businessName && tinNumber && governmentId;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        onApplicationSubmitted();
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  // Handle file upload (mock implementation)
  const handleFileUpload = (file: File) => {
    console.log("File selected:", file.name);
    // In a real implementation, you would upload the file to a server
    // and then set the URL returned from the server
    setGovernmentId(`https://cloudinary.com/uploads/${file.name}`);
  };

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
                <FileUpload onFileSelected={handleFileUpload} />
                <p className="text-xs text-muted-foreground">
                  Please upload a clear image of a valid government ID. Accepted
                  formats: JPG, PNG, PDF (max 5MB).
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
