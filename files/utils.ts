import { createQueryKeyStructure } from "@/lib/query_keys";


export const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
export const maxFileSize = 10 * 1024 * 1024;
export const fileKeys = createQueryKeyStructure("files");
