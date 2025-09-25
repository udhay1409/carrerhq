import { Skeleton } from "@heroui/skeleton";
import { Card, CardBody } from "@heroui/card";

export default function BlogPostLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Skeleton className="h-6 w-48 mb-6 rounded-lg" />
            <Skeleton className="h-8 w-32 mb-4 rounded-lg" />
            <Skeleton className="h-12 w-full mb-6 rounded-lg" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded-lg" />
                <Skeleton className="h-3 w-48 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="max-w-3xl">
                <Skeleton className="h-64 w-full mb-8 rounded-lg" />

                <div className="space-y-4">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                  <Skeleton className="h-6 w-1/2 rounded-lg mt-8" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-2/3 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="border border-default-200">
                <CardBody className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4 rounded-lg" />
                  <Skeleton className="h-4 w-full mb-2 rounded-lg" />
                  <Skeleton className="h-4 w-full mb-6 rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </CardBody>
              </Card>

              <div className="mt-8">
                <Skeleton className="h-6 w-32 mb-4 rounded-lg" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border border-default-200">
                      <CardBody className="p-0">
                        <div className="flex gap-4">
                          <Skeleton className="w-24 h-24 flex-shrink-0" />
                          <div className="py-2 pr-2 flex-grow">
                            <Skeleton className="h-3 w-16 mb-1 rounded-lg" />
                            <Skeleton className="h-4 w-full mb-1 rounded-lg" />
                            <Skeleton className="h-3 w-20 rounded-lg" />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
