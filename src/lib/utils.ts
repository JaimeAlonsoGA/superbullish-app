import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeHex(v?: string | null) {
  if (!v) return "";
  v = v.trim();
  if (!v) return "";
  if (v[0] !== "#") v = `#${v}`;
  return v.toUpperCase().slice(0, 7);
}