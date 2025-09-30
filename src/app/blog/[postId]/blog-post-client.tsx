"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Chip } from "@heroui/chip";
// import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Icon } from "@iconify/react";
import { BlogCard } from "@/components/blog-card";
import { BlogPost } from "@/types/blog";

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export const BlogPostClient: React.FC<BlogPostClientProps> = ({
  post,
  relatedPosts,
}) => {
  // Helper function to get proper image URL
  const getImageUrl = (imageId: string, transformation?: string) => {
    if (!imageId) return "/images/blog-placeholder.svg";
    if (imageId.startsWith("http") || imageId.startsWith("/")) {
      return imageId;
    }
    // Use Cloudinary URL for blog images
    return `https://res.cloudinary.com/${
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dn4qntb9r"
    }/image/upload/${transformation ? `${transformation}/` : ""}${imageId}`;
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((error) => console.log("Error copying to clipboard", error));
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-12 md:py-16">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs className="mb-6">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
            <BreadcrumbItem>{post.title}</BreadcrumbItem>
          </Breadcrumbs>

          <div className="max-w-3xl">
            <Chip color="primary" variant="flat" className="mb-4">
              {post.category}
            </Chip>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <Avatar
                src={getImageUrl(
                  post.authorImageId || "/images/default-avatar.svg"
                )}
                className="w-12 h-12"
              />
              <div>
                <p className="font-medium">{post.author}</p>
                <div className="flex items-center gap-4 text-foreground-500 text-sm">
                  <span>{post.authorRole}</span>
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:calendar" width={14} height={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="lucide:clock" width={14} height={14} />
                    <span>{post.readTime || "5 min read"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="max-w-3xl">
                <div className="mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={getImageUrl(post.imageId)}
                    alt={post.title}
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>

                <article className="prose prose-lg max-w-none">
                  {post.content.map((section, index) => {
                    if (section.type === "heading") {
                      return (
                        <h2
                          key={index}
                          className="text-2xl font-semibold mt-8 mb-4"
                        >
                          {section.text}
                        </h2>
                      );
                    } else if (section.type === "paragraph") {
                      return (
                        <p
                          key={index}
                          className="text-foreground-600 mb-4 leading-relaxed"
                        >
                          {section.text}
                        </p>
                      );
                    }
                    return null;
                  })}
                </article>

                <Divider className="my-8" />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={getImageUrl(
                        post.authorImageId || "/images/default-avatar.svg"
                      )}
                      className="w-12 h-12"
                    />
                    <div>
                      <p className="font-medium">{post.author}</p>
                      <p className="text-foreground-500 text-sm">
                        {post.authorRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:share-2" />}
                      onPress={sharePost}
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="border border-default-200 ">
                <CardBody className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Get Expert Guidance
                  </h3>
                  <p className="text-foreground-500 mb-6">
                    Need personalized advice for your study abroad journey? Our
                    education counselors are here to help.
                  </p>
                  <Button
                    as={Link}
                    href="/contact#enquiry"
                    color="primary"
                    fullWidth
                    startContent={<Icon icon="lucide:calendar" />}
                  >
                    Book Free Consultation
                  </Button>
                </CardBody>
              </Card>

              {relatedPosts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-6">
                    {relatedPosts.map((relatedPost) => (
                      <Card
                        key={relatedPost.id}
                        className="border border-default-200"
                      >
                        <CardBody className="p-0">
                          <Link href={`/blog/${relatedPost.id}`}>
                            <div className="flex gap-4 cursor-pointer hover:bg-default-50 transition-colors">
                              <div className="w-24 h-24 flex-shrink-0 relative">
                                <Image
                                  src={getImageUrl(relatedPost.imageId)}
                                  alt={relatedPost.title}
                                  fill
                                  className="object-cover"
                                  sizes="96px"
                                />
                              </div>
                              <div className="py-2 pr-2">
                                <p className="text-xs text-foreground-500 mb-1">
                                  {relatedPost.category}
                                </p>
                                <h4 className="text-sm font-medium line-clamp-2 mb-1">
                                  {relatedPost.title}
                                </h4>
                                <p className="text-xs text-foreground-500">
                                  {relatedPost.readTime || "5 min read"}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Study Abroad",
                    "Scholarships",
                    "Visa",
                    "Application Tips",
                    "Student Life",
                    "Career",
                    "Test Preparation",
                  ].map((category) => (
                    <Chip
                      key={category}
                      as={Link}
                      href={`/blog?category=${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      variant="flat"
                      color="default"
                      className="cursor-pointer"
                    >
                      {category}
                    </Chip>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* More Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-default-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <h2 className="text-3xl font-bold mb-2 md:mb-0">More Articles</h2>
              <Button
                as={Link}
                href="/blog"
                variant="light"
                color="primary"
                endContent={<Icon icon="lucide:arrow-right" />}
              >
                View All Articles
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard
                  key={relatedPost.id}
                  id={relatedPost.id}
                  title={relatedPost.title}
                  excerpt={relatedPost.excerpt}
                  imageId={relatedPost.imageId}
                  date={relatedPost.date}
                  author={relatedPost.author}
                  category={relatedPost.category}
                  readTime={relatedPost.readTime || "5 min read"}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      {/* <section className="py-16 bg-white">
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
      </section> */}
    </>
  );
};
