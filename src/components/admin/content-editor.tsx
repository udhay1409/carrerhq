"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Trash2, GripVertical, Type, AlignLeft } from "lucide-react";
import type { BlogContent } from "@/types/blog";

interface ContentEditorProps {
  content: BlogContent[];
  onChange: (content: BlogContent[]) => void;
}

interface ContentBlock extends BlogContent {
  id: string;
}

const CONTENT_TYPES = [
  { key: "heading", label: "Heading", icon: Type },
  { key: "paragraph", label: "Paragraph", icon: AlignLeft },
] as const;

export default function ContentEditor({
  content,
  onChange,
}: ContentEditorProps) {
  // Debug: Log the content being received
  console.log("ContentEditor received content:", content);

  // Convert content to blocks with IDs for easier manipulation
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    const initialBlocks = content.map((item, index) => ({
      ...item,
      id: item.id || `block-${index}-${Date.now()}`,
    }));
    console.log("ContentEditor initial blocks:", initialBlocks);
    return initialBlocks;
  });

  const previousContentRef = useRef<BlogContent[]>([]);

  // Update blocks when content prop changes (important for edit mode)
  useEffect(() => {
    // Only update if content has actually changed from the previous content
    const contentChanged =
      JSON.stringify(previousContentRef.current) !== JSON.stringify(content);

    console.log(
      "ContentEditor useEffect - contentChanged:",
      contentChanged,
      "content:",
      content
    );

    if (contentChanged) {
      const newBlocks = content.map((item, index) => ({
        ...item,
        id: item.id || `block-${index}-${Date.now()}`,
      }));
      console.log("ContentEditor useEffect - setting new blocks:", newBlocks);
      setBlocks(newBlocks);
      previousContentRef.current = content;
    }
  }, [content]);

  // Update parent component when blocks change
  const updateContent = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    const contentWithoutIds = newBlocks.map(({ id: _id, ...block }) => block);
    onChange(contentWithoutIds);
  };

  // Add a new content block
  const addBlock = (type: "heading" | "paragraph") => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      text: "",
    };

    updateContent([...blocks, newBlock]);
  };

  // Remove a content block
  const removeBlock = (blockId: string) => {
    const newBlocks = blocks.filter((block) => block.id !== blockId);
    updateContent(newBlocks);
  };

  // Update block content
  const updateBlock = (
    blockId: string,
    field: keyof Omit<ContentBlock, "id">,
    value: string
  ) => {
    const newBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, [field]: value } : block
    );
    updateContent(newBlocks);
  };

  // Move block up or down
  const moveBlock = (blockId: string, direction: "up" | "down") => {
    const currentIndex = blocks.findIndex((block) => block.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[currentIndex], newBlocks[newIndex]] = [
      newBlocks[newIndex],
      newBlocks[currentIndex],
    ];
    updateContent(newBlocks);
  };

  // Get placeholder text based on content type
  const getPlaceholder = (type: "heading" | "paragraph"): string => {
    switch (type) {
      case "heading":
        return "Enter heading text...";
      case "paragraph":
        return "Enter paragraph content...";
      default:
        return "Enter content...";
    }
  };

  // Get appropriate input component based on content type
  const renderContentInput = (block: ContentBlock) => {
    const commonProps = {
      value: block.text,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => updateBlock(block.id, "text", e.target.value),
      placeholder: getPlaceholder(block.type),
      variant: "bordered" as const,
    };

    switch (block.type) {
      case "heading":
        return (
          <Input
            {...commonProps}
            size="lg"
            classNames={{
              input: "text-lg font-semibold",
            }}
          />
        );
      case "paragraph":
        return <Textarea {...commonProps} minRows={3} maxRows={8} />;
      default:
        return <Textarea {...commonProps} minRows={2} maxRows={6} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-default-700">
          Content Editor
        </h3>
        <div className="flex gap-2">
          {CONTENT_TYPES.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="flat"
              size="sm"
              startContent={<Icon size={16} />}
              onPress={() => addBlock(key)}
            >
              Add {label}
            </Button>
          ))}
        </div>
      </div>

      {blocks.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="text-default-400">
                <AlignLeft size={48} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-default-600 mb-2">
                  No content blocks yet
                </h4>
                <p className="text-default-400 mb-4">
                  Start building your blog post by adding headings and
                  paragraphs
                </p>
                <div className="flex gap-2 justify-center">
                  {CONTENT_TYPES.map(({ key, label, icon: Icon }) => (
                    <Button
                      key={key}
                      variant="flat"
                      color="primary"
                      startContent={<Icon size={16} />}
                      onPress={() => addBlock(key)}
                    >
                      Add {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => {
            const ContentTypeIcon =
              CONTENT_TYPES.find((type) => type.key === block.type)?.icon ||
              AlignLeft;

            return (
              <Card key={block.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <GripVertical
                        size={16}
                        className="text-default-400 cursor-move"
                      />
                      <ContentTypeIcon size={16} className="text-default-500" />
                      <Select
                        size="sm"
                        variant="flat"
                        selectedKeys={[block.type]}
                        onSelectionChange={(keys) => {
                          const newType = Array.from(keys)[0] as
                            | "heading"
                            | "paragraph";
                          updateBlock(block.id, "type", newType);
                        }}
                        className="w-32"
                        aria-label="Content type"
                      >
                        {CONTENT_TYPES.map(({ key, label }) => (
                          <SelectItem key={key}>{label}</SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => moveBlock(block.id, "up")}
                        isDisabled={index === 0}
                        aria-label="Move up"
                      >
                        ↑
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => moveBlock(block.id, "down")}
                        isDisabled={index === blocks.length - 1}
                        aria-label="Move down"
                      >
                        ↓
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => removeBlock(block.id)}
                        aria-label="Delete block"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="pt-3">
                  {renderContentInput(block)}
                  {!block.text.trim() && (
                    <p className="text-xs text-default-400 mt-1">
                      This {block.type} is empty. Add some content to include it
                      in your blog post.
                    </p>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {blocks.length > 0 && (
        <div className="flex justify-center pt-4">
          <div className="flex gap-2">
            {CONTENT_TYPES.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant="bordered"
                size="sm"
                startContent={<Icon size={16} />}
                onPress={() => addBlock(key)}
              >
                Add {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {blocks.length > 0 && (
        <div className="text-sm text-default-500 text-center pt-2">
          {blocks.length} content block{blocks.length !== 1 ? "s" : ""} •
          {blocks.filter((b) => b.text.trim()).length} with content
        </div>
      )}
    </div>
  );
}
