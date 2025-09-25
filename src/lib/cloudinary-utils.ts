/**
 * Utility functions for working with Cloudinary images
 */

/**
 * Generate a Cloudinary URL from a public ID
 * @param publicId - The Cloudinary public ID
 * @param transformations - Optional transformations to apply
 * @returns The full Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.warn("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
    return "";
  }

  let transformationString = "";

  if (transformations) {
    const params = [];
    if (transformations.width) params.push(`w_${transformations.width}`);
    if (transformations.height) params.push(`h_${transformations.height}`);
    if (transformations.crop) params.push(`c_${transformations.crop}`);
    if (transformations.quality) params.push(`q_${transformations.quality}`);
    if (transformations.format) params.push(`f_${transformations.format}`);

    if (params.length > 0) {
      transformationString = `/${params.join(",")}`;
    }
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload${transformationString}/${publicId}`;
}

/**
 * Generate optimized image URLs for different use cases
 */
export const cloudinaryPresets = {
  thumbnail: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 300,
      height: 200,
      crop: "fill",
      quality: "auto",
      format: "auto",
    }),

  card: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 600,
      height: 400,
      crop: "fill",
      quality: "auto",
      format: "auto",
    }),

  hero: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      width: 1200,
      height: 800,
      crop: "fill",
      quality: "auto",
      format: "auto",
    }),

  original: (publicId: string) =>
    getCloudinaryUrl(publicId, {
      quality: "auto",
      format: "auto",
    }),
};

/**
 * Check if a string is a valid Cloudinary public ID
 * @param imageId - The image ID to check
 * @returns True if it looks like a Cloudinary public ID
 */
export function isCloudinaryPublicId(imageId: string): boolean {
  // Cloudinary public IDs typically contain folder paths and don't start with http
  return !imageId.startsWith("http") && imageId.length > 0;
}

/**
 * Get the appropriate image URL, handling both Cloudinary public IDs and direct URLs
 * @param imageId - Either a Cloudinary public ID or a direct URL
 * @param preset - The preset to use for Cloudinary images
 * @returns The image URL
 */
export function getImageUrl(
  imageId: string,
  preset: keyof typeof cloudinaryPresets = "card"
): string {
  if (!imageId) return "";

  // If it's already a URL, return as-is
  if (imageId.startsWith("http")) {
    return imageId;
  }

  // If it's a Cloudinary public ID, generate the URL
  if (isCloudinaryPublicId(imageId)) {
    return cloudinaryPresets[preset](imageId);
  }

  // Fallback
  return imageId;
}
