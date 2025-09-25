import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Country from "@/models/Country";
import type { CreateCountryData } from "@/types/education";
import {
  handleImageUpload,
  deleteImageFromCloudinary,
} from "@/lib/image-upload-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const country = await Country.findById(id);

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }

    return NextResponse.json({ country });
  } catch (error) {
    console.error("Error fetching country:", error);
    return NextResponse.json(
      { error: "Failed to fetch country" },
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
