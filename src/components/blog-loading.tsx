"use client";

import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

interface BlogLoadingProps {
  count?: number;
}

export const BlogLoading: React.FC<BlogLoadingProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="border border-default-200">
          <CardHeader className="p-0">
            <Skeleton className="w-full aspect-video rounded-t-lg" />
          </CardHeader>
          <CardBody className="p-4 space-y-3">
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-full h-6 rounded-lg" />
            <Skeleton className="w-3/4 h-6 rounded-lg" />
            <Skeleton className="w-full h-4 rounded-lg" />
            <Skeleton className="w-2/3 h-4 rounded-lg" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="w-24 h-4 rounded-lg" />
              <div className="flex gap-4">
                <Skeleton className="w-16 h-4 rounded-lg" />
                <Skeleton className="w-20 h-4 rounded-lg" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export const BlogPostLoading: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="w-32 h-6 rounded-full mb-4" />
          <Skeleton className="w-full h-10 rounded-lg mb-4" />
          <Skeleton className="w-3/4 h-10 rounded-lg mb-6" />

          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-32 h-4 rounded-lg" />
              <div className="flex gap-4">
                <Skeleton className="w-24 h-3 rounded-lg" />
                <Skeleton className="w-20 h-3 rounded-lg" />
                <Skeleton className="w-16 h-3 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <Skeleton className="w-full aspect-video rounded-lg mb-8" />

        {/* Content */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              className={`h-4 rounded-lg ${
                index % 3 === 0 ? "w-full" : index % 3 === 1 ? "w-5/6" : "w-4/5"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
