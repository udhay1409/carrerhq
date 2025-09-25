"use client";

import { AlertTriangle, RefreshCw, Home, Search } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";

// Generic error fallback component
export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  description = "We encountered an error while loading this content.",
  showRetry = true,
  showHomeLink = true,
}: {
  error?: Error;
  reset?: () => void;
  title?: string;
  description?: string;
  showRetry?: boolean;
  showHomeLink?: boolean;
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center p-8">
          <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-foreground-500 mb-6">{description}</p>

          {error && process.env.NODE_ENV === "development" && (
            <details className="text-left mb-4 p-3 bg-danger-50 rounded-lg">
              <summary className="cursor-pointer text-danger font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-danger overflow-auto">
                {error.message}
                {error.stack && `\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {showRetry && reset && (
              <Button
                color="primary"
                variant="solid"
                startContent={<RefreshCw className="w-4 h-4" />}
                onPress={reset}
              >
                Try Again
              </Button>
            )}
            {showHomeLink && (
              <Button
                as={Link}
                href="/"
                color="default"
                variant="bordered"
                startContent={<Home className="w-4 h-4" />}
              >
                Go Home
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Course data loading fallback
export function CourseDataFallback({
  error,
  retry,
  type = "courses",
}: {
  error?: Error;
  retry?: () => void;
  type?: "courses" | "course" | "university" | "country";
}) {
  const messages = {
    courses: {
      title: "Unable to Load Courses",
      description:
        "We're having trouble loading the course data. Please try again.",
    },
    course: {
      title: "Course Not Found",
      description:
        "The course you're looking for could not be found or loaded.",
    },
    university: {
      title: "University Information Unavailable",
      description: "We couldn't load information about this university.",
    },
    country: {
      title: "Country Data Unavailable",
      description:
        "We're unable to load information about this country's programs.",
    },
  };

  return (
    <ErrorFallback
      error={error}
      reset={retry}
      title={messages[type].title}
      description={messages[type].description}
    />
  );
}

// Empty state component for when data loads but is empty
export function EmptyState({
  title = "No Results Found",
  description = "We couldn't find any items matching your criteria.",
  icon: Icon = Search,
  action,
}: {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-[300px] p-4">
      <div className="text-center max-w-md">
        <Icon className="w-16 h-16 text-foreground-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-foreground-500 mb-6">{description}</p>
        {action}
      </div>
    </div>
  );
}

// Loading skeleton for course cards
export function CourseCardSkeleton() {
  return (
    <Card className="w-full">
      <CardBody className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-foreground-200 rounded mb-3"></div>
          <div className="h-6 bg-foreground-200 rounded mb-4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-foreground-200 rounded w-3/4"></div>
            <div className="h-3 bg-foreground-200 rounded w-1/2"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-foreground-200 rounded w-20"></div>
            <div className="h-8 bg-foreground-200 rounded w-24"></div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Loading skeleton for course list
export function CourseListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Data validation warning component
export function DataValidationWarning({
  warnings,
  onDismiss,
}: {
  warnings: string[];
  onDismiss?: () => void;
}) {
  if (warnings.length === 0) return null;

  return (
    <Card className="mb-4 border-warning-200 bg-warning-50">
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-warning-800 mb-2">
              Data Quality Warnings
            </h4>
            <ul className="text-sm text-warning-700 space-y-1">
              {warnings.slice(0, 5).map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
              {warnings.length > 5 && (
                <li className="text-warning-600">
                  ... and {warnings.length - 5} more warnings
                </li>
              )}
            </ul>
          </div>
          {onDismiss && (
            <Button
              size="sm"
              variant="light"
              color="warning"
              onPress={onDismiss}
              className="min-w-unit-8 w-unit-8 h-unit-8"
            >
              ×
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// Partial data loaded component
export function PartialDataNotice({
  totalExpected,
  totalLoaded,
  onRetry,
}: {
  totalExpected: number;
  totalLoaded: number;
  onRetry?: () => void;
}) {
  const percentage = Math.round((totalLoaded / totalExpected) * 100);

  return (
    <Card className="mb-4 border-warning-200 bg-warning-50">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <div>
              <p className="font-medium text-warning-800">
                Partial Data Loaded ({percentage}%)
              </p>
              <p className="text-sm text-warning-700">
                Showing {totalLoaded} of {totalExpected} items. Some data may be
                missing.
              </p>
            </div>
          </div>
          {onRetry && (
            <Button
              size="sm"
              color="warning"
              variant="bordered"
              startContent={<RefreshCw className="w-4 h-4" />}
              onPress={onRetry}
            >
              Retry
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

// Network error component
export function NetworkErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorFallback
      title="Connection Problem"
      description="We're having trouble connecting to our servers. Please check your internet connection and try again."
      reset={onRetry}
      showHomeLink={false}
    />
  );
}

// Maintenance mode component
export function MaintenanceFallback() {
  return (
    <ErrorFallback
      title="Temporarily Unavailable"
      description="This service is temporarily unavailable due to maintenance. Please try again later."
      showRetry={false}
      showHomeLink={true}
    />
  );
}
