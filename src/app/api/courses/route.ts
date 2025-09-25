import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import University from "@/models/University";
import Country from "@/models/Country";
import type { CreateCourseData } from "@/types/education";

interface CourseQuery {
  countryId?: string;
  universityId?: string;
  studyLevel?: string;
  $text?: { $search: string };
  published?: { $ne: boolean };
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");
    const universityId = searchParams.get("universityId");
    const studyLevel = searchParams.get("studyLevel");
    const populate = searchParams.get("populate") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const includeUnpublished =
      searchParams.get("includeUnpublished") === "true";

    const query: CourseQuery = {};

    if (countryId) query.countryId = countryId;
    if (universityId) query.universityId = universityId;
    if (studyLevel) query.studyLevel = studyLevel;
    if (search) {
      query.$text = { $search: search };
    }

    // By default only show published courses
    if (!includeUnpublished) {
      query.published = { $ne: false };
    }

    const skip = (page - 1) * limit;

    let coursesQuery = Course.find(query)
      .sort(search ? { score: { $meta: "textScore" } } : { programName: 1 })
      .skip(skip)
      .limit(limit);

    if (populate) {
      coursesQuery = coursesQuery
        .populate("universityId", "name location ranking")
        .populate("countryId", "name code flagImageId");
    }

    const [coursesResult, total] = await Promise.all([
      coursesQuery,
      Course.countDocuments(query),
    ]);

    // Transform the data to match the expected interface
    const courses = populate
      ? coursesResult.map((course) => ({
          ...course.toJSON(),
          university: course.universityId, // Move populated university data to 'university' field
          country: course.countryId, // Move populated country data to 'country' field
          universityId:
            course.universityId?._id?.toString() || course.universityId, // Keep original universityId
          countryId: course.countryId?._id?.toString() || course.countryId, // Keep original countryId
        }))
      : coursesResult;

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const data: CreateCourseData = await request.json();

    // Validate required fields
    const requiredFields = [
      "universityId",
      "countryId",
      "programName",
      "studyLevel",
      "campus",
      "duration",
      "openIntakes",
      "intakeYear",
      "entryRequirements",
      "ieltsScore",
      "ieltsNoBandLessThan",
      "yearlyTuitionFees",
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof CreateCourseData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Verify university and country exist
    const [university, country] = await Promise.all([
      University.findById(data.universityId),
      Country.findById(data.countryId),
    ]);

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 400 }
      );
    }

    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 400 });
    }

    // Verify university belongs to the country
    if (university.countryId.toString() !== data.countryId) {
      return NextResponse.json(
        { error: "University does not belong to the specified country" },
        { status: 400 }
      );
    }

    const course = new Course(data);
    await course.save();

    // Populate related data for response
    await course.populate([
      { path: "universityId", select: "name location ranking" },
      { path: "countryId", select: "name code flagImageId" },
    ]);

    // Transform the data to match the expected interface
    const courseResponse = {
      ...course.toJSON(),
      university: course.universityId, // Move populated university data to 'university' field
      country: course.countryId, // Move populated country data to 'country' field
      universityId: course.universityId?._id?.toString() || course.universityId, // Keep original universityId
      countryId: course.countryId?._id?.toString() || course.countryId, // Keep original countryId
    };

    return NextResponse.json({ course: courseResponse }, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
