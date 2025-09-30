import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

// GET /api/blog/categories - Get all unique categories
async function GET() {
  try {
    await connectToDatabase();

    // Get all unique categories from blog posts
    const categories = await BlogPost.distinct("category");

    // Filter out invalid categories (ObjectIds, empty strings, etc.)
    const validCategories = categories.filter((category: string) => {
      // Check if it's a valid category name (not an ObjectId)
      return (
        category &&
        typeof category === "string" &&
        category.trim() !== "" &&
        !category.match(/^[0-9a-fA-F]{24}$/) // Not a MongoDB ObjectId
      );
    });

    // If no valid categories found, return default categories
    if (validCategories.length === 0) {
      const defaultCategories = [
        { id: "all", name: "All" },
        // { id: "study-abroad", name: "Study Abroad" },
        // { id: "scholarships", name: "Scholarships" },
        // { id: "visa", name: "Visa" },
        // { id: "application-tips", name: "Application Tips" },
        // { id: "student-life", name: "Student Life" },
        // { id: "career", name: "Career" },
        // { id: "test-preparation", name: "Test Preparation" },
      ];
      return NextResponse.json(defaultCategories);
    }

    // Format categories for frontend
    const formattedCategories = [
      { id: "all", name: "All" },
      ...validCategories.map((category: string) => ({
        id: category.toLowerCase().replace(/\s+/g, "-"),
        name: category,
      })),
    ];

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/blog/categories - Create a new category (for admin use)
async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await BlogPost.findOne({
      category: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    // Return the new category format
    const newCategory = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name,
    };

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export { GET, POST };
