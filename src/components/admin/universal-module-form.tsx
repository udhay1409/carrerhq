"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Switch } from "@heroui/switch";
import { Trash2, Plus, X } from "lucide-react";
import CategorySelector from "./category-selector";
import ImageUpload from "./image-upload";
import type {
  UniversalModule,
  ModuleType,
  ModuleCategory,
} from "@/types/universal-module";
import { MODULE_CUSTOM_FIELDS } from "@/types/universal-module";

interface UniversalModuleFormProps {
  moduleType: ModuleType;
  initialData?: UniversalModule;
  categories: ModuleCategory[];
  onSubmit: (data: unknown) => Promise<void>;
  onCancel: () => void;
  onCategoriesUpdate: (categories: ModuleCategory[]) => void;
}

export default function UniversalModuleForm({
  moduleType,
  initialData,
  categories,
  onSubmit,
  onCancel,
  onCategoriesUpdate,
}: UniversalModuleFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    detailedDescription: initialData?.detailedDescription || "",
    category: initialData?.category || "",
    customFields: initialData?.customFields || [],
    highlights: initialData?.highlights || [],
    coverImage: initialData?.coverImage || "",
    galleryImages: initialData?.galleryImages || [],
    published: initialData?.published || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newHighlight, setNewHighlight] = useState("");
  const [newCustomFieldKey, setNewCustomFieldKey] = useState("");
  const [newCustomFieldValue, setNewCustomFieldValue] = useState("");

  // File states for country-style upload
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);

  const customFieldTemplates = MODULE_CUSTOM_FIELDS[moduleType] || [];

  // Initialize custom fields with template if empty (only on first load)
  useEffect(() => {
    if (
      !initialData &&
      formData.customFields.length === 0 &&
      customFieldTemplates.length > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        customFields: customFieldTemplates.map((key) => ({ key, value: "" })),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formData.detailedDescription.trim())
      newErrors.detailedDescription = "Detailed description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.coverImage && !coverImageFile)
      newErrors.coverImage = "Cover image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Prepare data to submit
      const submitData = {
        ...formData,
        moduleType,
        customFields: formData.customFields.filter((f) => f.value.trim()),
      };

      // If there are files, send as FormData (country pattern)
      if (coverImageFile || galleryImageFiles.length > 0) {
        const formDataToSend = new FormData();

        // Add JSON data
        formDataToSend.append("data", JSON.stringify(submitData));

        // Add cover image file if present
        if (coverImageFile) {
          formDataToSend.append("coverImageFile", coverImageFile);
        }

        // Add gallery image files if present
        galleryImageFiles.forEach((file) => {
          formDataToSend.append("galleryImageFiles", file);
        });

        await onSubmit(formDataToSend);
      } else {
        // Otherwise send as JSON
        await onSubmit(submitData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const updateCustomField = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.map((f, i) =>
        i === index ? { ...f, [field]: newValue } : f
      ),
    }));
  };

  const addCustomField = () => {
    if (newCustomFieldKey.trim() && newCustomFieldValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        customFields: [
          ...prev.customFields,
          { key: newCustomFieldKey.trim(), value: newCustomFieldValue.trim() },
        ],
      }));
      setNewCustomFieldKey("");
      setNewCustomFieldValue("");
    }
  };

  const removeCustomField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Standard Fields */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          <Input
            label="Title (H1)"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            isInvalid={!!errors.title}
            errorMessage={errors.title}
            isRequired
          />

          <Textarea
            label="Short Description"
            placeholder="Brief overview (1-2 sentences)"
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shortDescription: e.target.value,
              }))
            }
            isInvalid={!!errors.shortDescription}
            errorMessage={errors.shortDescription}
            minRows={2}
            isRequired
          />

          <Textarea
            label="Detailed Description"
            placeholder="Complete description with all details"
            value={formData.detailedDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                detailedDescription: e.target.value,
              }))
            }
            isInvalid={!!errors.detailedDescription}
            errorMessage={errors.detailedDescription}
            minRows={5}
            isRequired
          />

          <CategorySelector
            categories={categories}
            value={formData.category}
            onChange={(category) =>
              setFormData((prev) => ({ ...prev, category }))
            }
            onCategoriesUpdate={(cats) =>
              onCategoriesUpdate(cats as ModuleCategory[])
            }
            moduleType={moduleType}
            isRequired
            error={errors.category}
          />
        </CardBody>
      </Card>

      {/* Custom Fields */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Details </h3>
          <p className="text-sm text-default-500 mt-1">
            Add custom fields like Interest Rate, Location, Duration, etc.
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          {/* Add New Custom Field */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Field Name"
                placeholder="e.g., Interest Rate, Location"
                value={newCustomFieldKey}
                onChange={(e) => setNewCustomFieldKey(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCustomField())
                }
              />
              <Input
                label="Field Value"
                placeholder="e.g., 5%, Mumbai"
                value={newCustomFieldValue}
                onChange={(e) => setNewCustomFieldValue(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCustomField())
                }
              />
            </div>
            <Button
              color="primary"
              variant="flat"
              onPress={addCustomField}
              startContent={<Plus size={16} />}
              size="sm"
            >
              Add Custom Field
            </Button>
          </div>

          {/* Existing Custom Fields */}
          {formData.customFields.length > 0 && (
            <>
              <Divider />
              <div className="space-y-3">
                {formData.customFields.map((field, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      label="Field Name"
                      value={field.key}
                      onChange={(e) =>
                        updateCustomField(index, "key", e.target.value)
                      }
                      size="sm"
                    />
                    <Input
                      label="Field Value"
                      value={field.value}
                      onChange={(e) =>
                        updateCustomField(index, "value", e.target.value)
                      }
                      size="sm"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => removeCustomField(index)}
                      className="mt-6"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Suggested Fields */}
          {customFieldTemplates.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-default-500 mb-2">
                Suggested fields for {moduleType}:
              </p>
              <div className="flex flex-wrap gap-2">
                {customFieldTemplates.map((template) => (
                  <Button
                    key={template}
                    size="sm"
                    variant="bordered"
                    onPress={() => {
                      setNewCustomFieldKey(template);
                    }}
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Highlights / Key Features</h3>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a highlight (e.g., 100% Placement)"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addHighlight())
              }
            />
            <Button
              color="primary"
              variant="flat"
              onPress={addHighlight}
              startContent={<Plus size={16} />}
            >
              Add
            </Button>
          </div>

          {formData.highlights.length > 0 && (
            <div className="space-y-2">
              {formData.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-default-100 rounded-lg"
                >
                  <span className="text-sm">• {highlight}</span>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => removeHighlight(index)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Media</h3>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-6">
          {/* Cover Image */}
          <ImageUpload
            label="Cover / Banner Image"
            value={formData.coverImage}
            onChange={(imageId) =>
              setFormData((prev) => ({ ...prev, coverImage: imageId }))
            }
            onFileChange={(file) => {
              setCoverImageFile(file);
            }}
            error={errors.coverImage}
            description="Upload cover image (Image will be uploaded when you save the module)"
            folder={`modules/${moduleType}`}
          />

          {/* Gallery Images */}
          <div>
            <div className="mb-3">
              <h4 className="text-sm font-medium text-default-700 mb-1">
                Gallery / Multiple Images
              </h4>
              <p className="text-xs text-default-500">
                Upload multiple images for the gallery (optional)
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setGalleryImageFiles((prev) => [...prev, ...files]);
                }}
                className="block w-full text-sm text-default-600
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary-600
                  cursor-pointer"
              />
              <p className="text-xs text-default-500">
                Select multiple images to upload (Images will be uploaded when
                you save the module)
              </p>
            </div>

            {/* Preview selected files */}
            {galleryImageFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-default-700 mb-2">
                  Selected Files ({galleryImageFiles.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {galleryImageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-32">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onPress={() => {
                          setGalleryImageFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <X size={14} />
                      </Button>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show existing gallery images (for edit mode) */}
            {formData.galleryImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-default-700 mb-2">
                  Existing Gallery Images ({formData.galleryImages.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.galleryImages.map((imageId, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-32">
                        <Image
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_300,h_300,c_fill/${imageId}`}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          sizes="300px"
                        />
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onPress={() => removeGalleryImage(index)}
                      >
                        <X size={14} />
                      </Button>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Publish Status */}
      <Card>
        <CardBody>
          <Switch
            isSelected={formData.published}
            onValueChange={(checked) =>
              setFormData((prev) => ({ ...prev, published: checked }))
            }
          >
            Publish this module
          </Switch>
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="flat" onPress={onCancel} isDisabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" color="primary" isLoading={isSubmitting}>
          {initialData ? "Update" : "Create"} Module
        </Button>
      </div>
    </form>
  );
}
