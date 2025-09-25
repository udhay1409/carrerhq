"use client";

import { useState, useEffect, useCallback } from "react";
import { Course } from "@/types/course";
import { BlogPost } from "@/types/blog";
import {
  validateCourse,
  validateBlogPost,
  ValidationError,
} from "@/lib/validation";

export interface ValidationState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  warnings: string[];
  isValid: boolean;
  retry: () => void;
}

// Generic data validation hook
export function useDataValidation<T>(
  dataLoader: () => Promise<T>,
  validator?: (data: T) => {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  },
  dependencies: React.DependencyList = []
): ValidationState<T> {
  const [state, setState] = useState<ValidationState<T>>({
    data: null,
    isLoading: true,
    error: null,
    warnings: [],
    isValid: false,
    retry: () => {},
  });

  const loadData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await dataLoader();

      if (validator) {
        const validation = validator(data);

        if (!validation.isValid) {
          throw new ValidationError(
            `Data validation failed: ${validation.errors.join(", ")}`
          );
        }

        setState({
          data,
          isLoading: false,
          error: null,
          warnings: validation.warnings,
          isValid: true,
          retry: loadData,
        });
      } else {
        setState({
          data,
          isLoading: false,
          error: null,
          warnings: [],
          isValid: true,
          retry: loadData,
        });
      }
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      setState({
        data: null,
        isLoading: false,
        error: errorObj,
        warnings: [],
        isValid: false,
        retry: loadData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoader, validator, ...dependencies]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return state;
}

// Specific hook for course data validation
export function useCourseValidation(
  courseLoader: () => Promise<Course[]>
): ValidationState<Course[]> & {
  validCourses: Course[];
  invalidCount: number;
} {
  const validation = useDataValidation(courseLoader, (courses: Course[]) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    let _validCount = 0;

    courses.forEach((course, index) => {
      const courseValidation = validateCourse(course);

      if (courseValidation.isValid) {
        _validCount++;
      } else {
        errors.push(
          `Course ${index + 1}: ${courseValidation.errors.join(", ")}`
        );
      }

      warnings.push(
        ...courseValidation.warnings.map((w) => `Course ${index + 1}: ${w}`)
      );
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  });

  const validCourses = validation.data || [];
  const totalCourses = validCourses.length;
  const validCoursesCount = validCourses.filter(
    (course) => validateCourse(course).isValid
  ).length;

  return {
    ...validation,
    validCourses,
    invalidCount: totalCourses - validCoursesCount,
  };
}

// Specific hook for blog post validation
export function useBlogPostValidation(
  postLoader: () => Promise<BlogPost>
): ValidationState<BlogPost> {
  return useDataValidation(postLoader, (post: BlogPost) =>
    validateBlogPost(post)
  );
}

// Hook for handling data with fallbacks
export function useDataWithFallback<T>(
  primaryLoader: () => Promise<T>,
  fallbackData: T,
  validator?: (data: T) => boolean
): {
  data: T;
  isLoading: boolean;
  error: Error | null;
  isUsingFallback: boolean;
  retry: () => void;
} {
  const [state, setState] = useState({
    data: fallbackData,
    isLoading: true,
    error: null as Error | null,
    isUsingFallback: true,
  });

  const loadData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await primaryLoader();

      if (validator && !validator(data)) {
        throw new ValidationError("Data validation failed");
      }

      setState({
        data,
        isLoading: false,
        error: null,
        isUsingFallback: false,
      });
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      setState({
        data: fallbackData,
        isLoading: false,
        error: errorObj,
        isUsingFallback: true,
      });
    }
  }, [primaryLoader, fallbackData, validator]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    retry: loadData,
  };
}

// Hook for progressive data loading with partial results
export function useProgressiveDataLoading<T>(
  loaders: Array<() => Promise<T>>,
  combiner: (results: T[]) => T
): {
  data: T | null;
  isLoading: boolean;
  progress: number;
  errors: Error[];
  partialData: T[];
  retry: () => void;
} {
  const [state, setState] = useState({
    data: null as T | null,
    isLoading: true,
    progress: 0,
    errors: [] as Error[],
    partialData: [] as T[],
  });

  const loadData = useCallback(async () => {
    setState({
      data: null,
      isLoading: true,
      progress: 0,
      errors: [],
      partialData: [],
    });

    const results: T[] = [];
    const errors: Error[] = [];

    for (let i = 0; i < loaders.length; i++) {
      try {
        const result = await loaders[i]();
        results.push(result);

        setState((prev) => ({
          ...prev,
          progress: ((i + 1) / loaders.length) * 100,
          partialData: [...results],
        }));
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        errors.push(errorObj);
      }
    }

    try {
      const combinedData = combiner(results);

      setState({
        data: combinedData,
        isLoading: false,
        progress: 100,
        errors,
        partialData: results,
      });
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      setState({
        data: null,
        isLoading: false,
        progress: 100,
        errors: [...errors, errorObj],
        partialData: results,
      });
    }
  }, [loaders, combiner]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    retry: loadData,
  };
}

// Hook for data caching with validation
export function useCachedDataValidation<T>(
  key: string,
  dataLoader: () => Promise<T>,
  validator?: (data: T) => boolean,
  ttl: number = 5 * 60 * 1000 // 5 minutes default TTL
): ValidationState<T> & {
  isCached: boolean;
  clearCache: () => void;
} {
  const [isCached, setIsCached] = useState(false);

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(`data_cache_${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);

      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(`data_cache_${key}`);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }, [key, ttl]);

  const setCachedData = useCallback(
    (data: T) => {
      try {
        localStorage.setItem(
          `data_cache_${key}`,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      } catch {
        // Ignore cache errors
      }
    },
    [key]
  );

  const clearCache = useCallback(() => {
    localStorage.removeItem(`data_cache_${key}`);
    setIsCached(false);
  }, [key]);

  const cachedLoader = useCallback(async (): Promise<T> => {
    const cached = getCachedData();

    if (cached && (!validator || validator(cached))) {
      setIsCached(true);
      return cached;
    }

    const data = await dataLoader();
    setCachedData(data);
    setIsCached(false);
    return data;
  }, [dataLoader, getCachedData, setCachedData, validator]);

  const validation = useDataValidation(
    cachedLoader,
    validator
      ? (data: T) => ({
          isValid: validator(data),
          errors: validator(data) ? [] : ["Data validation failed"],
          warnings: [],
        })
      : undefined
  );

  return {
    ...validation,
    isCached,
    clearCache,
  };
}
