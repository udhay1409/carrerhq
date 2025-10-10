import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import type { CreateBlogPostData, BlogContent } from "@/types/blog";
import { handleImageUpload } from "@/lib/image-upload-utils";

// Allowed origins for production
const allowedOrigins = [
  "https://careerhq.in",
  "https://www.careerhq.in",
  "http://localhost:3000",
];

// Get CORS headers based on request origin
function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  const allowOrigin = isAllowedOrigin ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(request) });
}

// Helper function to calculate read time
function calculateReadTime(content: BlogContent[]): string {
  if (!content || !Array.isArray(content)) return "5 min read";

  const totalWords = content.reduce((count, section) => {
    if (section.text) {
      return count + section.text.split(/\s+/).length;
    }
    return count;
  }, 0);

  const wordsPerMinute = 200;
  const minutes = Math.ceil(totalWords / wordsPerMinute);

  return `${minutes} min read`;
}

interface BlogQuery {
  category?: { $regex: RegExp };
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  published?: boolean;
}

// GET /api/blog - Get all blog posts with optional filtering
export async function GET(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build query
    const query: BlogQuery = {};

    if (category && category !== "all") {
      query.category = { $regex: new RegExp(category.replace("-", " "), "i") };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Add published filter for public API calls
    // Only show published posts for public API, show all posts for admin
    const includeUnpublished =
      searchParams.get("includeUnpublished") === "true";
    if (!includeUnpublished) {
      // For public API, only show published posts
      query.published = true;
    }
    // For admin API (includeUnpublished=true), don't add any published filter

    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await BlogPost.countDocuments(query);

    return NextResponse.json(
      {
        posts: posts.map((post) => ({
          ...post,
          id: String(post._id),
          _id: undefined,
          readTime: calculateReadTime(post.content),
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST /api/blog - Create a new blog post
export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  try {
    await connectToDatabase();

    // Parse form data to handle both JSON and file uploads
    const contentType = request.headers.get("content-type");
    let data: CreateBlogPostData;
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

    // Validate required fields (excluding imageId since it might be uploaded now)
    const requiredFields = [
      "title",
      "excerpt",
      "content",
      "author",
      "authorRole",
      "category",
    ];
    for (const field of requiredFields) {
      if (!data[field as keyof CreateBlogPostData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Handle image upload if there's a file
    if (imageFile) {
      const imageId = await handleImageUpload(
        imageFile,
        undefined,
        "blog-images"
      );
      if (imageId) {
        data.imageId = imageId;
      }
    }

    // Validate that we have an imageId (either from file upload or existing data)
    if (!data.imageId) {
      return NextResponse.json(
        { error: "Featured image is required" },
        { status: 400 }
      );
    }

    // Generate date if not provided
    const postData = {
      ...data,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    const blogPost = new BlogPost(postData);
    await blogPost.save();

    return NextResponse.json(blogPost.toJSON(), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500, headers: corsHeaders }
    );
  }
}
