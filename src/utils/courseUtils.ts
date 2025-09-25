import { Course } from "../types/course";
import { logDataFetchError, log404Error, logNetworkError } from "./errorUtils";

export async function getCourseDataForServer(
  _countrySlug: string,
  courseSlug: string
): Promise<Course | null> {
  try {
    // Use direct API call to fetch specific course by ID or slug
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

      // Course data is null even with 200 response
      log404Error("course", courseSlug, {
        endpoint: `/api/courses/${courseSlug}`,
        reason: "Course data is null in response",
      });
      return null;
    }

    if (response.status === 404) {
      // Log 404 as warning, not error - this is expected behavior
      log404Error("course", courseSlug, {
        endpoint: `/api/courses/${courseSlug}`,
      });
      return null;
    }

    // Handle other HTTP errors (5xx, etc.)
    const errorMessage = `API Error: ${response.status} ${response.statusText}`;
    logDataFetchError(errorMessage, "course", courseSlug, {
      endpoint: `/api/courses/${courseSlug}`,
      status: response.status,
      statusText: response.statusText,
    });

    throw new Error(errorMessage);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      // Network error
      logNetworkError(error, `/api/courses/${courseSlug}`, { courseSlug });
    } else {
      // Other errors (parsing, etc.)
      logDataFetchError(
        error instanceof Error ? error : String(error),
        "course",
        courseSlug,
        { endpoint: `/api/courses/${courseSlug}` }
      );
    }
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
