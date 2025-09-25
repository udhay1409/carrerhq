"use client";

import { useRouter } from "next/navigation";
import SimpleBlogForm from "@/components/admin/simple-blog-form";
import type { CreateBlogPostData } from "@/types/blog";

export default function NewBlogPostClient() {
  const router = useRouter();

  const handleSubmit = async (data: CreateBlogPostData) => {
    // The form will handle the API call internally for create mode
    // This is just a placeholder that won't be called in create mode
    console.log("Form submitted:", data);
  };

  const handleCancel = () => {
    router.push("/admin/blog");
  };

  return (
    <SimpleBlogForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
