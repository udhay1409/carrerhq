import React from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Course } from "@/types/course";
import { validateCourse } from "@/lib/validation";
import { constructStudyAbroadUrl } from "@/lib/slug-utils";
import { ErrorBoundary } from "./error-boundary";
import { ApplicationModal } from "./application-modal";

interface CourseCardProps {
  course: Course;
  countryName?: string;
  universityName?: string;
  onApply?: () => void;
  showValidationWarnings?: boolean;
}

// Safe course card component with validation
function SafeCourseCard({
  course,
  countryName,
  universityName,

  showValidationWarnings = false,
}: CourseCardProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] =
    React.useState(false);

  // Validate course data
  const validation = React.useMemo(() => validateCourse(course), [course]);

  // Show validation warnings in development
  React.useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      validation.warnings.length > 0
    ) {
      console.warn(
        `Course ${course.serialNo} validation warnings:`,
        validation.warnings
      );
    }
  }, [validation.warnings, course.serialNo]);

  // If course is invalid, show error fallback
  if (!validation.isValid) {
    // Only log error in development to avoid console spam in production
    if (process.env.NODE_ENV === "development") {
      console.error(
        `Course ${course.serialNo} validation errors:`,
        validation.errors
      );
    }

    // Don't render invalid courses in production to avoid UI clutter
    if (process.env.NODE_ENV === "production") {
      return null;
    }

    return (
      <Card className="border border-danger-200 bg-danger-50">
        <CardBody className="p-4 text-center">
          <Icon
            icon="lucide:alert-triangle"
            className="w-8 h-8 text-danger mx-auto mb-2"
          />
          <p className="text-danger text-sm">Invalid course data</p>
          <details className="mt-2 text-xs text-left">
            <summary className="cursor-pointer">Validation Errors</summary>
            <ul className="mt-1 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </details>
        </CardBody>
      </Card>
    );
  }

  // Safe data extraction with fallbacks
  const safeData = {
    id: course.id || course.serialNo || 0,
    serialNo: course.serialNo || 0,
    university: course.university || "Unknown University",
    programName: course.programName || "Unknown Program",
    campus: course.campus || "Main Campus",
    duration: course.duration || "Not specified",
    openIntakes: course.openIntakes || "Contact for details",
    intakeYear: course.intakeYear || new Date().getFullYear().toString(),
    ieltsScore: course.ieltsScore || 0,
    ieltsNoBandLessThan: course.ieltsNoBandLessThan || 0,
    pteScore: course.pteScore || 0,
    pteNoBandLessThan: course.pteNoBandLessThan,
    yearlyTuitionFees: course.yearlyTuitionFees || "Contact for fees",
    studyLevel: course.studyLevel || "Postgraduate",
    toeflScore: course.toeflScore,
    gmatScore: course.gmatScore,
    greScore: course.greScore,
    workExperience: course.workExperience,
  };

  const intakeMonths = safeData.openIntakes
    .split(", ")
    .filter((month) => month.trim());

  return (
    <>
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
        <Card className="border border-default-200">
          <CardBody className="p-4">
            {/* Validation warnings for development */}
            {showValidationWarnings && validation.warnings.length > 0 && (
              <div className="mb-3 p-2 bg-warning-50 border border-warning-200 rounded text-xs">
                <Icon
                  icon="lucide:alert-triangle"
                  className="w-3 h-3 text-warning inline mr-1"
                />
                <span className="text-warning-700">
                  Data quality issues detected
                </span>
              </div>
            )}

            <div className="flex justify-between items-start mb-2">
              <Chip size="sm" color="primary" variant="flat">
                {safeData.studyLevel}
              </Chip>
              <Chip size="sm" color="secondary" variant="flat">
                {safeData.intakeYear}
              </Chip>
            </div>

            <h3
              className="text-lg font-semibold mb-1 line-clamp-2"
              title={safeData.programName}
            >
              {safeData.programName}
            </h3>
            <p
              className="text-foreground-500 text-sm mb-2 line-clamp-1"
              title={safeData.university}
            >
              {safeData.university}
            </p>
            <p className="text-foreground-400 text-xs mb-4">
              📍 {safeData.campus}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:clock"
                  className="text-primary flex-shrink-0"
                />
                <span className="text-sm truncate" title={safeData.duration}>
                  {safeData.duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:wallet"
                  className="text-primary flex-shrink-0"
                />
                <span
                  className="text-sm truncate"
                  title={safeData.yearlyTuitionFees}
                >
                  {safeData.yearlyTuitionFees}
                </span>
              </div>
            </div>

            <Divider className="my-3" />

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Intake Months:</p>
              <div className="flex flex-wrap gap-2">
                {intakeMonths.length > 0 ? (
                  intakeMonths.map((month: string, index: number) => (
                    <Chip key={index} size="sm" variant="flat" color="default">
                      {month.trim()}
                    </Chip>
                  ))
                ) : (
                  <Chip size="sm" variant="flat" color="default">
                    Contact for details
                  </Chip>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Requirements:</p>
              <div className="space-y-1 text-xs">
                {safeData.ieltsScore > 0 && (
                  <div>
                    IELTS: {safeData.ieltsScore} {} (min{" "}
                    {safeData.ieltsNoBandLessThan})
                  </div>
                )}
                {safeData?.pteScore > 0 && safeData?.pteNoBandLessThan ? (
                  <div>
                    PTE: {safeData.pteScore} (min{" "}
                    {safeData.pteNoBandLessThan || "N/A"})
                  </div>
                ) : null}
                {safeData.toeflScore && safeData.toeflScore > 0 && (
                  <div>TOEFL: {safeData.toeflScore}</div>
                )}
                {safeData.gmatScore && safeData.gmatScore > 0 && (
                  <div>GMAT: {safeData.gmatScore}+</div>
                )}
                {safeData.greScore && safeData.greScore > 0 && (
                  <div>GRE: {safeData.greScore}+</div>
                )}
                {safeData.workExperience && (
                  <div>Experience: {safeData.workExperience}</div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                as={Link}
                href={constructStudyAbroadUrl(
                  countryName || course.country || "unknown",
                  universityName || course.university || "unknown",
                  safeData.programName
                )}
                color="primary"
                className="flex-1"
              >
                View Details
              </Button>
              <Button
                color="primary"
                variant="flat"
                className="flex-1"
                onPress={() => setIsApplicationModalOpen(true)}
              >
                Apply Now
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        courseDetails={{
          country: countryName || course.country || "Unknown",
          university: universityName || course.university || "Unknown",
          programName: safeData.programName,
        }}
      />
    </>
  );
}

// Export the course card wrapped with error boundary
export const CourseCard: React.FC<CourseCardProps> = (props) => {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <Card className="border border-danger-200">
          <CardBody className="p-4 text-center">
            <Icon
              icon="lucide:alert-triangle"
              className="w-8 h-8 text-danger mx-auto mb-2"
            />
            <p className="text-danger text-sm mb-2">Failed to render course</p>
            <Button size="sm" color="danger" variant="bordered" onPress={reset}>
              Retry
            </Button>
            {process.env.NODE_ENV === "development" && error && (
              <details className="mt-2 text-xs text-left">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-1 text-danger overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
          </CardBody>
        </Card>
      )}
    >
      <SafeCourseCard {...props} />
    </ErrorBoundary>
  );
};
