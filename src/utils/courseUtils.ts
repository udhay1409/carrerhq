import { Course } from "../types/course";

export async function getCourseDataForServer(
  _countrySlug: string,
  courseSlug: string
): Promise<Course | null> {
  try {
    // First try to get by MongoDB ObjectId (backward compatibility)
    if (courseSlug.match(/^[0-9a-fA-F]{24}$/)) {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/courses/${courseSlug}?populate=true`,
        {
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const course = data.course;
        if (course) {
          return transformCourseData(course);
        }
      }
    }

    // Get all courses and find by slug
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/courses?populate=true`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }

    const data = await response.json();
    const courses = data.courses || [];

    // Import slug utilities
    const { generateCourseSlug } = await import("@/lib/slug-utils");

    // Find course by matching slug
    for (const course of courses) {
      const slug = generateCourseSlug(course.programName);
      if (slug === courseSlug) {
        return transformCourseData(course);
      }
    }

    return null;
  } catch (error) {
    console.error(`Error loading course data: ${error}`);
    return null;
  }
}

// Helper function to transform course data
function transformCourseData(course: Record<string, unknown>): Course {
  // Type-safe helper functions
  const getString = (value: unknown, fallback: string): string => {
    return typeof value === "string" ? value : fallback;
  };

  const getNumber = (value: unknown, fallback: number): number => {
    return typeof value === "number" ? value : fallback;
  };

  const getStringOrNumber = (value: unknown): string | number | undefined => {
    return typeof value === "string" || typeof value === "number"
      ? value
      : undefined;
  };

  const getNumberOrNull = (value: unknown): number | null => {
    return typeof value === "number" ? value : null;
  };

  // Type-safe access to nested objects
  const getNestedString = (
    obj: unknown,
    key: string,
    fallback: string
  ): string => {
    if (obj && typeof obj === "object" && obj !== null && key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      return typeof value === "string" ? value : fallback;
    }
    return fallback;
  };

  return {
    id: getStringOrNumber(course.id || course._id),
    serialNo: getNumber(course.serialNo || course.id, 0),
    programName: getString(course.programName, "Program Name Not Available"),
    university:
      getNestedString(course.university, "name", "") ||
      getString(course.universityName, "University Name Not Available"),
    country:
      getNestedString(course.country, "name", "") ||
      getString(course.countryName, "Country Not Available"),
    studyLevel: getString(course.studyLevel, "Not Specified"),
    campus: getString(course.campus, "Main Campus"),
    duration: getString(course.duration, "Duration Not Specified"),
    openIntakes: getString(course.openIntakes, "Contact University"),
    intakeYear: getString(
      course.intakeYear,
      new Date().getFullYear().toString()
    ),
    entryRequirements: getString(
      course.entryRequirements,
      "Contact University for Requirements"
    ),
    ieltsScore: getNumber(course.ieltsScore, 6.5),
    ieltsNoBandLessThan: getNumber(course.ieltsNoBandLessThan, 6.0),
    pteScore: getNumberOrNull(course.pteScore),
    pteNoBandLessThan: getNumberOrNull(course.pteNoBandLessThan),
    yearlyTuitionFees: getString(
      course.yearlyTuitionFees,
      "Contact University"
    ),
    applicationDeadline: getString(
      course.applicationDeadline,
      "Contact University"
    ),
  };
}
