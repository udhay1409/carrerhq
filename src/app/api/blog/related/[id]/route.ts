import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { BlogContent } from "@/types/blog";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Type for MongoDB lean query result
interface BlogPostLeanDocument {
  _id: unknown;
  title: string;
  excerpt: string;
  content: BlogContent[];
  imageId: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

// GET /api/blog/related/[id] - Get related blog posts
async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "3");

    // First, get the current post to find related posts
    const currentPost = await BlogPost.findById(id);

    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Find related posts based on category, excluding the current post
    const relatedPosts = (await BlogPost.find({
      _id: { $ne: id },
      category: currentPost.category,
      published: { $ne: false }, // Only published posts
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()) as unknown as BlogPostLeanDocument[];

    // If we don't have enough related posts from the same category,
    // fill with other recent posts
    if (relatedPosts.length < limit) {
      const additionalPosts = (await BlogPost.find({
        _id: {
          $ne: id,
          $nin: relatedPosts.map((post) => post._id),
        },
        published: { $ne: false },
      })
        .sort({ createdAt: -1 })
        .limit(limit - relatedPosts.length)
        .lean()) as unknown as BlogPostLeanDocument[];

      relatedPosts.push(...additionalPosts);
    }

    // Transform the posts for frontend
    const transformedPosts = relatedPosts.map((post) => {
      return {
        ...post,
        id: String(post._id),
        _id: undefined,
        readTime: calculateReadTime(post.content),
      };
    });

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch related posts" },
      { status: 500 }
    );
  }
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

export { GET };
