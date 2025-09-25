import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePageClient } from "./course-page-client";
import { getCourseDataForServer } from "@/utils/courseUtils";

interface CoursePageParams {
  params: Promise<{
    countryId: string;
    universityId: string;
    courseId: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CoursePageParams): Promise<Metadata> {
  const { countryId, universityId: _universityId, courseId } = await params;

  // Get course data for metadata
  const course = await getCourseDataForServer(countryId, courseId);

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.programName} at ${course.university} - Study in ${course.country}`,
    description: `Study ${course.programName} at ${course.university}. Duration: ${course.duration}, Tuition: ${course.yearlyTuitionFees}. Located at ${course.campus} campus with intakes in ${course.openIntakes}.`,
    keywords: [
      course.programName,
      course.university,
      course.country,
      "study abroad",
      "international education",
      course.studyLevel || "Master's",
    ],
    openGraph: {
      title: `${course.programName} - ${course.university}`,
      description: `Study ${course.programName} at ${course.university} in ${course.country}. Expert guidance for admissions and visa assistance.`,
      type: "website",
    },
  };
}

export default async function CoursePage({ params }: CoursePageParams) {
  const { countryId, universityId: _universityId, courseId } = await params;

  // Get course data server-side to avoid duplicate API calls
  const course = await getCourseDataForServer(countryId, courseId);

  if (!course) {
    notFound();
  }

  return (
    <CoursePageClient
      countryId={countryId}
      universityId={_universityId}
      courseId={courseId}
      countryName={course.country}
      initialCourseData={course}
    />
  );
}
