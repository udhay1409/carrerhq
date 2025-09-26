import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import University from "@/models/University";
import {
  handleImageUpload,
  deleteImageFromCloudinary,
} from "@/lib/image-upload-utils";
import { CreateUniversityData } from "@/types/education";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && !!id.match(/^[0-9a-fA-F]{24}$/);
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;
    let university = null;

    // First try direct ID lookup if it's a valid ObjectId
    if (isValidObjectId(id)) {
      university = await University.findById(id).populate(
        "countryId",
        "name code flagImageId"
      );
    }

    // If not found by ID or not a valid ObjectId, try slug lookup
    if (!university) {
      university = await University.findOne({ slug: id }).populate(
        "countryId",
        "name code flagImageId"
      );
    }

    // If still not found by slug, try to find by name (for backward compatibility)
    if (!university) {
      // Convert slug back to potential name format for fallback
      const potentialName = id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      university = await University.findOne({
        name: { $regex: new RegExp(`^${potentialName}$`, "i") },
      }).populate("countryId", "name code flagImageId");
    }

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Transform the data to match the expected interface
    const universityResponse = {
      ...university.toJSON(),
      country: university.countryId, // Move populated country data to 'country' field
      countryId: university.countryId?._id?.toString() || university.countryId, // Keep original countryId
    };

    return NextResponse.json({ university: universityResponse });
  } catch (error) {
    console.error("Error fetching university:", error);
    return NextResponse.json(
      { error: "Failed to fetch university" },
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
    let data: Partial<CreateUniversityData>;
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

    // Find the existing university by ID or slug
    let existingUniversity = null;

    if (isValidObjectId(id)) {
      existingUniversity = await University.findById(id);
    }

    if (!existingUniversity) {
      existingUniversity = await University.findOne({ slug: id });
    }

    // Fallback to name-based search if slug not found
    if (!existingUniversity) {
      const potentialName = id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      existingUniversity = await University.findOne({
        name: { $regex: new RegExp(`^${potentialName}$`, "i") },
      });
    }

    if (!existingUniversity) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Handle image upload if there's a new file
    if (imageFile) {
      const newImageId = await handleImageUpload(
        imageFile,
        existingUniversity.imageId,
        "university-images"
      );
      data.imageId = newImageId;
    }

    // Update the university using the actual _id
    const university = await University.findByIdAndUpdate(
      existingUniversity._id,
      data,
      {
        new: true,
        runValidators: true,
      }
    ).populate("countryId", "name code flagImageId");

    // Transform the data to match the expected interface
    const universityResponse = {
      ...university.toJSON(),
      country: university.countryId, // Move populated country data to 'country' field
      countryId: university.countryId?._id?.toString() || university.countryId, // Keep original countryId
    };

    return NextResponse.json({ university: universityResponse });
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json(
      { error: "Failed to update university" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Find the university by ID or slug first to get the image ID
    let university = null;

    if (isValidObjectId(id)) {
      university = await University.findById(id);
    }

    if (!university) {
      university = await University.findOne({ slug: id });
    }

    // Fallback to name-based search if slug not found
    if (!university) {
      const potentialName = id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      university = await University.findOne({
        name: { $regex: new RegExp(`^${potentialName}$`, "i") },
      });
    }

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Delete the image from Cloudinary if it exists
    if (university.imageId) {
      await deleteImageFromCloudinary(university.imageId);
    }

    // Delete the university from database using the actual _id
    await University.findByIdAndDelete(university._id);

    return NextResponse.json({ message: "University deleted successfully" });
  } catch (error) {
    console.error("Error deleting university:", error);
    return NextResponse.json(
      { error: "Failed to delete university" },
      { status: 500 }
    );
  }
}
