import { useState, useEffect } from "react";
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
import { CheckCircle2Icon, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface BotAddInstructionsProps {
  onChannelSelected: (channelId: string, channelName: string) => void;
  onBotAdded: () => void;
  selectedChannelId: string;
  botStatus: {
    botStatus?: {
      hasBotAdminAccess: boolean;
      verifiedChannelOwnership: boolean;
    };
    isLoading: boolean;
    refetch: () => void;
  };
}

export function BotAddInstructions({
  onChannelSelected,
  onBotAdded,
  selectedChannelId,
  botStatus,
}: BotAddInstructionsProps) {
  const [channelId, setChannelId] = useState(selectedChannelId);
  const [channelName, setChannelName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // When bot status changes, update the verification state
  useEffect(() => {
    if (botStatus.botStatus?.hasBotAdminAccess) {
      setIsVerifying(false);

      // If verification is complete, proceed to next step
      if (selectedChannelId === channelId && channelName) {
        setTimeout(() => {
          onBotAdded();
        }, 1500);
      }
    }
  }, [
    botStatus.botStatus,
    selectedChannelId,
    channelId,
    channelName,
    onBotAdded,
  ]);

  const handleVerify = () => {
    if (channelId && channelName) {
      setIsVerifying(true);
      onChannelSelected(channelId, channelName);
    }
  };

  const handleRefreshStatus = () => {
    botStatus.refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Add Our Bot to Your Channel</CardTitle>
        <CardDescription>
          You need to add our bot as an administrator to your Telegram channel.
          This allows us to verify your channel ownership and help you manage
          product listings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Channel Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="channelId">Channel ID</Label>
              <Input
                id="channelId"
                placeholder="e.g. @channel_username"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                disabled={isVerifying || botStatus.botStatus?.hasBotAdminAccess}
              />
              <p className="text-xs text-muted-foreground">
                add @ to the beginning of the channel username. optionally you
                can add channel id which you can obtain by sending a message to
                @username_to_id_bot
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelName">Channel Name</Label>
              <Input
                id="channelName"
                placeholder="e.g., My Product Channel"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                disabled={isVerifying || botStatus.botStatus?.hasBotAdminAccess}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add the Bot as Administrator</h3>
          <Alert>
            <AlertDescription>
              <ol className="list-decimal ml-4 space-y-2">
                <li>
                  Open your Telegram channel on your mobile device or desktop
                </li>
                <li>Go to channel info → Administrators → Add Administrator</li>
                <li>
                  Search for <strong>@central_marketplace_v1_bot</strong> and
                  select it
                </li>
                <li>
                  Set the permissions exactly as shown in the screenshot below
                </li>
                <li>Click &quot;Done&quot; or &quot;Save&quot; to confirm</li>
              </ol>
            </AlertDescription>
          </Alert>

          <div className="border rounded-md p-4 bg-muted/30">
            <Image
              src="/bot_admin_access.png"
              alt="Bot Permissions Screenshot"
              className="w-full max-w-md mx-auto rounded-md border"
              width={400}
              height={450}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://via.placeholder.com/400x450?text=Admin+Permissions+Screenshot";
              }}
            />
          </div>
        </div>

        {botStatus.botStatus?.hasBotAdminAccess ? (
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-md border border-green-200">
            <CheckCircle2Icon className="h-10 w-10 text-green-500 mb-2" />
            <h3 className="text-lg font-medium text-green-700">
              Bot Successfully Added!
            </h3>
            <p className="text-sm text-green-600 text-center mb-4">
              The bot has been successfully added to your channel as an
              administrator.
            </p>
            <Button onClick={onBotAdded}>Continue to Next Step</Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            {!isVerifying ? (
              <Button
                onClick={handleVerify}
                className="flex-1"
                disabled={!channelId || !channelName}
              >
                Verify Bot Access
              </Button>
            ) : (
              <>
                <p className="flex-1 py-2 text-muted-foreground">
                  Checking bot access status...
                </p>
                <Button variant="outline" onClick={handleRefreshStatus}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Refresh Status
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
