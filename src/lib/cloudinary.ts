import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
}

export async function uploadToCloudinary(file: File | Buffer, folder = "blog-images"): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "auto" as const,
      transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }, { fetch_format: "auto" }],
    }

    if (file instanceof File) {
      // Convert File to buffer for upload
      file.arrayBuffer().then((buffer) => {
        cloudinary.uploader
          .upload_stream(uploadOptions, (error, result) => {
            if (error) reject(error)
            else resolve(result as CloudinaryUploadResult)
          })
          .end(Buffer.from(buffer))
      })
    } else {
      // Direct buffer upload
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error)
          else resolve(result as CloudinaryUploadResult)
        })
        .end(file)
    }
  })
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    throw error
  }
}
