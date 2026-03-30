import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractUTMSource(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('utm_source') || 'direct'
  } catch {
    return 'direct'
  }
}
