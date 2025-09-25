import Link from "next/link";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <Icon
            icon="lucide:file-text"
            className="text-6xl text-foreground-400 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold mb-2">Blog Post Not Found</h1>
          <p className="text-foreground-500 text-lg">
            The blog post you&apos;re looking for doesn&apos;t exist or may have
            been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            href="/blog"
            color="primary"
            size="lg"
            startContent={<Icon icon="lucide:arrow-left" />}
          >
            Back to Blog
          </Button>
          <Button
            as={Link}
            href="/"
            variant="flat"
            size="lg"
            startContent={<Icon icon="lucide:home" />}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
