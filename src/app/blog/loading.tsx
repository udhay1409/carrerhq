import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@heroui/card";

export default function BlogLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-6 rounded-lg" />
            <Skeleton className="h-6 w-96 mx-auto mb-8 rounded-lg" />
            <Skeleton className="h-12 w-80 mx-auto rounded-lg" />
          </div>
        </div>
      </section>

      {/* Blog Posts Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Tabs Skeleton */}
          <div className="mb-10 flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton
                key={i}
                className="h-8 w-24 flex-shrink-0 rounded-full"
              />
            ))}
          </div>

          {/* Blog Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Card key={i} className="border border-default-200">
                <CardBody className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-3 w-16 rounded-lg" />
                      <Skeleton className="h-3 w-20 rounded-lg" />
                    </div>
                    <Skeleton className="h-5 w-full mb-2 rounded-lg" />
                    <Skeleton className="h-5 w-3/4 mb-3 rounded-lg" />
                    <Skeleton className="h-4 w-full mb-2 rounded-lg" />
                    <Skeleton className="h-4 w-2/3 mb-3 rounded-lg" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-full" />
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section Skeleton */}
      <section className="py-16 bg-default-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-3 rounded-lg" />
            <Skeleton className="h-5 w-96 mx-auto mb-8 rounded-lg" />
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Skeleton className="h-12 flex-grow rounded-lg" />
              <Skeleton className="h-12 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
