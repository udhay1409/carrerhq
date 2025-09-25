"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageId: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  excerpt,
  imageId,
  date,
  author,
  category,
  readTime,
}) => {
  // Helper function to get proper image URL
  const getImageUrl = (imageId: string) => {
    if (!imageId) return "/images/blog-placeholder.svg";
    if (imageId.startsWith("http") || imageId.startsWith("/")) {
      return imageId;
    }
    // Use Cloudinary URL for blog images
    return `https://res.cloudinary.com/${
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dn4qntb9r"
    }/image/upload/${imageId}`;
  };

  const imageUrl = getImageUrl(imageId);

  return (
    <Card isPressable className="border border-default-200">
      <Link href={`/blog/${id}`}>
        <CardHeader className="p-0">
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardBody className="p-4">
          <Chip color="primary" variant="flat" size="sm" className="mb-2">
            {category}
          </Chip>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
          <p className="text-foreground-600 mb-4 line-clamp-2">{excerpt}</p>
          <div className="flex items-center justify-between text-sm text-foreground-500">
            <span>{author}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Icon icon="lucide:calendar" width={14} height={14} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="lucide:clock" width={14} height={14} />
                <span>{readTime}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
};
