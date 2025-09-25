import { Course } from "@/types/course";
import { BlogPost } from "@/types/blog";
import {
  validateCourse,
  validateBlogPost,
  DataLoadError,
  ValidationError,
} from "./validation";

// Safe wrapper for data loading functions
export async function safeLoadCourses<T>(
  loader: () => Promise<T>,
  fallback: T,
  options: {
    validateItems?: boolean;
    logErrors?: boolean;
    throwOnFailure?: boolean;
  } = {}
): Promise<{
  data: T;
  hasErrors: boolean;
  errors: string[];
  warnings: string[];
}> {
  const {
    validateItems = true,
    logErrors = true,
    throwOnFailure = false,
  } = options;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const data = await loader();

    // If data is an array of courses, validate each one
    if (validateItems && Array.isArray(data)) {
      const courses = data as unknown as Course[];

      courses.forEach((course, index) => {
        const validation = validateCourse(course);

        if (!validation.isValid) {
          errors.push(`Course ${index + 1}: ${validation.errors.join(", ")}`);
        }

        warnings.push(
          ...validation.warnings.map((w) => `Course ${index + 1}: ${w}`)
        );
      });
    }

    if (logErrors) {
      if (errors.length > 0) {
        console.error("Data validation errors:", errors);
      }
      if (warnings.length > 0) {
        console.warn("Data validation warnings:", warnings);
      }
    }

    return {
      data,
      hasErrors: errors.length > 0,
      errors,
      warnings,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);

    if (logErrors) {
      console.error("Data loading failed:", error);
    }

    if (throwOnFailure) {
      throw new DataLoadError(
        errorMessage,
        undefined,
        error instanceof Error ? error : undefined
      );
    }

    return {
      data: fallback,
      hasErrors: true,
      errors,
      warnings,
    };
  }
}

// Safe wrapper for single course loading
export async function safeLoadCourse(
  loader: () => Promise<Course | null>,
  options: {
    logErrors?: boolean;
    throwOnFailure?: boolean;
  } = {}
): Promise<{
  course: Course | null;
  hasErrors: boolean;
  errors: string[];
  warnings: string[];
}> {
  const { logErrors = true, throwOnFailure = false } = options;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const course = await loader();

    if (!course) {
      return {
        course: null,
        hasErrors: false,
        errors,
        warnings,
      };
    }

    // Validate the course
    const validation = validateCourse(course);

    if (!validation.isValid) {
      errors.push(...validation.errors);

      if (throwOnFailure) {
        throw new ValidationError(
          `Course validation failed: ${validation.errors.join(", ")}`
        );
      }
    }

    warnings.push(...validation.warnings);

    if (logErrors) {
      if (errors.length > 0) {
        console.error("Course validation errors:", errors);
      }
      if (warnings.length > 0) {
        console.warn("Course validation warnings:", warnings);
      }
    }

    return {
      course: validation.isValid ? course : null,
      hasErrors: errors.length > 0,
      errors,
      warnings,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);

    if (logErrors) {
      console.error("Course loading failed:", error);
    }

    if (throwOnFailure) {
      throw error;
    }

    return {
      course: null,
      hasErrors: true,
      errors,
      warnings,
    };
  }
}

// Safe wrapper for blog post loading
export async function safeLoadBlogPost(
  loader: () => Promise<BlogPost | null>,
  options: {
    logErrors?: boolean;
    throwOnFailure?: boolean;
  } = {}
): Promise<{
  post: BlogPost | null;
  hasErrors: boolean;
  errors: string[];
  warnings: string[];
}> {
  const { logErrors = true, throwOnFailure = false } = options;
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const post = await loader();

    if (!post) {
      return {
        post: null,
        hasErrors: false,
        errors,
        warnings,
      };
    }

    // Validate the blog post
    const validation = validateBlogPost(post);

    if (!validation.isValid) {
      errors.push(...validation.errors);

      if (throwOnFailure) {
        throw new ValidationError(
          `Blog post validation failed: ${validation.errors.join(", ")}`
        );
      }
    }

    warnings.push(...validation.warnings);

    if (logErrors) {
      if (errors.length > 0) {
        console.error("Blog post validation errors:", errors);
      }
      if (warnings.length > 0) {
        console.warn("Blog post validation warnings:", warnings);
      }
    }

    return {
      post: validation.isValid ? post : null,
      hasErrors: errors.length > 0,
      errors,
      warnings,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);

    if (logErrors) {
      console.error("Blog post loading failed:", error);
    }

    if (throwOnFailure) {
      throw error;
    }

    return {
      post: null,
      hasErrors: true,
      errors,
      warnings,
    };
  }
}

// Retry mechanism for failed data loads
export async function retryDataLoad<T>(
  loader: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await loader();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        throw new DataLoadError(
          `Failed after ${maxRetries} attempts: ${lastError.message}`,
          undefined,
          lastError
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}

// Circuit breaker pattern for data loading
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  constructor(
    private maxFailures: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime < this.timeout) {
        throw new Error("Circuit breaker is open");
      } else {
        this.state = "half-open";
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "closed";
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.maxFailures) {
      this.state = "open";
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

// Global circuit breaker instances
export const courseDataCircuitBreaker = new CircuitBreaker(5, 60000);
export const blogDataCircuitBreaker = new CircuitBreaker(3, 30000);

// Safe data loader with circuit breaker
export async function safeLoadWithCircuitBreaker<T>(
  loader: () => Promise<T>,
  circuitBreaker: CircuitBreaker,
  fallback?: T
): Promise<T> {
  try {
    return await circuitBreaker.execute(loader);
  } catch (error) {
    console.error("Circuit breaker execution failed:", error);

    if (fallback !== undefined) {
      return fallback;
    }

    throw error;
  }
}
