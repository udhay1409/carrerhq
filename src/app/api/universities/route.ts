import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import University from "@/models/University";
import Country from "@/models/Country";
import type { CreateUniversityData } from "@/types/education";
import { handleImageUpload } from "@/lib/image-upload-utils";

// Type for MongoDB query filter
interface UniversityQueryFilter {
  countryId?: string;
  published?: { $ne: boolean };
}

// Type for populated university document
interface PopulatedUniversity {
  _id: string;
  name: string;
  countryId:
    | {
        _id: string;
        name: string;
        code?: string;
        flagImageId?: string;
      }
    | string;
  location: string;
  website?: string;
  imageId?: string;
  description?: string;
  ranking?: number;
  established?: number;
  type: "Public" | "Private";
  campusSize?: string;
  studentPopulation?: string;
  internationalStudents?: string;
  accommodation?: string;
  facilities?: string[];
  tags?: string[];
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  toJSON(): Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");
    const populate = searchParams.get("populate") === "true";
    const limit = searchParams.get("limit");
    const includeUnpublished =
      searchParams.get("includeUnpublished") === "true";

    const query: UniversityQueryFilter = {};
    if (countryId) {
      query.countryId = countryId;
    }

    // By default only show published universities
    if (!includeUnpublished) {
      query.published = { $ne: false };
    }

    let universitiesQuery = University.find(query).sort({ name: 1 });

    // Apply limit if specified
    if (limit) {
      universitiesQuery = universitiesQuery.limit(parseInt(limit));
    }

    let universities = await universitiesQuery;

    if (populate) {
      universities = await University.populate(universities, {
        path: "countryId",
        select: "name code flagImageId",
      });

      // Get course counts for each university
      const Course = (await import("@/models/Course")).default;

      // Transform the data to match the expected interface and add course counts
      const universitiesWithCounts = await Promise.all(
        universities.map(async (uni: PopulatedUniversity) => {
          const courseCount = await Course.countDocuments({
            universityId: uni._id,
            published: { $ne: false }, // Only count published courses
          });

          return {
            ...uni.toJSON(),
            country: uni.countryId, // Move populated country data to 'country' field
            countryId:
              typeof uni.countryId === "object"
                ? uni.countryId._id?.toString()
                : uni.countryId, // Keep original countryId
            courses: courseCount, // Add course count
          };
        })
      );

      universities = universitiesWithCounts;
    }

    return NextResponse.json({ universities });
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Parse form data to handle both JSON and file uploads
    const contentType = request.headers.get("content-type");
    let data: CreateUniversityData;
    let imageFile: File | null = null;

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Extract JSON data
      const jsonData = formData.get("data") as string;
      data = JSON.parse(jsonData);

      // Extract image file if present
      imageFile = formData.get("imageFile") as File | null;
    } else {
      data = await request.json();
    }

    // Validate required fields
    if (!data.name || !data.countryId || !data.location || !data.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify country exists
    const country = await Country.findById(data.countryId);
    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 400 });
    }

    // Check if university already exists in the same country
    const existingUniversity = await University.findOne({
      name: data.name,
      countryId: data.countryId,
    });

    if (existingUniversity) {
      return NextResponse.json(
        { error: "University with this name already exists in this country" },
        { status: 409 }
      );
    }

    // Handle image upload if there's a file
    if (imageFile) {
      const imageId = await handleImageUpload(
        imageFile,
        undefined,
        "university-images"
      );
      data.imageId = imageId;
    }

    const university = new University(data);
    await university.save();

    // Populate country data for response
    await university.populate("countryId", "name code flagImageId");

    const universityResponse = {
      ...university.toJSON(),
      country: university.countryId, // Move populated country data to 'country' field
      countryId:
        typeof university.countryId === "object"
          ? university.countryId._id?.toString()
          : university.countryId, // Keep original countryId
    };

    return NextResponse.json(
      { university: universityResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating university:", error);
    return NextResponse.json(
      { error: "Failed to create university" },
      { status: 500 }
    );
  }
}
