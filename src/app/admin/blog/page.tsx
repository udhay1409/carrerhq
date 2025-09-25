import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import { getAllBlogPostsForAdmin, getBlogCategories } from "@/lib/data";
import AdminBlogList from "@/components/admin/admin-blog-list";

export const metadata: Metadata = {
  title: "Blog Posts - Admin",
  description: "Manage your blog posts - create, edit, and delete content",
};

export default async function AdminBlogPage() {
  // Fetch initial data on the server
  const [initialPosts, initialCategories] = await Promise.all([
    getAllBlogPostsForAdmin({ limit: 10, page: 1 }),
    getBlogCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}

      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blog Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your blog posts and content
          </p>
        </div>
        <Button
          as={Link}
          href="/admin/blog/new"
          color="primary"
          startContent={<Plus size={16} />}
        >
          Create New Post
        </Button>
      </div>

      {/* Blog list component */}
      <AdminBlogList
        initialPosts={initialPosts}
        initialCategories={initialCategories}
      />
    </div>
  );
}
