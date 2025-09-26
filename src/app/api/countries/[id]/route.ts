import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Country from "@/models/Country";
import type { CreateCountryData } from "@/types/education";
import {
  handleImageUpload,
  deleteImageFromCloudinary,
} from "@/lib/image-upload-utils";
import { findEntityBySlugOrId, generateSlug } from "@/lib/slug-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  let countryId: string | undefined;

  try {
    console.log("🔍 API: Starting country lookup", {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });

    await connectToDatabase();
    console.log("✅ Database connected successfully");

    const { id } = await params;
    countryId = id;

    console.log("📝 API: Processing request", {
      countryId: id,
      idType: typeof id,
      idLength: id?.length,
      trimmed: id?.trim(),
    });

    // Validate route parameter (Requirement 4.1)
    if (!id || typeof id !== "string" || id.trim() === "") {
      console.log("❌ Invalid country identifier provided:", id);
      return NextResponse.json(
        { error: "Invalid country identifier provided" },
        { status: 400 }
      );
    }

    const trimmedId = id.trim();
    console.log("🔎 Looking up country:", {
      originalId: id,
      trimmedId,
      isObjectId: trimmedId.match(/^[0-9a-fA-F]{24}$/),
    });

    // Use the utility function to find by either ID or slug (Requirements 5.1, 5.2)
    const country = await findEntityBySlugOrId(Country, trimmedId, "name");

    console.log("🔍 Country lookup result:", {
      found: !!country,
      countryName: country?.name,
      countryId: country?._id || country?.id,
      published: country?.published,
    });

    // Return 404 if country not found (Requirements 1.2, 4.2, 5.4)
    if (!country) {
      console.log("❌ Country not found in database:", trimmedId);
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    // Only return published countries unless explicitly requested
    if (country.published === false) {
      console.log("❌ Country found but not published:", {
        countryName: country.name,
        published: country.published,
      });
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    const responseTime = Date.now() - startTime;
    console.log("✅ Country found and returned:", {
      countryName: country.name,
      responseTime: `${responseTime}ms`,
    });

    return NextResponse.json({ country });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Enhanced error logging with more context
    console.error("💥 API Error fetching country:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      countryId,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? "SET" : "NOT_SET",
    });

    return NextResponse.json(
      {
        error: "Failed to fetch country",
        ...(process.env.NODE_ENV === "development" && {
          details: error instanceof Error ? error.message : String(error),
        }),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Parse form data to handle both JSON and file uploads
    const contentType = request.headers.get("content-type");
    let data: Partial<CreateCountryData>;
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

    // Find the existing country
    const existingCountry = await Country.findById(id);
    if (!existingCountry) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    // Handle main image upload if there's a new file
    if (imageFile) {
      const newImageId = await handleImageUpload(
        imageFile,
        existingCountry.imageId,
        "country-images"
      );
      data.imageId = newImageId;
    }

    // Handle flag image upload if there's a new file
    if (flagImageFile) {
      const newFlagImageId = await handleImageUpload(
        flagImageFile,
        existingCountry.flagImageId,
        "country-flags"
      );
      data.flagImageId = newFlagImageId;
    }

    // Update slug if name is being changed and no explicit slug provided
    if (data.name && !data.slug) {
      data.slug = generateSlug(data.name);
    }

    // Update the country
    const country = await Country.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ country });
  } catch (error) {
    console.error("Error updating country:", error);
    return NextResponse.json(
      { error: "Failed to update country" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Find the country first to get the image ID
    const country = await Country.findById(id);
    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    // Delete images from Cloudinary if they exist
    if (country.imageId) {
      await deleteImageFromCloudinary(country.imageId);
    }
    if (country.flagImageId) {
      await deleteImageFromCloudinary(country.flagImageId);
    }

    // Delete the country from database
    await Country.findByIdAndDelete(id);

    return NextResponse.json({ message: "Country deleted successfully" });
  } catch (error) {
    console.error("Error deleting country:", error);
    return NextResponse.json(
      { error: "Failed to delete country" },
      { status: 500 }
    );
  }
}
