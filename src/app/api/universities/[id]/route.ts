import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import University from "@/models/University";
import {
  handleImageUpload,
  deleteImageFromCloudinary,
} from "@/lib/image-upload-utils";
import { CreateUniversityData } from "@/types/education";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const university = await University.findById(id).populate(
      "countryId",
      "name code flagImageId"
    );

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

    // Find the existing university
    const existingUniversity = await University.findById(id);
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

    // Update the university
    const university = await University.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("countryId", "name code flagImageId");

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

    // Find the university first to get the image ID
    const university = await University.findById(id);
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

    // Delete the university from database
    await University.findByIdAndDelete(id);

    return NextResponse.json({ message: "University deleted successfully" });
  } catch (error) {
    console.error("Error deleting university:", error);
    return NextResponse.json(
      { error: "Failed to delete university" },
      { status: 500 }
    );
  }
}
