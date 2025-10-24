"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import {
  Edit,
  Trash2,
  Search,
  Eye,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import type { UniversalModule } from "@/types/universal-module";

interface ModuleListProps {
  modules: UniversalModule[];
  isLoading: boolean;
  onEdit: (module: UniversalModule) => void;
  onDelete: (id: string) => void;
}

export default function ModuleList({
  modules,
  isLoading,
  onEdit,
  onDelete,
}: ModuleListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredModules = modules.filter(
    (module) =>
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <p className="text-default-500 text-sm">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search size={18} className="text-default-400" />}
            classNames={{
              base: "flex-1",
              inputWrapper:
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow",
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-default-500 bg-default-100 px-3 py-2 rounded-full">
            {filteredModules.length} module
            {filteredModules.length !== 1 ? "s" : ""}
          </div>
          <div className="flex bg-default-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "solid" : "light"}
              color={viewMode === "grid" ? "primary" : "default"}
              onPress={() => setViewMode("grid")}
              className="min-w-0 px-3"
            >
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "solid" : "light"}
              color={viewMode === "list" ? "primary" : "default"}
              onPress={() => setViewMode("list")}
              className="min-w-0 px-3"
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredModules.length === 0 ? (
        <Card className="border-dashed border-2 border-default-200">
          <CardBody className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center">
                <Search size={24} className="text-default-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-default-700 mb-2">
                  {searchQuery ? "No modules found" : "No modules yet"}
                </h3>
                <p className="text-default-500 max-w-md">
                  {searchQuery
                    ? "Try adjusting your search terms or filters"
                    : "Create your first module to get started with content management"}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        /* Module Grid/List */
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredModules.map((module) => (
            <Card
              key={module.id}
              className="group hover:shadow-lg transition-all duration-300 border border-default-200 hover:border-primary-200"
            >
              <CardBody className="p-0">
                {viewMode === "grid" ? (
                  /* Grid View */
                  <div className="space-y-4">
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      {module.coverImage ? (
                        <Image
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400,h_300,c_fill/${module.coverImage}`}
                          alt={module.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="400px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <Eye size={32} className="text-primary-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Chip
                          size="sm"
                          color={module.published ? "success" : "warning"}
                          variant="shadow"
                          className="text-xs font-medium"
                        >
                          {module.published ? "Published" : "Draft"}
                        </Chip>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-4 space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Chip
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="text-xs"
                          >
                            {module.category}
                          </Chip>
                          <div className="flex items-center gap-1 text-xs text-default-500">
                            <TrendingUp size={12} />
                            {module.highlights.length}
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg text-default-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-default-600 line-clamp-2">
                          {module.shortDescription}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-default-100">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() => onEdit(module)}
                            startContent={<Edit size={14} />}
                            className="text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            onPress={() => onDelete(module.id)}
                            isIconOnly
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <Button size="sm" variant="light" isIconOnly>
                          <MoreVertical size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div className="flex items-center gap-4 p-4">
                    <Avatar
                      src={
                        module.coverImage
                          ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_80,h_80,c_fill/${module.coverImage}`
                          : undefined
                      }
                      name={module.title}
                      size="lg"
                      className="flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-default-800 truncate">
                          {module.title}
                        </h3>
                        <Chip
                          size="sm"
                          variant="flat"
                          color="primary"
                          className="text-xs"
                        >
                          {module.category}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-600 line-clamp-1">
                        {module.shortDescription}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-default-500">
                        <span className="flex items-center gap-1">
                          <TrendingUp size={12} />
                          {module.highlights.length} highlights
                        </span>
                        <Chip
                          size="sm"
                          color={module.published ? "success" : "warning"}
                          variant="flat"
                          className="text-xs"
                        >
                          {module.published ? "Published" : "Draft"}
                        </Chip>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={() => onEdit(module)}
                        startContent={<Edit size={14} />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => onDelete(module.id)}
                        isIconOnly
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
