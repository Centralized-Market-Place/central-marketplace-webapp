"use client";

import { useState, useRef } from "react";
import { useSellerChannels } from "@/channels/hooks/useSellerChannels";
import { useChannelAction } from "@/channels/hooks/useChannelAction";
import { useFileUpload } from "@/files/hooks/useFileUpload";
import { Channel } from "@/channels/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Upload,
  Users,
  Package,
  Shield,
  AlertTriangle,
  Camera,
} from "lucide-react";
import Image from "next/image";
import { useAlert } from "@/providers/alert-provider";

export default function SellerChannelsPage() {
  const { channels, channelsLoading, refetch } = useSellerChannels();
  const { updateChannel, isUpdating } = useChannelAction();
  const {
    getSignedUrl,
    uploadToCloudinary,
    validateFile,
    isLoading: isUploadLoading,
  } = useFileUpload();
  const alert = useAlert();
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const handleEditChannel = (channel: Channel) => {
    setEditingChannel(channel);
    setEditForm({
      title: channel.title || "",
      description: channel.description || "",
      thumbnailUrl: channel.thumbnailUrl || "",
    });
    setImagePreview(channel.thumbnailUrl || "");
    setIsEditModalOpen(true);
  };

  const handleSaveChannel = () => {
    if (!editingChannel) return;

    updateChannel({
      channelId: editingChannel.id,
      channelUpdate: editForm,
      onSuccess: () => {
        setIsEditModalOpen(false);
        setEditingChannel(null);
        refetch();
      },
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      alert?.error(validation.error || "Invalid file");
      return;
    }

    // Create a preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      // Get signed URL for upload
      getSignedUrl({
        signedUrlRequest: {
          fileType: file.type,
          folder: "channel-thumbnails",
        },
        onSuccess: async (signedUrlData) => {
          try {
            // Upload to Cloudinary
            const uploadedUrl = await uploadToCloudinary(file, signedUrlData);
            setEditForm({ ...editForm, thumbnailUrl: uploadedUrl });
            setImagePreview(uploadedUrl);
            alert?.success("Image uploaded successfully");

            // Clean up the preview URL
            URL.revokeObjectURL(previewUrl);
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            alert?.error("Failed to upload image");
            // Reset to original image on error
            setImagePreview(editForm.thumbnailUrl);
            URL.revokeObjectURL(previewUrl);
          }
        },
        onError: () => {
          alert?.error("Failed to get upload URL");
          // Reset to original image on error
          setImagePreview(editForm.thumbnailUrl);
          URL.revokeObjectURL(previewUrl);
        },
      });
    } catch (error) {
      console.error("Error initiating upload:", error);
      alert?.error("Failed to upload image");
      // Reset to original image on error
      setImagePreview(editForm.thumbnailUrl);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

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

  if (channelsLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Channels</h1>
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Channels</h1>
        <Badge variant="secondary" className="text-sm">
          {channels?.length || 0} Channel{channels?.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {!channels || channels.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              No channels found. Your channels will appear here once they are
              processed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {channels.map((channel) => (
            <Card key={channel.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={channel.thumbnailUrl || "/tgthumbnail.jpeg"}
                      alt={channel.title || "Channel"}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover w-30 h-30"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold line-clamp-1">
                          {channel.title ||
                            channel.username ||
                            "Unnamed Channel"}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {channel.participants.toLocaleString()} subscribers
                          </span>
                          {channel.totalProducts !== undefined && (
                            <span className="flex items-center gap-1">
                              <Package size={14} />
                              {channel.totalProducts} products
                            </span>
                          )}
                        </div>
                        <div className="mt-2">{getStatusBadge(channel)}</div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog
                          open={isEditModalOpen}
                          onOpenChange={setIsEditModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditChannel(channel)}
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 mb-3">
                      {channel.description || "No description available"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {channel.username && <span>@{channel.username}</span>}
                      {channel.trustScore !== undefined && (
                        <span>
                          Trust Score: {channel.trustScore.toFixed(1)}
                        </span>
                      )}
                      {channel.dateCreated && (
                        <span>
                          Created:{" "}
                          {new Date(channel.dateCreated).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Channel Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Channel</DialogTitle>
            <DialogDescription>
              Update your channel information and picture
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Channel Picture Section */}
            <div className="grid gap-4">
              <Label className="text-base font-medium">Channel Picture</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={
                      imagePreview ||
                      editForm.thumbnailUrl ||
                      "/tgthumbnail.jpeg"
                    }
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
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadLoading}
                  >
                    <Camera size={14} />
                  </Button>
                </div>
                <div className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadLoading}
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
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Channel Information */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Channel Title</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="Enter channel title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Describe your channel..."
                  rows={4}
                />
              </div>

              {/* Display read-only channel information */}
              {editingChannel && (
                <div className="grid gap-3 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">Channel Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Username:</span>
                      <p className="font-medium">
                        @{editingChannel.username || "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Subscribers:
                      </span>
                      <p className="font-medium">
                        {editingChannel.participants.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Telegram ID:
                      </span>
                      <p className="font-medium">{editingChannel.telegramId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="mt-1">
                        {getStatusBadge(editingChannel)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating || isUploadLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChannel}
              disabled={isUpdating || isUploadLoading}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
