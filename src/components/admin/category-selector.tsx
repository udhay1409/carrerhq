"use client";

import { useState, useMemo } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Plus, Check } from "lucide-react";
import type { BlogCategory } from "@/types/blog";
import { blogApi } from "@/lib/data";

interface CategorySelectorProps {
  categories: BlogCategory[];
  value: string;
  onChange: (categoryId: string) => void;
  onCategoriesUpdate: (categories: BlogCategory[]) => void;
  isRequired?: boolean;
  error?: string;
}

export default function CategorySelector({
  categories,
  value,
  onChange,
  onCategoriesUpdate,
  isRequired = false,
  error,
}: CategorySelectorProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Memoize filtered categories to prevent re-renders
  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.id !== "all"),
    [categories]
  );

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCreateError("Category name is required");
      return;
    }

    // Check if category already exists
    if (
      filteredCategories.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
      )
    ) {
      setCreateError("A category with this name already exists");
      return;
    }

    setIsCreating(true);
    setCreateError("");

    try {
      const newCategory = await blogApi.createCategory(newCategoryName.trim());

      // Update the categories list
      const updatedCategories = [...categories, newCategory];
      onCategoriesUpdate(updatedCategories);

      // Select the new category (use name instead of id)
      onChange(newCategory.name);

      // Close modal and reset form
      onClose();
      setNewCategoryName("");
    } catch (error) {
      console.error("Error creating category:", error);
      setCreateError("Failed to create category. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleModalClose = () => {
    onClose();
    setNewCategoryName("");
    setCreateError("");
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <Select
              label="Category"
              placeholder="Select a category"
              selectedKeys={value ? [value] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                onChange(selectedKey || "");
              }}
              isInvalid={!!error}
              errorMessage={error}
              isRequired={isRequired}
            >
              {filteredCategories.map((category) => (
                <SelectItem key={category.name}>{category.name}</SelectItem>
              ))}
            </Select>
          </div>
          <Button
            isIconOnly
            variant="flat"
            color="primary"
            onPress={onOpen}
            className="mt-6"
            title="Add new category"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleModalClose} placement="center">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">Create New Category</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Category Name"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  setCreateError("");
                }}
                isInvalid={!!createError}
                errorMessage={createError}
                isRequired
                autoFocus
              />
              <p className="text-sm text-default-500">
                This category will be available for all blog posts.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={handleModalClose}
              isDisabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateCategory}
              isLoading={isCreating}
              startContent={!isCreating ? <Check size={16} /> : undefined}
            >
              Create Category
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
