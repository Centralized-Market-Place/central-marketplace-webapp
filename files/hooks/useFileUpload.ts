import { API_URL } from "@/lib/utils";
import {
  SignedUrlRequest,
  SignedUrlResponse,
  signedUrlResponseSchema,
} from "../schema";
import { apiPost } from "@/services/api";
import { useAuthContext } from "@/providers/auth-context";
import humps from "humps";
import { useMutation } from "@tanstack/react-query";
import { allowedFileTypes, maxFileSize } from "../utils";

export function useFileUpload() {
  const baseUrl = `${API_URL}/api/v1/files/signed-upload-url`;
  const { token } = useAuthContext();

  const getSignedUrl = async ({
    signedUrlRequest,
  }: {
    signedUrlRequest: SignedUrlRequest;
    onSuccess?: (data: SignedUrlResponse) => void;
    onError?: () => void;
  }) => {
    return await apiPost<SignedUrlResponse>(
      baseUrl,
      signedUrlResponseSchema,
      humps.decamelizeKeys(signedUrlRequest),
      token ?? undefined
    );
  };

  const signedUrlMutation = useMutation({
    mutationFn: getSignedUrl,
    onSuccess: (response, variables) => {
      const { onSuccess } = variables;
      if (response && response.data) {
        onSuccess?.(response.data);
      }
    },
    onError: (_, variables) => {
      const { onError } = variables;
      onError?.();
    },
  });

  const uploadToCloudinary = async (
    file: File,
    signedUrlData: SignedUrlResponse
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signedUrlData.apiKey);
      formData.append("timestamp", signedUrlData.timestamp.toString());
      formData.append("signature", signedUrlData.signature);
      formData.append("folder", signedUrlData.folder);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signedUrlData.cloudName}/${signedUrlData.resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Cloudinary upload error:", errorData);
        throw new Error(
          errorData.error?.message || "Failed to upload file to Cloudinary"
        );
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!file) {
      return { valid: false, error: "No file selected" };
    }

    if (!allowedFileTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedFileTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`,
      };
    }

    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds limit of ${Math.round(
          maxFileSize / (1024 * 1024)
        )}MB`,
      };
    }

    return { valid: true };
  };

  return {
    getSignedUrl: signedUrlMutation.mutate,
    uploadToCloudinary,
    validateFile,
    isLoading: signedUrlMutation.isPending,
    error: signedUrlMutation.error,
  };
}
