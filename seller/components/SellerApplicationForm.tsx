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
import { useSellerApplicationMutation } from "@/seller/hooks/useSellerApplicationMutation";
import {
  SellerApplicationSave,
  SellerApplicationForm as SellerFormType,
  SellerApplicationFormSchema,
} from "@/seller/schema";
import { FileUpload } from "@/seller/components/FileUpload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { submitApplication, isLoading } = useSellerApplicationMutation();

  const form = useForm<SellerFormType>({
    resolver: zodResolver(SellerApplicationFormSchema),
    defaultValues: {
      businessName: "",
      tinNumber: "",
      governmentId: "",
    },
  });

  const onSubmit = (data: SellerFormType) => {
    setSubmitError(null);

    const applicationData: SellerApplicationSave = {
      ...data,
      channelId,
      channelName,
    };

    submitApplication({
      data: applicationData,
      onSuccess: () => {
        setSubmitSuccess(true);
        onApplicationSubmitted();
      },
      onError: () => {
        setSubmitError("Failed to submit application. Please try again.");
      },
    });
  };

  const handleFileUpload = (fileUrl: string) => {
    form.setValue("governmentId", fileUrl);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your business or store name"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tinNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Identification Number (TIN)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your TIN number"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        This information is required for tax purposes.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Telegram Channel</FormLabel>
                  <Input
                    value={channelName + " (" + channelId + ")"}
                    disabled
                  />
                </div>

                <FormField
                  control={form.control}
                  name="governmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Government Issued ID</FormLabel>
                      <FormControl>
                        <div>
                          <FileUpload
                            onFileSelected={handleFileUpload}
                            folder="government-ids"
                          />
                          <Input type="hidden" {...field} />
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Please upload a clear image of a valid government ID.
                        Accepted formats: JPG, PNG, PDF (max 10MB).
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                By submitting this application, you agree to our terms and
                conditions for sellers.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
