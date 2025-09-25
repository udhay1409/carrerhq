import { Button } from "@heroui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The
          page might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="space-y-4">
          <Button as={Link} href="/" color="primary" className="w-full">
            Go to homepage
          </Button>
          <Button
            as={Link}
            href="/study-abroad"
            variant="bordered"
            className="w-full"
          >
            Browse study abroad options
          </Button>
        </div>
      </div>
    </div>
  );
}
