"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import SimpleBlogForm from "@/components/admin/simple-blog-form";
import type { BlogPost, CreateBlogPostData } from "@/types/blog";
import { blogApi } from "@/lib/data";

interface EditBlogPostClientProps {
  blogPost: BlogPost;
}

export default function EditBlogPostClient({
  blogPost,
}: EditBlogPostClientProps) {
  const router = useRouter();

  console.log("EditBlogPostClient - received blogPost:", blogPost);
  console.log("EditBlogPostClient - blogPost.content:", blogPost.content);

  // Handle form submission for updating the blog post
  const handleSubmit = useCallback(
    async (data: CreateBlogPostData) => {
      try {
        await blogApi.updatePost(blogPost.id, data);
        // Navigate back to blog list after successful update
        router.push("/admin/blog");
      } catch (error) {
        // Error handling is done in the AdminBlogForm component
        throw error;
      }
    },
    [blogPost.id, router]
  );

  // Handle cancel action
  const handleCancel = useCallback(() => {
    router.push("/admin/blog");
  }, [router]);

  return (
    <SimpleBlogForm
      mode="edit"
      initialData={blogPost}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
