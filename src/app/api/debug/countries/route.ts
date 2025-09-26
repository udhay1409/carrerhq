import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Country from "@/models/Country";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug: Starting countries debug endpoint");

    await connectToDatabase();
    console.log("✅ Database connected successfully");

    // Get all countries
    const countries = await Country.find({}).limit(20);
    console.log(`📊 Found ${countries.length} countries`);

    // Get URL search params
    const { searchParams } = new URL(request.url);
    const testSlug = searchParams.get("testSlug");

    let testResult = null;
    if (testSlug) {
      console.log(`🔎 Testing slug: ${testSlug}`);

      // Test different lookup methods
      const bySlug = await Country.findOne({ slug: testSlug });
      const byNameRegex = await Country.findOne({
        name: {
          $regex: new RegExp(`^${testSlug.replace(/-/g, "\\s+")}$`, "i"),
        },
      });
      const byExactName = await Country.findOne({
        name: { $regex: new RegExp(`^${testSlug}$`, "i") },
      });

      testResult = {
        testSlug,
        bySlug: bySlug ? { name: bySlug.name, id: bySlug._id } : null,
        byNameRegex: byNameRegex
          ? { name: byNameRegex.name, id: byNameRegex._id }
          : null,
        byExactName: byExactName
          ? { name: byExactName.name, id: byExactName._id }
          : null,
      };
    }

    const response = {
      success: true,
      environment: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? "SET" : "NOT_SET",
      countriesCount: countries.length,
      countries: countries.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug || null,
        published: c.published !== false,
        code: c.code || null,
      })),
      testResult,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Debug endpoint error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
