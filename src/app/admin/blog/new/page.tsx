import { Metadata } from "next";
import NewBlogPostClient from "./new-blog-post-client";

export const metadata: Metadata = {
  title: "Create New Blog Post - Admin",
  description: "Create a new blog post with rich content editor",
};

export default function NewBlogPostPage() {
  return <NewBlogPostClient />;
}
