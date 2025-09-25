// Utility functions for generating and handling URL slugs

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function generateCountrySlug(countryName: string): string {
  return generateSlug(countryName);
}

export function generateUniversitySlug(universityName: string): string {
  return generateSlug(universityName);
}

export function generateCourseSlug(programName: string): string {
  return generateSlug(programName);
}

// Helper function to find entity by slug or ID
export async function findEntityBySlugOrId<T extends Record<string, unknown>>(
  model: {
    findById: (id: string) => Promise<T | null>;
    find: (query: Record<string, unknown>) => Promise<T[]>;
  },
  slugOrId: string,
  nameField: string = "name"
): Promise<T | null> {
  try {
    // First try to find by MongoDB ObjectId
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      return await model.findById(slugOrId);
    }

    // Then try to find by matching slug generated from name
    const entities = await model.find({});

    for (const entity of entities) {
      const nameValue = entity[nameField];
      if (typeof nameValue === "string") {
        const entitySlug = generateSlug(nameValue);
        if (entitySlug === slugOrId) {
          return entity;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding entity by slug or ID:", error);
    return null;
  }
}

// Helper to construct URL with slugs
export function constructStudyAbroadUrl(
  countryName: string,
  universityName?: string,
  courseName?: string
): string {
  const countrySlug = generateCountrySlug(countryName);

  if (!universityName) {
    return `/study-abroad/${countrySlug}`;
  }

  const universitySlug = generateUniversitySlug(universityName);

  if (!courseName) {
    return `/study-abroad/${countrySlug}/${universitySlug}`;
  }

  const courseSlug = generateCourseSlug(courseName);
  return `/study-abroad/${countrySlug}/${universitySlug}/${courseSlug}`;
}
