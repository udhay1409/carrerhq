import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import type { CreateBlogPostData, BlogContent } from "@/types/blog";
import {
  handleImageUpload,
  deleteImageFromCloudinary,
} from "@/lib/image-upload-utils";

// Type for MongoDB lean query result
interface BlogPostLeanDocument {
  _id: string;
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

// GET /api/blog/[id] - Get a single blog post by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const post = (await BlogPost.findById(
      id
    ).lean()) as BlogPostLeanDocument | null;

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...post,
      id: String(post._id),
      _id: undefined,
      readTime: calculateReadTime(post.content),
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Parse form data to handle both JSON and file uploads
    const contentType = request.headers.get("content-type");
    let data: Partial<CreateBlogPostData>;
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

    // Find the existing post
    const existingPost = await BlogPost.findById(id);

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Handle image upload if there's a new file
    if (imageFile) {
      const newImageId = await handleImageUpload(
        imageFile,
        existingPost.imageId,
        "blog-images"
      );
      data.imageId = newImageId;
    }

    // Update the post with new data
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      ...updatedPost.toJSON(),
      id: String(updatedPost._id),
      _id: undefined,
      readTime: calculateReadTime(updatedPost.content),
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Delete a blog post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Find the post first to get the image ID
    const post = await BlogPost.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete the image from Cloudinary if it exists
    if (post.imageId) {
      await deleteImageFromCloudinary(post.imageId);
    }

    // Delete the post from database
    await BlogPost.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
