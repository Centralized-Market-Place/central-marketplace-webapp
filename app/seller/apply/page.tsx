"use client";

import { SellerApplicationForm } from "@/seller/components/SellerApplicationForm";
import { BecomeSellerStepper } from "@/seller/components/BecomeSellerStepper";
import { useState } from "react";
import { useAuthContext } from "@/providers/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TelegramLoginButton from "@/auth/compenents/telegram-auth-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { BotAddInstructions } from "@/seller/components/BotAddInstructions";
import { useBotStatus } from "@/seller/hooks/useBotStatus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BecomeSellerPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [channelId, setChannelId] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("");
  const botStatus = useBotStatus(channelId);

  const getCurrentStep = () => {
    if (!user?.telegram) {
      return 0;
    }

    if (!channelId || !botStatus.botStatus?.verifiedChannelOwnership) {
      return 1;
    }

    return 2;
  };

  const currentStep = activeStep || getCurrentStep();
  const handleNextStep = () => {
    setActiveStep(currentStep + 1);
  };

  const handleChannelSelection = (channelId: string, channelName: string) => {
    setChannelId(channelId);
    setChannelName(channelName);
    botStatus.refetch();
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Become a Seller</h1>

      <BecomeSellerStepper currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Connect Your Telegram Account</CardTitle>
              <CardDescription>
                You need to link your Telegram account to become a seller. This
                allows us to verify your identity and communicate with you.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8">
              {user?.telegram ? (
                <div className="flex flex-col items-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <p className="text-lg font-medium">
                    Telegram account connected successfully!
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <Avatar>
                      <AvatarImage src={user.telegram.photoUrl ?? undefined} />
                      <AvatarFallback>
                        {user.telegram.firstName.charAt(0)}
                        {user.telegram.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium">
                        {user.telegram.firstName} {user.telegram.lastName}
                      </p>
                      {user.telegram.username && (
                        <p className="text-sm text-muted-foreground">
                          @{user.telegram.username}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button onClick={handleNextStep} className="mt-6">
                    Continue to Next Step
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-6">
                  <p className="text-center mb-4">
                    Click the button below to authenticate with your Telegram
                    account.
                  </p>
                  <TelegramLoginButton
                    onSuccess={() => {
                      setTimeout(() => {
                        handleNextStep();
                      }, 1000);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <BotAddInstructions
            onChannelSelected={handleChannelSelection}
            onBotAdded={handleNextStep}
            selectedChannelId={channelId}
            botStatus={botStatus}
          />
        )}

        {currentStep === 2 && (
          <SellerApplicationForm
            channelId={channelId}
            channelName={channelName}
            onApplicationSubmitted={() => router.push("/seller/applications")}
          />
        )}
      </div>
    </div>
  );
}
