"use client";

import Link from "next/link";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

interface BlogPostErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BlogPostError({ error, reset }: BlogPostErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
      <div className="text-center px-4">
        <div className="mb-8">
          <Icon
            icon="lucide:alert-triangle"
            className="text-6xl text-danger mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold mb-2">Something went wrong!</h1>
          <p className="text-foreground-500 text-lg mb-4">
            We encountered an error while loading this blog post.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-danger-50 p-4 rounded-lg mb-4">
              <summary className="cursor-pointer font-medium">
                Error Details
              </summary>
              <pre className="mt-2 text-sm overflow-auto">{error.message}</pre>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            color="primary"
            size="lg"
            onPress={reset}
            startContent={<Icon icon="lucide:refresh-cw" />}
          >
            Try Again
          </Button>
          <Button
            as={Link}
            href="/blog"
            variant="flat"
            size="lg"
            startContent={<Icon icon="lucide:arrow-left" />}
          >
            Back to Blog
          </Button>
        </div>
      </div>
    </div>
  );
}
