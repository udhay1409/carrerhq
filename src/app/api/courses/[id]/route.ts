import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const course = await Course.findById(id)
      .populate("universityId", "name location ranking website")
      .populate("countryId", "name code currency flagImageId");

    if (!course) {
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
    console.error("Error fetching course:", error);
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

    const course = await Course.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "universityId", select: "name location ranking" },
      { path: "countryId", select: "name code flagImageId" },
    ]);

    if (!course) {
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
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
