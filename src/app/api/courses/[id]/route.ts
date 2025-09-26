import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import { logApiError, log404Error } from "@/utils/errorUtils";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && !!id.match(/^[0-9a-fA-F]{24}$/);
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;
    let course = null;

    // First try direct ID lookup if it's a valid ObjectId
    if (isValidObjectId(id)) {
      course = await Course.findById(id)
        .populate("universityId", "name location ranking website")
        .populate("countryId", "name code currency flagImageId");
    }

    // If not found by ID or not a valid ObjectId, try slug lookup
    if (!course) {
      course = await Course.findOne({
        slug: id,
        published: { $ne: false },
      })
        .populate("universityId", "name location ranking website")
        .populate("countryId", "name code currency flagImageId");
    }

    if (!course) {
      log404Error("Course", id, {
        lookupType: isValidObjectId(id) ? "id" : "slug",
      });
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Transform the data to match the expected interface
    const courseResponse = {
      ...course.toJSON(),
      university: course.universityId, // Move populated university data to 'university' field
      country: course.countryId, // Move populated country data to 'country' field
      universityId: course.universityId?._id?.toString() || course.universityId, // Keep original universityId
      countryId: course.countryId?._id?.toString() || course.countryId, // Keep original countryId
    };

    return NextResponse.json({ course: courseResponse });
  } catch (error) {
    logApiError(error as Error, "GET /api/courses/[id]", {
      id: (await params).id,
    });
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const data = await request.json();

    // Find the existing course by ID or slug
    let existingCourse = null;

    if (isValidObjectId(id)) {
      existingCourse = await Course.findById(id);
    }

    if (!existingCourse) {
      // Find by slug if not found by ID
      existingCourse = await Course.findOne({ slug: id });
    }

    if (!existingCourse) {
      log404Error("Course", id, {
        lookupType: isValidObjectId(id) ? "id" : "slug",
      });
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Update the course using the actual _id
    const course = await Course.findByIdAndUpdate(existingCourse._id, data, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "universityId", select: "name location ranking website" },
      { path: "countryId", select: "name code currency flagImageId" },
    ]);

    // Transform the data to match the expected interface
    const courseResponse = {
      ...course.toJSON(),
      university: course.universityId, // Move populated university data to 'university' field
      country: course.countryId, // Move populated country data to 'country' field
      universityId: course.universityId?._id?.toString() || course.universityId, // Keep original universityId
      countryId: course.countryId?._id?.toString() || course.countryId, // Keep original countryId
    };

    return NextResponse.json({ course: courseResponse });
  } catch (error) {
    logApiError(error as Error, "PUT /api/courses/[id]", {
      id: (await params).id,
    });
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Find the course by ID or slug first
    let course = null;

    if (isValidObjectId(id)) {
      course = await Course.findById(id);
    }

    if (!course) {
      // Find by slug if not found by ID
      course = await Course.findOne({ slug: id });
    }

    if (!course) {
      log404Error("Course", id, {
        lookupType: isValidObjectId(id) ? "id" : "slug",
      });
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Delete the course from database using the actual _id
    await Course.findByIdAndDelete(course._id);

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    logApiError(error as Error, "DELETE /api/courses/[id]", {
      id: (await params).id,
    });
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
