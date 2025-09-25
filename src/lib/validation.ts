import { Course } from "@/types/course";

// Validation error types
export class ValidationError extends Error {
  constructor(message: string, public field?: string, public value?: unknown) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DataLoadError extends Error {
  constructor(
    message: string,
    public source?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "DataLoadError";
  }
}

// Course validation schema
export interface CourseValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Required fields for a course
const REQUIRED_COURSE_FIELDS = [
  "serialNo",
  "university",
  "programName",
  "campus",
  "duration",
  "openIntakes",
  "intakeYear",
  "entryRequirements",
  "ieltsScore",
  "ieltsNoBandLessThan",
  "yearlyTuitionFees",
  "country",
] as const;

// Validate a single course object
export function validateCourse(course: unknown): CourseValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if course is an object
  if (!course || typeof course !== "object") {
    return {
      isValid: false,
      errors: ["Course data must be an object"],
      warnings: [],
    };
  }

  const courseObj = course as Record<string, unknown>;

  // Check required fields
  for (const field of REQUIRED_COURSE_FIELDS) {
    if (
      !(field in courseObj) ||
      courseObj[field] === null ||
      courseObj[field] === undefined
    ) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate specific field types and constraints
  if ("serialNo" in courseObj) {
    const serialNo = courseObj.serialNo;
    if (typeof serialNo !== "number" || serialNo <= 0) {
      errors.push("serialNo must be a positive number");
    }
  }

  if ("university" in courseObj) {
    const university = courseObj.university;
    if (typeof university !== "string" || university.trim().length === 0) {
      errors.push("university must be a non-empty string");
    }
  }

  if ("programName" in courseObj) {
    const programName = courseObj.programName;
    if (typeof programName !== "string" || programName.trim().length === 0) {
      errors.push("programName must be a non-empty string");
    }
  }

  if ("ieltsScore" in courseObj) {
    const ieltsScore = courseObj.ieltsScore;
    if (typeof ieltsScore !== "number" || ieltsScore < 0 || ieltsScore > 9) {
      errors.push("ieltsScore must be a number between 0 and 9");
    }
  }

  if ("ieltsNoBandLessThan" in courseObj) {
    const ieltsNoBandLessThan = courseObj.ieltsNoBandLessThan;
    if (
      typeof ieltsNoBandLessThan !== "number" ||
      ieltsNoBandLessThan < 0 ||
      ieltsNoBandLessThan > 9
    ) {
      errors.push("ieltsNoBandLessThan must be a number between 0 and 9");
    }
  }

  // Validate optional numeric fields
  if ("pteScore" in courseObj && courseObj.pteScore !== null) {
    const pteScore = courseObj.pteScore;
    if (typeof pteScore !== "number" || pteScore < 0 || pteScore > 90) {
      errors.push("pteScore must be a number between 0 and 90 or null");
    }
  }

  if ("toeflScore" in courseObj && courseObj.toeflScore !== undefined) {
    const toeflScore = courseObj.toeflScore;
    if (typeof toeflScore !== "number" || toeflScore < 0 || toeflScore > 120) {
      errors.push("toeflScore must be a number between 0 and 120");
    }
  }

  if ("duolingo" in courseObj && courseObj.duolingo !== undefined) {
    const duolingo = courseObj.duolingo;
    if (typeof duolingo !== "number" || duolingo < 0 || duolingo > 160) {
      errors.push("duolingo must be a number between 0 and 160");
    }
  }

  // Validate arrays
  if ("scholarships" in courseObj && courseObj.scholarships !== undefined) {
    const scholarships = courseObj.scholarships;
    if (!Array.isArray(scholarships)) {
      errors.push("scholarships must be an array");
    } else if (scholarships.some((s) => typeof s !== "string")) {
      errors.push("all scholarship items must be strings");
    }
  }

  if (
    "careerProspects" in courseObj &&
    courseObj.careerProspects !== undefined
  ) {
    const careerProspects = courseObj.careerProspects;
    if (!Array.isArray(careerProspects)) {
      errors.push("careerProspects must be an array");
    } else if (careerProspects.some((c) => typeof c !== "string")) {
      errors.push("all career prospect items must be strings");
    }
  }

  // Add warnings for missing optional but recommended fields
  if (!("studyLevel" in courseObj) || !courseObj.studyLevel) {
    warnings.push("studyLevel is recommended for better categorization");
  }

  if (!("applicationDeadline" in courseObj) || !courseObj.applicationDeadline) {
    warnings.push("applicationDeadline is recommended for student planning");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Validate an array of courses
export function validateCourses(courses: unknown[]): {
  validCourses: Course[];
  invalidCourses: Array<{ index: number; data: unknown; errors: string[] }>;
  warnings: string[];
} {
  const validCourses: Course[] = [];
  const invalidCourses: Array<{
    index: number;
    data: unknown;
    errors: string[];
  }> = [];
  const allWarnings: string[] = [];

  courses.forEach((course, index) => {
    const validation = validateCourse(course);

    if (validation.isValid) {
      validCourses.push(course as Course);
      allWarnings.push(
        ...validation.warnings.map((w) => `Course ${index + 1}: ${w}`)
      );
    } else {
      invalidCourses.push({
        index,
        data: course,
        errors: validation.errors,
      });
    }
  });

  return {
    validCourses,
    invalidCourses,
    warnings: allWarnings,
  };
}

// Blog post validation
export function validateBlogPost(post: unknown): CourseValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!post || typeof post !== "object") {
    return {
      isValid: false,
      errors: ["Blog post data must be an object"],
      warnings: [],
    };
  }

  const postObj = post as Record<string, unknown>;

  // Required fields for blog posts
  const requiredFields = [
    "id",
    "title",
    "excerpt",
    "content",
    "author",
    "date",
    "category",
  ];

  for (const field of requiredFields) {
    if (
      !(field in postObj) ||
      postObj[field] === null ||
      postObj[field] === undefined
    ) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate specific fields
  if ("id" in postObj && typeof postObj.id !== "string") {
    errors.push("id must be a string");
  }

  if (
    "title" in postObj &&
    (typeof postObj.title !== "string" || postObj.title.trim().length === 0)
  ) {
    errors.push("title must be a non-empty string");
  }

  if ("date" in postObj) {
    const date = postObj.date;
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push("date must be a valid date string");
      }
    } else {
      errors.push("date must be a string");
    }
  }

  if ("readTime" in postObj && postObj.readTime !== undefined) {
    if (typeof postObj.readTime !== "number" || postObj.readTime <= 0) {
      errors.push("readTime must be a positive number");
    }
  }

  if ("tags" in postObj && postObj.tags !== undefined) {
    const tags = postObj.tags;
    if (!Array.isArray(tags)) {
      errors.push("tags must be an array");
    } else if (tags.some((tag) => typeof tag !== "string")) {
      errors.push("all tag items must be strings");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Sanitize course data by removing invalid entries and fixing common issues
export function sanitizeCourse(course: unknown): Course | null {
  if (!course || typeof course !== "object") {
    return null;
  }

  const courseObj = course as Record<string, unknown>;

  // Check if we have minimum required data
  if (!courseObj.serialNo || !courseObj.university || !courseObj.programName) {
    return null;
  }

  // Create sanitized course object with defaults
  const sanitized: Course = {
    serialNo: Number(courseObj.serialNo) || 0,
    university: String(courseObj.university || "").trim(),
    programName: String(courseObj.programName || "").trim(),
    campus: String(courseObj.campus || "Main Campus").trim(),
    duration: String(courseObj.duration || "").trim(),
    openIntakes: String(courseObj.openIntakes || "").trim(),
    intakeYear: String(courseObj.intakeYear || new Date().getFullYear()).trim(),
    entryRequirements: String(courseObj.entryRequirements || "").trim(),
    ieltsScore: Number(courseObj.ieltsScore) || 0,
    ieltsNoBandLessThan: Number(courseObj.ieltsNoBandLessThan) || 0,
    pteScore: courseObj.pteScore ? Number(courseObj.pteScore) : null,
    pteNoBandLessThan: courseObj.pteNoBandLessThan
      ? Number(courseObj.pteNoBandLessThan)
      : null,
    yearlyTuitionFees: String(courseObj.yearlyTuitionFees || "").trim(),
    country: String(courseObj.country || "").trim(),
  };

  // Add optional fields if they exist and are valid
  if (courseObj.studyLevel && typeof courseObj.studyLevel === "string") {
    sanitized.studyLevel = courseObj.studyLevel.trim();
  }

  if (courseObj.toeflScore && typeof courseObj.toeflScore === "number") {
    sanitized.toeflScore = courseObj.toeflScore;
  }

  if (
    courseObj.applicationDeadline &&
    typeof courseObj.applicationDeadline === "string"
  ) {
    sanitized.applicationDeadline = courseObj.applicationDeadline.trim();
  }

  if (courseObj.duolingo && typeof courseObj.duolingo === "number") {
    sanitized.duolingo = courseObj.duolingo;
  }

  if (courseObj.gmatScore !== undefined) {
    sanitized.gmatScore = courseObj.gmatScore
      ? Number(courseObj.gmatScore)
      : null;
  }

  if (courseObj.greScore && typeof courseObj.greScore === "number") {
    sanitized.greScore = courseObj.greScore;
  }

  if (
    courseObj.workExperience &&
    typeof courseObj.workExperience === "string"
  ) {
    sanitized.workExperience = courseObj.workExperience.trim();
  }

  if (Array.isArray(courseObj.scholarships)) {
    sanitized.scholarships = courseObj.scholarships
      .filter((s) => typeof s === "string")
      .map((s) => s.trim());
  }

  if (courseObj.tuitionFee && typeof courseObj.tuitionFee === "string") {
    sanitized.tuitionFee = courseObj.tuitionFee.trim();
  }

  if (courseObj.currency && typeof courseObj.currency === "string") {
    sanitized.currency = courseObj.currency.trim();
  }

  if (Array.isArray(courseObj.careerProspects)) {
    sanitized.careerProspects = courseObj.careerProspects
      .filter((c) => typeof c === "string")
      .map((c) => c.trim());
  }

  if (
    courseObj.universityRanking &&
    typeof courseObj.universityRanking === "number"
  ) {
    sanitized.universityRanking = courseObj.universityRanking;
  }

  if (
    courseObj.programRanking &&
    typeof courseObj.programRanking === "number"
  ) {
    sanitized.programRanking = courseObj.programRanking;
  }

  if (Array.isArray(courseObj.accreditation)) {
    sanitized.accreditation = courseObj.accreditation
      .filter((a) => typeof a === "string")
      .map((a) => a.trim());
  }

  if (Array.isArray(courseObj.specializations)) {
    sanitized.specializations = courseObj.specializations
      .filter((s) => typeof s === "string")
      .map((s) => s.trim());
  }

  return sanitized;
}

// Create a safe data loader with validation
export function createSafeDataLoader<T>(
  loader: () => Promise<T>,
  validator?: (data: T) => boolean,
  fallback?: T
) {
  return async (): Promise<T> => {
    try {
      const data = await loader();

      if (validator && !validator(data)) {
        console.warn("Data validation failed, using fallback");
        if (fallback !== undefined) {
          return fallback;
        }
        throw new ValidationError(
          "Data validation failed and no fallback provided"
        );
      }

      return data;
    } catch (error) {
      console.error("Data loading failed:", error);

      if (fallback !== undefined) {
        return fallback;
      }

      throw new DataLoadError(
        "Failed to load data and no fallback provided",
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };
}
