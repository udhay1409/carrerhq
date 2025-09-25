"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import type {
  BlogPost,
  BlogCategory,
  CreateBlogPostData,
  BlogContent,
} from "@/types/blog";
import { getBlogCategories, blogApi } from "@/lib/data";
import ContentEditor from "./content-editor";
import ImageUpload from "./image-upload";
import CategorySelector from "./category-selector";
import { addToast } from "@heroui/toast";

interface SimpleBlogFormProps {
  mode: "create" | "edit";
  initialData?: BlogPost;
  onSubmit: (data: CreateBlogPostData) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  title: string;
  excerpt: string;
  content: BlogContent[];
  imageId: string;
  author: string;
  authorRole: string;
  category: string;
  published: boolean;
}

const initialFormData: FormData = {
  title: "",
  excerpt: "",
  content: [],
  imageId: "",
  author: "HeroUI Education Team",
  authorRole: "Education Consultant",
  category: "",
  published: false,
};

export default function SimpleBlogForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: SimpleBlogFormProps) {
  const router = useRouter();
  // Remove the useToast hook since we're using HeroUI toast
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await getBlogCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title,
        excerpt: initialData.excerpt,
        content: initialData.content || [],
        imageId: initialData.imageId,
        author: initialData.author,
        authorRole: initialData.authorRole,
        category: initialData.category,
        published: initialData.published || false,
      });
    }
  }, [mode, initialData]);

  // Handle input changes
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | BlogContent[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";
    if (!formData.imageId.trim())
      newErrors.imageId = "Featured image is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.author.trim()) newErrors.author = "Author name is required";
    if (!formData.authorRole.trim())
      newErrors.authorRole = "Author role is required";
    if (!formData.content || formData.content.length === 0) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast({
        title: "Please fix the validation errors before submitting.",
        color: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    console.log("Submitting simple blog data:", formData);
    console.log("Image file:", imageFile);

    try {
      const submitData: CreateBlogPostData = {
        ...formData,
        date:
          mode === "create"
            ? new Date().toISOString().split("T")[0]
            : initialData?.date || new Date().toISOString().split("T")[0],
      };

      if (mode === "create") {
        // For create mode, use the new API with FormData if there's an image file
        if (imageFile) {
          const formDataToSend = new FormData();
          formDataToSend.append("data", JSON.stringify(submitData));
          formDataToSend.append("imageFile", imageFile);

          const response = await fetch("/api/blog", {
            method: "POST",
            body: formDataToSend,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to create blog post");
          }
        } else {
          // Use existing blogApi for backward compatibility
          await blogApi.createPost(submitData);
        }

        addToast({
          title: "Blog post created successfully!",
          color: "success",
        });
        router.push("/admin/blog");
      } else {
        // For edit mode, handle image upload if there's a new file
        if (imageFile && initialData) {
          const formDataToSend = new FormData();
          formDataToSend.append("data", JSON.stringify(submitData));
          formDataToSend.append("imageFile", imageFile);

          const response = await fetch(`/api/blog/${initialData.id}`, {
            method: "PUT",
            body: formDataToSend,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update blog post");
          }
        } else {
          // Use the onSubmit prop for backward compatibility
          await onSubmit(submitData);
        }

        addToast({
          title: "Blog post updated successfully!",
          color: "success",
        });
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      addToast({
        title: "Failed to save blog post. Please try again.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {mode === "create" ? "Create New Blog Post" : "Edit Blog Post"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {mode === "create"
                ? "Fill in the details below to create a new blog post"
                : "Update the blog post details below"}
            </p>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Unsaved changes
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Form Card */}
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-default-700">
                Basic Information
              </h2>

              <Input
                label="Title"
                placeholder="Enter blog post title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                isInvalid={!!errors.title}
                errorMessage={errors.title}
                isRequired
                maxLength={200}
                description={`${formData.title.length}/200 characters`}
              />

              <Textarea
                label="Excerpt"
                placeholder="Enter a brief excerpt or summary of the blog post"
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
                isInvalid={!!errors.excerpt}
                errorMessage={errors.excerpt}
                isRequired
                maxLength={500}
                minRows={3}
                description={`${formData.excerpt.length}/500 characters`}
              />

              <ImageUpload
                label="Featured Image"
                value={formData.imageId}
                onChange={(imageId) => handleInputChange("imageId", imageId)}
                onFileChange={(file) => {
                  setImageFile(file);
                }}
                error={errors.imageId}
                isRequired
                description="Upload or select a featured image for your blog post (Image will be uploaded when you save the post)"
              />

              <CategorySelector
                categories={categories}
                value={formData.category}
                onChange={(categoryId) =>
                  handleInputChange("category", categoryId)
                }
                onCategoriesUpdate={setCategories}
                error={errors.category}
                isRequired
              />
            </div>

            <Divider />

            {/* Content Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-default-700">
                Content
              </h2>
              <ContentEditor
                key={mode === "edit" ? `edit-${initialData?.id}` : "create"}
                content={formData.content}
                onChange={(content) => handleInputChange("content", content)}
              />
              {errors.content && (
                <p className="text-sm text-danger">{errors.content}</p>
              )}
            </div>

            <Divider />

            {/* Author Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-default-700">
                Author Information
              </h2>

              <Input
                label="Author Name"
                placeholder="Enter author's full name"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                isInvalid={!!errors.author}
                errorMessage={errors.author}
                isRequired
              />

              <Input
                label="Author Role"
                placeholder="e.g., Content Writer, Education Consultant"
                value={formData.authorRole}
                onChange={(e) =>
                  handleInputChange("authorRole", e.target.value)
                }
                isInvalid={!!errors.authorRole}
                errorMessage={errors.authorRole}
                isRequired
              />
            </div>

            <Divider />

            {/* Publishing Options Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-default-700">
                Publishing Options
              </h2>

              <Switch
                isSelected={formData.published}
                onValueChange={(checked) =>
                  handleInputChange("published", checked)
                }
                size="lg"
              >
                <div className="flex flex-col">
                  <span className="text-medium">Publish immediately</span>
                  <span className="text-small text-default-400">
                    {formData.published
                      ? "This post will be visible to readers"
                      : "This post will be saved as a draft"}
                  </span>
                </div>
              </Switch>
            </div>

            <Divider />

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="flat"
                onPress={onCancel}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" color="primary" isLoading={isSubmitting}>
                {isSubmitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Post"
                  : "Update Post"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
