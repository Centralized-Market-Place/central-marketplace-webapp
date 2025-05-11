"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  File,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useFileUpload } from "@/files/hooks/useFileUpload";
import { allowedFileTypes } from "@/files/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SignedUrlResponse } from "@/files/schema";

interface FileUploadProps {
  onFileSelected: (fileUrl: string) => void;
  folder?: string;
}

export function FileUpload({
  onFileSelected,
  folder = "government-ids",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const { getSignedUrl, uploadToCloudinary, validateFile, isLoading } =
    useFileUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadedUrl(null);
    onFileSelected("");

    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const processFile = async (file: File) => {
    setError(null);

    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      getSignedUrl({
        signedUrlRequest: {
          fileType: file.type.split("/")[1],
          folder: folder,
        },
        onSuccess: async (signedUrlData: SignedUrlResponse) => {
          try {
            const fileUrl = await uploadToCloudinary(file, signedUrlData);
            setUploadedUrl(fileUrl);
            onFileSelected(fileUrl);
            setIsUploading(false);
          } catch (err: unknown) {
            console.error("Upload error:", err);
            setError(
              err instanceof Error
                ? err.message
                : "Failed to upload file. Please try again."
            );
            setIsUploading(false);
          }
        },
        onError: () => {
          setError("Failed to get upload URL. Please try again.");
          setIsUploading(false);
        },
      });
    } catch (err: unknown) {
      console.error("Processing error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
      setIsUploading(false);
    }
  };

  if (error) {
    return (
      <>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        {renderUploadUI()}
      </>
    );
  }

  if (isUploading) {
    return (
      <div className="border rounded-md p-4 bg-muted/20 flex items-center">
        <div className="bg-primary/10 rounded-md p-2 mr-3">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
        <div className="flex-1">
          <p className="font-medium">Uploading file...</p>
          <p className="text-xs text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (selectedFile && uploadedUrl) {
    return (
      <div className="border rounded-md p-4 bg-muted/20 flex items-center">
        <div className="bg-primary/10 rounded-md p-2 mr-3">
          <File className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">
            {Math.round(selectedFile.size / 1024)} KB
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-destructive/10"
            onClick={handleRemoveFile}
          >
            <X className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </div>
    );
  }

  return renderUploadUI();

  function renderUploadUI() {
    return (
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
        <p className="text-xs text-muted-foreground mb-4">or</p>
        <Input
          id="file-upload"
          type="file"
          accept={allowedFileTypes.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
          type="button"
          size="sm"
          disabled={isLoading}
        >
          Browse Files
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Accepted formats:{" "}
          {allowedFileTypes.map((type) => type.split("/")[1]).join(", ")}
        </p>
      </div>
    );
  }
}
