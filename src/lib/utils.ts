import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to format currency
export function formatCurrency(amount: string): string {
  // Remove any non-numeric characters except decimal points and commas
  const numericAmount = amount.replace(/[^\d.,]/g, "");

  // If the amount contains currency symbols or text, return as is
  if (
    amount.includes("$") ||
    amount.includes("£") ||
    amount.includes("€") ||
    amount.toLowerCase().includes("per")
  ) {
    return amount;
  }

  return numericAmount;
}

// Utility function to create URL-friendly slugs
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Utility function to capitalize first letter
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Utility function to truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
