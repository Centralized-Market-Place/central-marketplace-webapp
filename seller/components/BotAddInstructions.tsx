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
import { CheckCircle2Icon, RotateCcw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BotChannelForm, BotChannelFormSchema } from "@/seller/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    refetch: () => Promise<unknown>;
  };
  onCancelPolling: () => void;
}

export function BotAddInstructions({
  onChannelSelected,
  onBotAdded,
  selectedChannelId,
  botStatus,
  onCancelPolling,
}: BotAddInstructionsProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<BotChannelForm>({
    resolver: zodResolver(BotChannelFormSchema),
    defaultValues: {
      channelId: selectedChannelId || "",
      channelName: "",
    },
  });

  const { watch } = form;
  const channelId = watch("channelId");
  const channelName = watch("channelName");

  useEffect(() => {
    if (botStatus.botStatus?.hasBotAdminAccess) {
      setIsVerifying(false);

      if (
        selectedChannelId === channelId &&
        channelName &&
        botStatus.botStatus.verifiedChannelOwnership
      ) {
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

  const handleVerify = (data: BotChannelForm) => {
    setIsVerifying(true);
    onChannelSelected(data.channelId, data.channelName);
  };

  const handleRefreshStatus = () => {
    setIsVerifying(true);
    botStatus.refetch().finally(() => {
      setIsVerifying(false);
    });
  };

  const handleCancel = () => {
    setIsVerifying(false);
    onCancelPolling();
  };

  const isChannelVerified =
    botStatus.botStatus?.hasBotAdminAccess &&
    botStatus.botStatus?.verifiedChannelOwnership;

  useEffect(() => {
    if (isChannelVerified) {
      form.reset({
        channelId,
        channelName,
      });
    }
  }, [isChannelVerified, channelId, channelName, form]);

  const determineUiState = () => {
    if (isVerifying) {
      return "checking";
    }

    if (!botStatus.botStatus) {
      return "initial";
    }

    if (botStatus.botStatus.hasBotAdminAccess) {
      return botStatus.botStatus.verifiedChannelOwnership
        ? "success"
        : "admin-but-not-verified";
    }

    return "initial";
  };

  const uiState = determineUiState();
  console.log(uiState);

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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleVerify)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="channelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. @channel_username"
                          disabled={isVerifying || isChannelVerified}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        add @ to the beginning of the channel username.
                        optionally you can add channel id which you can obtain
                        by sending a message to @username_to_id_bot
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., My Product Channel"
                          disabled={isVerifying || isChannelVerified}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
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

        {uiState === "success" && (
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
        )}

        {uiState === "admin-but-not-verified" && (
          <div className="flex flex-col items-center p-4 bg-amber-50 rounded-md border border-amber-200">
            <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
            <h3 className="text-lg font-medium text-amber-700">
              Channel Ownership Verification Failed
            </h3>
            <p className="text-sm text-amber-600 text-center mb-4">
              The bot has been added to the channel, but we couldn&apos;t verify
              that you are the admin of this channel. Please make sure you are
              an administrator of the channel with appropriate rights.
            </p>
            <div className="flex flex-row gap-4">
              <Button variant="outline" onClick={handleRefreshStatus}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry Verification
              </Button>
            </div>
          </div>
        )}

        {uiState === "initial" && (
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={form.handleSubmit(handleVerify)}
              className="flex-1"
              disabled={!channelId || !channelName}
            >
              Verify Bot Access
            </Button>
          </div>
        )}

        {uiState === "checking" && (
          <div className="flex flex-col md:flex-row gap-4">
            <p className="flex-1 py-2 text-muted-foreground">
              Checking bot access status...
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="outline" onClick={handleRefreshStatus}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
