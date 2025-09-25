import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Country from "@/models/Country";
import University from "@/models/University";
import Course from "@/models/Course";
import type { CreateCountryData } from "@/types/education";
import { handleImageUpload } from "@/lib/image-upload-utils";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const includeCounts = searchParams.get("includeCounts") === "true";
    const includeUnpublished =
      searchParams.get("includeUnpublished") === "true";

    // Build query - by default only show published countries
    const query = includeUnpublished ? {} : { published: { $ne: false } };

    // Get countries based on query
    const countries = await Country.find(query).sort({ name: 1 });

    if (includeCounts) {
      // Calculate counts for each country
      const countriesWithCounts = await Promise.all(
        countries.map(async (country) => {
          const universityCount = await University.countDocuments({
            countryId: country._id,
            published: { $ne: false }, // Only count published universities
          });
          const courseCount = await Course.countDocuments({
            countryId: country._id,
            published: { $ne: false }, // Only count published courses
          });

          return {
            ...country.toJSON(),
            universities: universityCount,
            courses: courseCount,
          };
        })
      );

      return NextResponse.json({ countries: countriesWithCounts });
    }

    return NextResponse.json({ countries });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Parse form data to handle both JSON and file uploads
    const contentType = request.headers.get("content-type");
    let data: CreateCountryData;
    let imageFile: File | null = null;
    let flagImageFile: File | null = null;

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Extract JSON data
      const jsonData = formData.get("data") as string;
      data = JSON.parse(jsonData);

      // Extract image files if present
      imageFile = formData.get("imageFile") as File | null;
      flagImageFile = formData.get("flagImageFile") as File | null;
    } else {
      data = await request.json();
    }

    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: "Country name is required" },
        { status: 400 }
      );
    }

    // Check if country already exists
    const existingCountry = await Country.findOne({
      name: { $regex: new RegExp(`^${data.name}`, "i") },
    });

    if (existingCountry) {
      return NextResponse.json(
        { error: "Country with this name already exists" },
        { status: 409 }
      );
    }

    // Handle main image upload if there's a file
    if (imageFile) {
      const imageId = await handleImageUpload(
        imageFile,
        undefined,
        "country-images"
      );
      data.imageId = imageId;
    }

    // Handle flag image upload if there's a file
    if (flagImageFile) {
      const flagImageId = await handleImageUpload(
        flagImageFile,
        undefined,
        "country-flags"
      );
      data.flagImageId = flagImageId;
    }

    const country = new Country(data);
    await country.save();

    return NextResponse.json({ country }, { status: 201 });
  } catch (error) {
    console.error("Error creating country:", error);
    return NextResponse.json(
      { error: "Failed to create country" },
      { status: 500 }
    );
  }
}
