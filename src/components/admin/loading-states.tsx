import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody, CardHeader } from "@heroui/card";

interface LoadingStatesProps {
  variant: "table" | "cards" | "form" | "dashboard";
  count?: number;
}

export function LoadingStates({ variant, count = 5 }: LoadingStatesProps) {
  switch (variant) {
    case "table":
      return <TableLoadingSkeleton count={count} />;
    case "cards":
      return <CardsLoadingSkeleton count={count} />;
    case "form":
      return <FormLoadingSkeleton />;
    case "dashboard":
      return <DashboardLoadingSkeleton />;
    default:
      return <TableLoadingSkeleton count={count} />;
  }
}

function TableLoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>

      {/* Table Content */}
      <div className="space-y-3">
        {/* Table Headers */}
        <div className="grid grid-cols-6 gap-4 p-4 bg-default-50 rounded-lg">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-18 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>

        {/* Table Rows */}
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 p-4 border-b border-divider"
          >
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-8 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CardsLoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-24 rounded" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function FormLoadingSkeleton() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-48 rounded" />
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Excerpt Field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>

        {/* Two Column Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded" />
          <div className="space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>

        {/* Category and Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </CardBody>
    </Card>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-8 w-12 rounded" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Posts Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32 rounded" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border-b border-divider last:border-b-0"
              >
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 rounded" />
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Export individual skeleton components for more granular usage
export {
  TableLoadingSkeleton,
  CardsLoadingSkeleton,
  FormLoadingSkeleton,
  DashboardLoadingSkeleton,
};
