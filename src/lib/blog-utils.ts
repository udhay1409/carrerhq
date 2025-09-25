import type { BlogPost } from "@/types/blog";
import { getImageUrl } from "./cloudinary-utils";

/**
 * Utility functions for working with blog posts
 */

/**
 * Get the featured image URL for a blog post
 * @param post - The blog post
 * @param preset - The image preset to use
 * @returns The image URL
 */
export function getBlogPostImageUrl(
  post: BlogPost,
  preset: "thumbnail" | "card" | "hero" | "original" = "card"
): string {
  return getImageUrl(post.imageId, preset);
}

/**
 * Calculate estimated read time based on content
 * @param content - The blog post content
 * @returns Estimated read time string
 */
export function calculateReadTime(content: BlogPost["content"]): string {
  if (!content || content.length === 0) return "1 min";

  // Count words in all content blocks
  const totalWords = content.reduce((count, block) => {
    const words = block.text.trim().split(/\s+/).length;
    return count + words;
  }, 0);

  // Average reading speed is 200-250 words per minute
  const wordsPerMinute = 225;
  const minutes = Math.ceil(totalWords / wordsPerMinute);

  return `${minutes} min`;
}

/**
 * Generate a slug from a blog post title
 * @param title - The blog post title
 * @returns URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}

/**
 * Format a date string for display
 * @param dateString - The date string
 * @returns Formatted date
 */
export function formatBlogDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
}

/**
 * Get a preview of the blog post content
 * @param content - The blog post content
 * @param maxLength - Maximum length of the preview
 * @returns Preview text
 */
export function getContentPreview(
  content: BlogPost["content"],
  maxLength = 150
): string {
  if (!content || content.length === 0) return "";

  // Combine all text content
  const fullText = content
    .map((block) => block.text)
    .join(" ")
    .trim();

  if (fullText.length <= maxLength) return fullText;

  // Truncate at word boundary
  const truncated = fullText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + "..."
    : truncated + "...";
}
