import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <Card className="max-w-md">
        <CardBody className="text-center py-12">
          <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink size={24} className="text-danger-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Placement Not Found</h2>
          <p className="text-default-500 mb-6">
            The requested placement could not be found or may have been removed.
          </p>
          <Link href="/placement-india">
            <Button color="primary" variant="solid">
              Back to Placement India
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
