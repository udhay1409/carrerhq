"use client";
import { useState, useEffect } from "react";
import { Course } from "../types/course";
import {
  logDataFetchError,
  logNetworkError,
  logApiError,
} from "../utils/errorUtils";

interface CoursesByCountry {
  [countryCode: string]: Course[];
}

export const useAllCourses = () => {
  const [coursesByCountry, setCoursesByCountry] = useState<CoursesByCountry>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAllCourses = async () => {
      try {
        // Load courses from real API instead of static JSON files
        const [coursesResponse, countriesResponse] = await Promise.all([
          fetch("/api/courses?populate=true"),
          fetch("/api/countries"),
        ]);

        if (!coursesResponse.ok) {
          logApiError(
            `Failed to fetch courses: ${coursesResponse.status}`,
            "/api/courses",
            { populate: true },
            coursesResponse.status
          );
          throw new Error("Failed to fetch courses");
        }

        if (!countriesResponse.ok) {
          logApiError(
            `Failed to fetch countries: ${countriesResponse.status}`,
            "/api/countries",
            undefined,
            countriesResponse.status
          );
          throw new Error("Failed to fetch countries");
        }

        const [coursesData, countriesData] = await Promise.all([
          coursesResponse.json(),
          countriesResponse.json(),
        ]);

        const courses = coursesData.courses || [];
        const countries = countriesData.countries || [];

        // Define interfaces for API response data
        interface CourseApiResponse {
          id?: string;
          _id?: string;
          programName?: string;
          university?: { name?: string } | string;
          universityName?: string;
          universityId?: string;
          country?: { name?: string };
          countryName?: string;
          countryId?: string;
          studyLevel?: string;
          campus?: string;
          duration?: string;
          openIntakes?: string;
          intakeYear?: string;
          entryRequirements?: string;
          ieltsScore?: number;
          ieltsNoBandLessThan?: number;
          pteScore?: number;
          pteNoBandLessThan?: number;
          yearlyTuitionFees?: string;
          applicationDeadline?: string;
          serialNo?: number;
        }

        interface CountryApiResponse {
          id?: string;
          name: string;
          code?: string;
        }

        // Filter out courses with invalid data before transformation
        const validCourses = courses.filter(
          (course: CourseApiResponse, index: number) => {
            // Check if course has basic required data
            if (!course.programName) {
              console.warn(`Course ${index} missing programName, skipping`);
              return false;
            }

            // Check if university data is available
            const hasUniversityData =
              (course.university &&
                typeof course.university === "object" &&
                course.university.name) ||
              course.universityName ||
              course.universityId;

            if (!hasUniversityData) {
              console.warn(
                `Course ${course.id || index} has no university data, skipping`
              );
              return false;
            }

            return true;
          }
        );

        // Transform courses to match expected format with proper validation
        const transformedCourses = validCourses.map(
          (course: CourseApiResponse, index: number) => {
            // Debug log for problematic courses
            if (
              process.env.NODE_ENV === "development" &&
              !(
                course.university &&
                typeof course.university === "object" &&
                course.university.name
              ) &&
              !course.universityName
            ) {
              console.warn(`Course ${index} has no university name:`, {
                id: course.id,
                programName: course.programName,
                university: course.university,
                universityName: course.universityName,
              });
            }

            // Handle both string and object university data
            let universityName: string;
            if (typeof course.university === "string") {
              universityName = course.university;
            } else if (
              course.university &&
              typeof course.university === "object" &&
              course.university.name
            ) {
              universityName = course.university.name;
            } else {
              universityName =
                course.universityName || "University Name Not Available";
            }

            // Additional checks for edge cases
            if (typeof universityName !== "string") {
              universityName = String(
                universityName || "University Name Not Available"
              );
            }

            if (
              !universityName ||
              universityName.trim() === "" ||
              universityName === "null" ||
              universityName === "undefined"
            ) {
              universityName = "University Name Not Available";
              console.warn(
                `Course ${
                  course.id || index
                } had empty university name, using fallback`
              );
            }

            const transformedCourse = {
              id: course.id || course._id || `course-${index}`,
              serialNo: course.serialNo || course.id || `${index + 1}`,
              programName: course.programName || "Program Name Not Available",
              university: universityName.trim(),
              country:
                course.country?.name ||
                course.countryName ||
                "Country Not Available",
              studyLevel: course.studyLevel || "Not Specified",
              campus: course.campus || "Main Campus",
              duration: course.duration || "Duration Not Specified",
              openIntakes: course.openIntakes || "Contact University",
              intakeYear:
                course.intakeYear || new Date().getFullYear().toString(),
              entryRequirements:
                course.entryRequirements ||
                "Contact University for Requirements",
              ieltsScore: course.ieltsScore || 6.5,
              ieltsNoBandLessThan: course.ieltsNoBandLessThan || 6.0,
              pteScore: course.pteScore,
              pteNoBandLessThan: course.pteNoBandLessThan,
              yearlyTuitionFees:
                course.yearlyTuitionFees || "Contact University",
              // Note: countryId and universityId are not part of Course interface but used for grouping
              applicationDeadline:
                course.applicationDeadline || "Contact University",
            };

            // Final validation check
            if (
              !transformedCourse.university ||
              transformedCourse.university.trim() === ""
            ) {
              console.error(
                `CRITICAL: Course ${transformedCourse.serialNo} still has empty university after transformation!`
              );
              transformedCourse.university = "University Name Not Available";
            }

            return transformedCourse;
          }
        );

        // Group courses by country code
        const allCourses: CoursesByCountry = {};

        // Initialize with empty arrays for all countries
        countries.forEach((country: CountryApiResponse) => {
          const countryKey =
            country.code?.toLowerCase() ||
            country.name.toLowerCase().replace(/\s+/g, "-");
          allCourses[countryKey] = [];
        });

        // Group courses by country
        transformedCourses.forEach((course: Course, index: number) => {
          // Find the country for this course using the original course data
          const originalCourse = validCourses[index];
          const country = countries.find(
            (c: CountryApiResponse) =>
              c.id === originalCourse.countryId || c.name === course.country
          );

          if (country) {
            const countryKey =
              country.code?.toLowerCase() ||
              country.name.toLowerCase().replace(/\s+/g, "-");
            if (!allCourses[countryKey]) {
              allCourses[countryKey] = [];
            }
            allCourses[countryKey].push(course);
          }
        });

        setCoursesByCountry(allCourses);
      } catch (err) {
        if (err instanceof TypeError && err.message.includes("fetch")) {
          logNetworkError(err, "/api/courses or /api/countries");
        } else {
          logDataFetchError(
            err instanceof Error ? err : String(err),
            "courses_and_countries"
          );
        }
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadAllCourses();
  }, []);

  // Helper functions
  const getCoursesByCountry = (countryCode: string): Course[] => {
    return coursesByCountry[countryCode] || [];
  };

  const getCoursesByUniversity = (
    countryCode: string,
    universityName: string
  ): Course[] => {
    const countryCourses = getCoursesByCountry(countryCode);

    // Filter courses with additional safety checks
    return countryCourses.filter((course) => {
      // Ensure course has a valid university name
      if (
        !course.university ||
        typeof course.university !== "string" ||
        course.university.trim() === ""
      ) {
        console.warn(
          `Filtering out course ${course.serialNo} with invalid university name:`,
          course.university
        );
        return false;
      }

      // Check if university name matches
      return course.university
        .toLowerCase()
        .includes(universityName.toLowerCase());
    });
  };

  const getAllCourses = (): Course[] => {
    return Object.values(coursesByCountry).flat();
  };

  const getCountries = (): string[] => {
    return Object.keys(coursesByCountry);
  };

  const getCourseById = (courseId: string): Course | undefined => {
    const allCourses = getAllCourses();
    return allCourses.find((course) => course.id === courseId);
  };

  return {
    coursesByCountry,
    loading,
    error,
    getCoursesByCountry,
    getCoursesByUniversity,
    getAllCourses,
    getCountries,
    getCourseById,
  };
};
