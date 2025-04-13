import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8443'

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
