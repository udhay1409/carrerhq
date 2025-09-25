"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog-card";
import { BlogLoading } from "@/components/blog-loading";
import { BlogPost, BlogCategory } from "@/types/blog";
import { getAllBlogPosts } from "@/lib/data";

interface BlogListingClientProps {
  initialPosts: BlogPost[];
  categories: BlogCategory[];
}

export const BlogListingClient: React.FC<BlogListingClientProps> = ({
  initialPosts,
  categories,
}) => {
  const [selected, setSelected] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [posts, setPosts] = React.useState(initialPosts);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);

  const handleFilterChange = React.useCallback(async () => {
    setLoading(true);
    setPage(1);

    try {
      const filteredPosts = await getAllBlogPosts({
        category: selected !== "all" ? selected : undefined,
        search: searchQuery.trim() || undefined,
        limit: 9,
        page: 1,
      });

      setPosts(filteredPosts);
      setHasMore(filteredPosts.length === 9);
    } catch (error) {
      console.error("Error filtering posts:", error);
    } finally {
      setLoading(false);
    }
  }, [selected, searchQuery]);

  // Debounced search effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selected, searchQuery, handleFilterChange]);

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const morePosts = await getAllBlogPosts({
        category: selected !== "all" ? selected : undefined,
        search: searchQuery.trim() || undefined,
        limit: 9,
        page: nextPage,
      });

      if (morePosts.length > 0) {
        setPosts((prev) => [...prev, ...morePosts]);
        setPage(nextPage);
        setHasMore(morePosts.length === 9);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelected("all");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-16 md:py-24">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Our <span className="text-gradient-primary">Blog</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-foreground-600 mb-8"
            >
              Insights, guides, and resources for your international education
              journey
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={
                  <Icon icon="lucide:search" className="text-default-400" />
                }
                isClearable
                onClear={() => setSearchQuery("")}
                size="lg"
                className="w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-10 overflow-x-auto">
            <Tabs
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(key as string)}
              variant="light"
              color="primary"
              radius="full"
              classNames={{
                base: "justify-start",
                tabList: "w-full sm:w-auto",
              }}
            >
              {categories.map((category) => (
                <Tab key={category.id} title={category.name} />
              ))}
            </Tabs>
          </div>

          {loading && posts.length === 0 ? (
            <BlogLoading count={6} />
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    imageId={post.imageId}
                    date={post.date}
                    author={post.author}
                    category={post.category}
                    readTime={post.readTime || "5 min read"}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <Button
                    color="primary"
                    variant="flat"
                    size="lg"
                    isLoading={loading}
                    onPress={loadMorePosts}
                    endContent={!loading && <Icon icon="lucide:arrow-down" />}
                  >
                    {loading ? "Loading..." : "Load More Articles"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Icon
                icon="lucide:search-x"
                className="text-foreground-400 text-5xl mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-foreground-500 mb-6">
                We couldn&apos;t find any articles matching your search
                criteria.
              </p>
              <Button color="primary" variant="flat" onPress={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-3">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-foreground-500 mb-8">
              Stay updated with the latest articles, resources, and study abroad
              opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                type="email"
                size="lg"
                className="flex-grow"
              />
              <Button color="primary" size="lg" className="sm:flex-shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
