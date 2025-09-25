import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export interface ImageUploadResult {
  publicId: string;
  url: string;
}

/**
 * Upload an image file to Cloudinary
 */
export async function uploadImageFile(
  file: File,
  folder: string = "country-images"
): Promise<ImageUploadResult> {
  try {
    const result = await uploadToCloudinary(file, folder);
    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<void> {
  try {
    await deleteFromCloudinary(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw error for deletion failures to avoid blocking the main operation
  }
}

/**
 * Handle image upload for form submission
 * - If there's a new file, upload it and delete the old one
 * - Returns the new public ID or keeps the existing one
 */
export async function handleImageUpload(
  newFile: File | null,
  currentImageId: string | undefined,
  folder: string = "country-images"
): Promise<string | undefined> {
  // If no new file and no current image, return undefined
  if (!newFile && !currentImageId) {
    return undefined;
  }

  // If no new file but there's a current image, keep the current one
  if (!newFile && currentImageId) {
    return currentImageId;
  }

  // If there's a new file, upload it
  if (newFile) {
    const uploadResult = await uploadImageFile(newFile, folder);

    // Delete the old image if it exists and is different from the new one
    if (currentImageId && currentImageId !== uploadResult.publicId) {
      await deleteImageFromCloudinary(currentImageId);
    }

    return uploadResult.publicId;
  }

  return currentImageId;
}
