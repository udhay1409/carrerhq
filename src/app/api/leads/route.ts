import { connectToDatabase } from "@/lib/mongodb";
import { Lead } from "@/models/lead";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const lead = await Lead.create(data);
    return NextResponse.json({ lead });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create lead " },
      { status: 500 }
    );
  }
}

interface LeadQuery {
  status?: string;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    await connectToDatabase();

    // Build query
    const query: LeadQuery = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { program: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count
    const total = await Lead.countDocuments(query);

    // Get paginated results
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      leads,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
