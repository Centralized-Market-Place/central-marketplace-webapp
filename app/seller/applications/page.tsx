"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Store, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { useSellerApplications } from "@/seller/hooks/useSellerApplications";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { SellerApplicationStatusBadge } from "@/seller/components/SellerApplicationStatusBadge";
import { cn } from "@/lib/utils";

export default function SellerApplicationsPage() {
  const { applications, isLoading } = useSellerApplications();

  return (
    <div className="min-h-screen bg-background/50 py-8">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="bg-card rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                My Applications
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your seller applications and track their status
              </p>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/seller/apply">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Application
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-16">
              <LoadingSpinner />
            </div>
          ) : applications.length === 0 ? (
            <Card className="border-dashed bg-card">
              <CardHeader className="text-center pb-0">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  Start Your Seller Journey
                </CardTitle>
                <CardDescription className="max-w-md mx-auto text-muted-foreground">
                  Submit your first application to become a seller and start
                  reaching customers through our marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-6 pb-8">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/seller/apply">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Apply Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <Card
                  key={application.id}
                  className={cn(
                    "overflow-hidden transition-all duration-200 hover:shadow-md bg-card",
                    application.status === "PENDING" &&
                      "border-l-4 border-l-orange-500",
                    application.status === "APPROVED" &&
                      "border-l-4 border-l-green-500",
                    application.status === "REJECTED" &&
                      "border-l-4 border-l-red-500"
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                          <Store className="h-5 w-5 text-muted-foreground" />
                          {application.sellerInfo.businessName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Submitted on{" "}
                          {new Date(application.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </CardDescription>
                      </div>
                      <SellerApplicationStatusBadge
                        status={application.status}
                        className="w-fit"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          TIN Number
                        </h3>
                        <p className="font-medium text-foreground">
                          {application.sellerInfo.tinNumber}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Store className="h-4 w-4" />
                          Channel
                        </h3>
                        <p className="font-medium text-foreground">
                          {application.sellerInfo.channelName}
                        </p>
                      </div>
                      {application.status === "REJECTED" &&
                        application.adminReviewNotes && (
                          <div className="col-span-2 mt-2 p-4 bg-destructive/10 dark:bg-destructive/20 rounded-lg border border-destructive/20">
                            <h3 className="text-sm font-medium text-destructive mb-1">
                              Rejection Reason
                            </h3>
                            <p className="text-sm text-destructive/90">
                              {application.adminReviewNotes}
                            </p>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
