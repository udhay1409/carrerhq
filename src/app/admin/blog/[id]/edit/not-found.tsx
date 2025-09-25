import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-danger">
            Blog Post Not Found
          </h1>
        </CardHeader>
        <CardBody className="text-center space-y-4">
          <p className="text-default-600">
            The blog post you&apos;re trying to edit doesn&apos;t exist or may
            have been deleted.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              as={Link}
              href="/admin/blog"
              color="primary"
              variant="solid"
            >
              Back to Blog List
            </Button>
            <Button
              as={Link}
              href="/admin/blog/new"
              color="secondary"
              variant="flat"
            >
              Create New Post
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
