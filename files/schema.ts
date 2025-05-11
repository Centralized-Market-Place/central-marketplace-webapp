import { z } from "zod";
import { allowedFileTypes } from "./utils";

const allowedFileTypesArray = allowedFileTypes.map(
  (type) => type.split("/")[1]
);
export const fileTypeSchema = z.enum(
  allowedFileTypesArray as [string, ...string[]]
);

export const signedUrlRequestSchema = z.object({
  fileType: z.string(),
  folder: z.string(),
});

export const signedUrlResponseSchema = z.object({
  signature: z.string(),
  timestamp: z.number(),
  cloudName: z.string(),
  apiKey: z.string(),
  folder: z.string(),
  resourceType: z.string(),
});

export type SignedUrlRequest = z.infer<typeof signedUrlRequestSchema>;
export type SignedUrlResponse = z.infer<typeof signedUrlResponseSchema>;
