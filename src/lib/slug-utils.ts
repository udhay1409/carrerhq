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
    findOne: (query: Record<string, unknown>) => Promise<T | null>;
    find: (query: Record<string, unknown>) => Promise<T[]>;
  },
  slugOrId: string,
  nameField: string = "name"
): Promise<T | null> {
  try {
    console.log("🔍 findEntityBySlugOrId:", {
      slugOrId,
      nameField,
      isObjectId: slugOrId.match(/^[0-9a-fA-F]{24}$/),
    });

    // First try to find by MongoDB ObjectId (Requirement 5.1)
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("🔎 Searching by ObjectId:", slugOrId);
      const result = await model.findById(slugOrId);
      console.log("📝 ObjectId search result:", !!result);
      return result;
    }

    // Try to find by slug field first (Requirement 5.2)
    console.log("🔎 Searching by slug field:", slugOrId);
    const bySlug = await model.findOne({ slug: slugOrId });
    console.log("📝 Slug field search result:", !!bySlug);
    if (bySlug) {
      return bySlug;
    }

    // Fallback: try to find by matching slug generated from name
    // This is for backward compatibility with existing data that might not have slug field
    const nameRegex = new RegExp(`^${slugOrId.replace(/-/g, "\\s+")}$`, "i");
    console.log("🔎 Searching by name regex:", {
      pattern: nameRegex.source,
      flags: nameRegex.flags,
      originalSlug: slugOrId,
    });

    const byGeneratedSlug = await model.findOne({
      [nameField]: { $regex: nameRegex },
    });
    console.log("📝 Name regex search result:", !!byGeneratedSlug);

    if (byGeneratedSlug) {
      return byGeneratedSlug;
    }

    // Additional fallback: try exact name match
    console.log("🔎 Searching by exact name match:", slugOrId);
    const byExactName = await model.findOne({
      [nameField]: { $regex: new RegExp(`^${slugOrId}$`, "i") },
    });
    console.log("📝 Exact name search result:", !!byExactName);

    if (byExactName) {
      return byExactName;
    }

    console.log("❌ No entity found for:", slugOrId);
    return null;
  } catch (error) {
    console.error("💥 Error finding entity by slug or ID:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      slugOrId,
      nameField,
    });
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
