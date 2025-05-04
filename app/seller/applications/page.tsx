"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSellerApplications } from "@/seller/hooks/useSellerApplications";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { SellerApplicationStatusBadge } from "@/seller/components/SellerApplicationStatusBadge";

export default function SellerApplicationsPage() {
  const { applications, isLoading } = useSellerApplications();

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Seller Applications</h1>
        <Button asChild>
          <Link href="/seller/apply">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Application
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-16">
          <LoadingSpinner />
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Applications Yet</CardTitle>
            <CardDescription>
              You haven&apos;t submitted any seller applications yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-8">
            <p className="mb-4 text-center text-muted-foreground">
              Start the application process to become a seller and list your
              products on our marketplace.
            </p>
            <Button asChild>
              <Link href="/seller/apply">
                <PlusCircle className="mr-2 h-4 w-4" />
                Apply Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{application.sellerInfo.businessName}</CardTitle>
                    <CardDescription>
                      Submitted on{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <SellerApplicationStatusBadge status={application.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                      TIN Number
                    </h3>
                    <p>{application.sellerInfo.tinNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                      Channel
                    </h3>
                    <p>{application.sellerInfo.channelName}</p>
                  </div>
                  {application.status === "REJECTED" &&
                    application.adminReviewNotes && (
                      <div className="col-span-2 mt-2">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                          Rejection Reason
                        </h3>
                        <p className="text-red-500">
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
  );
}
