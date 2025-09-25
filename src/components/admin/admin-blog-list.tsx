"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@heroui/card";
import { Search, Edit, Trash2 } from "lucide-react";
import { addToast } from "@heroui/toast";
import { BlogPost, BlogCategory } from "@/types/blog";
import {
  getAllBlogPostsForAdmin,
  getBlogCategories,
  blogApi,
} from "@/lib/data";
import { useRouter } from "next/navigation";
import ConfirmationModal from "./confirmation-modal";

interface AdminBlogListProps {
  initialPosts?: BlogPost[];
  initialCategories?: BlogCategory[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SortDescriptor {
  column: string;
  direction: "ascending" | "descending";
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function AdminBlogList({
  initialPosts = [],
  initialCategories = [],
}: AdminBlogListProps) {
  const router = useRouter();

  // State management
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [categories, setCategories] =
    useState<BlogCategory[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [publishedFilter, setPublishedFilter] = useState<string>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    post: BlogPost | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    post: null,
    isLoading: false,
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: initialPosts.length,
    pages: Math.ceil(initialPosts.length / 10),
  });

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getBlogCategories();
      setCategories([
        { id: "all", name: "All Categories" },
        ...fetchedCategories,
      ]);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const options = {
        search: debouncedSearchTerm || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        page: pagination.page,
        limit: pagination.limit,
      };

      let fetchedPosts = await getAllBlogPostsForAdmin(options);

      // Filter by published status
      if (publishedFilter !== "all") {
        const isPublished = publishedFilter === "published";
        fetchedPosts = fetchedPosts.filter(
          (post) => (post.published || false) === isPublished
        );
      }

      setPosts(fetchedPosts);

      // Update pagination info (in a real app, this would come from the API)
      setPagination((prev) => ({
        ...prev,
        total: fetchedPosts.length,
        pages: Math.ceil(fetchedPosts.length / prev.limit),
      }));
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearchTerm,
    selectedCategory,
    publishedFilter,
    pagination.page,
    pagination.limit,
  ]);

  // Load categories on mount if not provided
  useEffect(() => {
    if (initialCategories.length === 0) {
      loadCategories();
    }
  }, [initialCategories.length]);

  // Load posts when filters change
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    if (!sortDescriptor.column) return posts;

    return [...posts].sort((a, b) => {
      let aValue: string | number | Date = a[
        sortDescriptor.column as keyof BlogPost
      ] as string | number | Date;
      let bValue: string | number | Date = b[
        sortDescriptor.column as keyof BlogPost
      ] as string | number | Date;

      // Handle date sorting
      if (sortDescriptor.column === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDescriptor.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDescriptor.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [posts, sortDescriptor]);

  // Handle published status toggle
  const handlePublishedToggle = async (
    postId: string,
    currentStatus: boolean
  ) => {
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, published: !currentStatus } : post
        )
      );

      // API call
      await blogApi.updatePost(postId, { published: !currentStatus });
    } catch (error) {
      console.error("Error updating post status:", error);

      // Revert optimistic update on error
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, published: currentStatus } : post
        )
      );
    }
  };

  // Handle delete post
  const handleDeletePost = (post: BlogPost) => {
    setDeleteModal({
      isOpen: true,
      post,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.post) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));

    try {
      await blogApi.deletePost(deleteModal.post.id);
      setPosts((prev) =>
        prev.filter((post) => post.id !== deleteModal.post?.id)
      );

      // Close modal and reset state
      setDeleteModal({
        isOpen: false,
        post: null,
        isLoading: false,
      });

      addToast({
        title: "Blog post deleted successfully!",
        color: "success",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
      addToast({
        title: "Failed to delete blog post. Please try again.",
        color: "danger",
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      post: null,
      isLoading: false,
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Handle page size change
  const handlePageSizeChange = (limit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit,
      page: 1,
      pages: Math.ceil(prev.total / limit),
    }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Table columns configuration
  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "author", label: "Author", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "published", label: "Status", sortable: false },
    { key: "actions", label: "Actions", sortable: false },
  ];

  // Loading skeleton
  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardBody>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            placeholder="Search posts by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="w-4 h-4 text-gray-400" />}
            className="sm:max-w-xs"
          />

          <Select
            placeholder="Filter by category"
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setSelectedCategory(selected || "all");
            }}
            className="sm:max-w-xs"
          >
            {categories.map((category) => (
              <SelectItem key={category.id}>{category.name}</SelectItem>
            ))}
          </Select>

          <Select
            placeholder="Filter by status"
            selectedKeys={publishedFilter ? [publishedFilter] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setPublishedFilter(selected || "all");
            }}
            className="sm:max-w-xs"
          >
            <SelectItem key="all">All Posts</SelectItem>
            <SelectItem key="published">Published</SelectItem>
            <SelectItem key="draft">Drafts</SelectItem>
          </Select>

          <Select
            placeholder="Items per page"
            selectedKeys={[pagination.limit.toString()]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              handlePageSizeChange(parseInt(selected));
            }}
            className="sm:max-w-xs"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((size) => (
              <SelectItem key={size.toString()}>{size} per page</SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Blog posts table"
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) =>
          setSortDescriptor(descriptor as SortDescriptor)
        }
        classNames={{
          wrapper: "min-h-[400px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              allowsSorting={column.sortable}
              className={column.key === "actions" ? "text-center" : ""}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={sortedPosts}
          isLoading={loading}
          loadingContent={<Skeleton className="w-full h-8" />}
          emptyContent={
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "No posts found matching your criteria"
                  : "No blog posts yet"}
              </p>
              <Button
                color="primary"
                variant="flat"
                onPress={() => router.push("/admin/blog/new")}
              >
                Create your first post
              </Button>
            </div>
          }
        >
          {(post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="max-w-xs">
                  <p className="font-medium truncate">{post.title}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {post.excerpt}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.authorRole}</p>
                </div>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat">
                  {post.category}
                </Chip>
              </TableCell>
              <TableCell>{formatDate(post.date)}</TableCell>
              <TableCell>
                <Switch
                  isSelected={post.published || false}
                  onValueChange={() =>
                    handlePublishedToggle(post.id, post.published || false)
                  }
                  size="sm"
                  color="success"
                >
                  {post.published ? "Published" : "Draft"}
                </Switch>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-center">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => router.push(`/admin/blog/${post.id}/edit`)}
                    aria-label={`Edit post "${post.title}"`}
                    title={`Edit post "${post.title}"`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => handleDeletePost(post)}
                    aria-label={`Delete post "${post.title}"`}
                    title={`Delete post "${post.title}"`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            showControls
            showShadow
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteModal.post?.title}"? This action cannot be undone.`}
        confirmText="Delete Post"
        cancelText="Cancel"
        confirmColor="danger"
        isLoading={deleteModal.isLoading}
      >
        {deleteModal.post && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              <strong>Author:</strong> {deleteModal.post.author}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Category:</strong> {deleteModal.post.category}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong>{" "}
              <span
                className={
                  deleteModal.post.published
                    ? "text-green-600"
                    : "text-orange-600"
                }
              >
                {deleteModal.post.published ? "Published" : "Draft"}
              </span>
            </p>
          </div>
        )}
      </ConfirmationModal>
    </div>
  );
}
