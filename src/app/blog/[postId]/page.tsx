import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllBlogPosts,
  getBlogPostById,
  getRelatedBlogPosts,
} from "../../../lib/data";
import { BlogPostClient } from "./blog-post-client";

interface BlogPostPageProps {
  params: Promise<{
    postId: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();

  return posts.map((post) => ({
    postId: post.id,
  }));
}

// Generate dynamic metadata for each blog post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await getBlogPostById(postId);

  if (!post) {
    return {
      title: "Blog Post Not Found | CareerHQ",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | CareerHQ Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imageId],
      type: "article",
      authors: [post.author],
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.imageId],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { postId } = await params;
  const [post, relatedPosts] = await Promise.all([
    getBlogPostById(postId),
    getRelatedBlogPosts(postId, 3),
  ]);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
