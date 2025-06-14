import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8443";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
}

export function formatTimeAgo(dateOrString: string) {
  const now = new Date();


  const date = new Date(dateOrString + "Z")
     

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else if (diffInSeconds < 2592000) {
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  } else {
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  }
}

export function getErrorField<T = string>(
  error: Error,
  field: string
): T | undefined {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Record<string, unknown>;
    return data?.[field] as T | undefined;
  }
  return undefined;
}

