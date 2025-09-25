import * as React from "react";
import { getAllBlogPosts } from "@/lib/data";
import { HomePageClient } from "./home-page-client";

export default async function HomePage() {
  // Fetch real blog posts from the API
  const blogPosts = await getAllBlogPosts({ limit: 3 });

  return <HomePageClient blogPosts={blogPosts} />;
}
