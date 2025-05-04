"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, File, Upload } from "lucide-react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export function FileUpload({ onFileSelected }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelected(file);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelected(file);
    }
  };

  // For demo purposes, we'll use a placeholder file
  if (selectedFile) {
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
        <CheckCircle2 className="h-5 w-5 text-green-500 ml-2" />
      </div>
    );
  }

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
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        onClick={() => document.getElementById("file-upload")?.click()}
        type="button"
        size="sm"
      >
        Browse Files
      </Button>
    </div>
  );
}
