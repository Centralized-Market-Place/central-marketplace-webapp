"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Channel } from "@/channels/schema";
import { useChannelAction } from "@/channels/hooks/useChannelAction";
import { useFileUpload } from "@/files/hooks/useFileUpload";
import { useAlert } from "@/providers/alert-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload, Shield, AlertTriangle, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { SignedUrlResponse } from "@/files/schema";

const ChannelEditSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  thumbnailUrl: z.string().optional(),
});

type ChannelEditFormValues = z.infer<typeof ChannelEditSchema>;

interface ChannelEditModalProps {
  channel: Channel | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChannelEditModal({
  channel,
  isOpen,
  onClose,
  onSuccess,
}: ChannelEditModalProps) {
  const { updateChannel, isUpdating } = useChannelAction();
  const { getSignedUrl, uploadToCloudinary, validateFile } = useFileUpload();
  const alert = useAlert();

  const [isUploadLoading, setIsUploadLoading] = useState(false);

  const form = useForm<ChannelEditFormValues>({
    resolver: zodResolver(ChannelEditSchema),
    defaultValues: {
      title: channel?.title || "",
      description: channel?.description || "",
      thumbnailUrl: channel?.thumbnailUrl || "",
    },
  });

  const getStatusBadge = (channel: Channel) => {
    if (channel.scam) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle size={12} />
          Flagged as Scam
        </Badge>
      );
    }
    if (channel.restricted) {
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertTriangle size={12} />
          Restricted
        </Badge>
      );
    }
    if (channel.verified) {
      return (
        <Badge variant="default" className="gap-1">
          <Shield size={12} />
          Verified
        </Badge>
      );
    }
    return <Badge variant="outline">Unverified</Badge>;
  };

  const handleSubmit = (data: ChannelEditFormValues) => {
    if (!channel) return;

    updateChannel({
      channelId: channel.id,
      channelUpdate: {
        title: data.title,
        description: data.description || "",
        thumbnailUrl: data.thumbnailUrl || "",
      },
      onSuccess: () => {
        onClose();
        onSuccess();
      },
    });
  };

  const uploadChannelImage = async (file: File) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      alert?.error(validation.error || "Invalid file");
      return;
    }

    setIsUploadLoading(true);

    try {
      getSignedUrl({
        signedUrlRequest: {
          fileType: file.type.split("/").pop() || "",
          folder: "channel-thumbnails",
        },
        onSuccess: async (signedUrlData: SignedUrlResponse) => {
          try {
            const uploadedUrl = await uploadToCloudinary(file, signedUrlData);
            form.setValue("thumbnailUrl", uploadedUrl);
            alert?.success("Image uploaded successfully");
            setIsUploadLoading(false);
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            alert?.error("Failed to upload image");
            setIsUploadLoading(false);
          }
        },
        onError: () => {
          alert?.error("Failed to get upload URL");
          setIsUploadLoading(false);
        },
      });
    } catch (error) {
      console.error("Error initiating upload:", error);
      alert?.error("Failed to upload image");
      setIsUploadLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadChannelImage(file);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById(
      "channel-image-upload"
    ) as HTMLInputElement;
    fileInput?.click();
  };

  const getCurrentImageUrl = () => {
    const formThumbnailUrl = form.watch("thumbnailUrl");
    return formThumbnailUrl || channel?.thumbnailUrl || "/tgthumbnail.jpeg";
  };

  if (!channel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
          <DialogDescription>
            Update your channel information and picture
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6 py-4">
              {/* Channel Picture Upload */}
              <div className="grid gap-4">
                <Label className="text-base font-medium">Channel Picture</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={getCurrentImageUrl()}
                      alt="Channel thumbnail"
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-20 h-20 border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 p-0"
                      onClick={triggerFileInput}
                      disabled={isUploadLoading || isUpdating}
                    >
                      {isUploadLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Camera size={14} />
                      )}
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      disabled={isUploadLoading || isUpdating}
                      className="gap-2"
                    >
                      <Upload size={16} />
                      {isUploadLoading ? "Uploading..." : "Change Picture"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 512x512px, max 5MB
                    </p>
                  </div>
                </div>
                <input
                  id="channel-image-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Channel Information */}
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter channel title"
                          disabled={isUpdating || isUploadLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your channel..."
                          rows={4}
                          disabled={isUpdating || isUploadLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Display read-only channel information */}
                <div className="grid gap-3 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">Channel Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Username:</span>
                      <p className="font-medium">
                        @{channel.username || "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Subscribers:
                      </span>
                      <p className="font-medium">
                        {channel.participants.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Telegram ID:
                      </span>
                      <p className="font-medium">{channel.telegramId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="mt-1">{getStatusBadge(channel)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdating || isUploadLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating || isUploadLoading}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
