import { notFound } from "next/navigation";
import { getBlogPostById } from "@/lib/data";
import EditBlogPostClient from "./edit-blog-post-client";

interface EditBlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  const { id } = await params;

  // Fetch the blog post data
  const blogPost = await getBlogPostById(id);

  console.log("EditBlogPostPage - fetched blogPost:", blogPost);
  console.log("EditBlogPostPage - blogPost.content:", blogPost?.content);

  // If blog post doesn't exist, show 404
  if (!blogPost) {
    notFound();
  }

  return <EditBlogPostClient blogPost={blogPost} />;
}

// Generate metadata for the page
export async function generateMetadata({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const blogPost = await getBlogPostById(id);

  if (!blogPost) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: `Edit: ${blogPost.title} | Admin`,
    description: `Edit blog post: ${blogPost.excerpt}`,
  };
}
