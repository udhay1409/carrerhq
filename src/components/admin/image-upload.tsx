"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { getImageUrl, isCloudinaryPublicId } from "@/lib/cloudinary-utils";

interface ImageUploadProps {
  value?: string;
  onChange: (imageId: string) => void;
  onFileChange?: (file: File | null) => void; // New prop for file handling
  label?: string;
  description?: string;
  isRequired?: boolean;
  error?: string;
  folder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onFileChange,
  label = "Image",
  description,
  isRequired = false,
  error,
  folder = "blog-images",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [_selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedFile(file);

    // If onFileChange is provided, use deferred upload (for countries/universities)
    if (onFileChange) {
      onFileChange(file);
      // Set a temporary ID to indicate a file is selected
      onChange(`temp-${Date.now()}`);
      return;
    }

    // Otherwise, upload immediately (for blog posts)
    setIsUploading(true);

    try {
      // Upload to Cloudinary via API
      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = `/api/upload?folder=${encodeURIComponent(folder)}`;
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      // Debug: Log the upload result
      console.log("Upload API response:", result);
      console.log("Public ID:", result.data?.publicId);

      // Use Cloudinary public_id as the imageId
      if (result.data?.publicId) {
        onChange(result.data.publicId);
      } else {
        console.error("No publicId in response:", result);
        throw new Error("No publicId returned from upload");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // Clear preview on error
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setPreviewUrl(null);
    setSelectedFile(null);
    if (onFileChange) {
      onFileChange(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-default-700">
          {label}
          {isRequired && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <Card
        className={`border-2 border-dashed ${
          error ? "border-danger" : "border-default-200"
        } hover:border-default-300 transition-colors`}
      >
        <CardBody className="p-4">
          {value || previewUrl ? (
            <div className="space-y-3">
              <div className="relative">
                {previewUrl ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : value && isCloudinaryPublicId(value) ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(value, "card")}
                      alt="Uploaded image"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-default-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon
                        size={48}
                        className="text-default-400 mx-auto mb-2"
                      />
                      <p className="text-sm text-default-500">
                        {value ? `Image ID: ${value}` : "No image selected"}
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="solid"
                  className="absolute top-2 right-2"
                  onPress={handleRemove}
                >
                  <X size={16} />
                </Button>
              </div>
              <Button
                variant="flat"
                startContent={<Upload size={16} />}
                onPress={handleClick}
                isDisabled={isUploading}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon size={48} className="text-default-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-default-700 mb-2">
                Upload an image
              </h3>
              <p className="text-sm text-default-500 mb-4">
                Drag and drop or click to select
              </p>
              <Button
                color="primary"
                variant="flat"
                startContent={<Upload size={16} />}
                onPress={handleClick}
                isLoading={isUploading}
              >
                {isUploading ? "Uploading..." : "Select Image"}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {description && <p className="text-xs text-default-500">{description}</p>}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
