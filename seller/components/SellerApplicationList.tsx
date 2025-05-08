import { SellerApplication } from "../schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SellerApplicationStatusBadge } from "./SellerApplicationStatusBadge";

interface SellerApplicationListProps {
  applications: SellerApplication[];
}

export function SellerApplicationList({
  applications,
}: SellerApplicationListProps) {
  return (
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
  );
}
