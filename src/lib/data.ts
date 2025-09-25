import type { BlogPost, BlogCategory } from "@/types/blog";
import type { Country } from "@/types/education";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000";

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json();
}

// Helper function to transform course data with robust validation

// Get all blog posts with optional filtering
export async function getAllBlogPosts(options?: {
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
  includeUnpublished?: boolean;
}): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams();

    if (options?.category && options.category !== "all") {
      params.append("category", options.category);
    }
    if (options?.search) params.append("search", options.search);
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.page) params.append("page", options.page.toString());
    if (options?.includeUnpublished)
      params.append("includeUnpublished", "true");

    const url = `${API_BASE_URL}/api/blog${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response = await fetch(url, {
      cache: "no-store", // Ensure fresh data on every request
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

    const data = await handleApiResponse<{ posts: BlogPost[] }>(response);
    return data.posts.map(addComputedFields);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// Admin-specific function to get all posts including drafts
export async function getAllBlogPostsForAdmin(options?: {
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
}): Promise<BlogPost[]> {
  return getAllBlogPosts({
    ...options,
    includeUnpublished: true,
  });
}

// Helper function to add computed fields to blog posts
function addComputedFields(post: BlogPost): BlogPost {
  return {
    ...post,
    // Add default author image if not provided
    authorImageId: post.authorImageId || "/images/default-avatar.svg",
    // readTime should come from API, but fallback if missing
    readTime: post.readTime || "5 min read",
  };
}

// Get a single blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/${id}`, {
      cache: "no-store", // Ensure fresh data on every request
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

    if (response.status === 404) {
      return null;
    }

    const post = await handleApiResponse<BlogPost>(response);
    return addComputedFields(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Get related blog posts
export async function getRelatedBlogPosts(
  postId: string,
  limit = 3
): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/blog/related/${postId}?limit=${limit}`,
      {
        cache: "no-store", // Ensure fresh data on every request
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );

    const posts = await handleApiResponse<BlogPost[]>(response);
    return posts.map(addComputedFields);
  } catch (error) {
    console.error("Error fetching related blog posts:", error);
    return [];
  }
}

// Get all blog categories
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/categories`, {
      cache: "no-store", // Ensure fresh data on every request
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

    return await handleApiResponse<BlogCategory[]>(response);
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [{ id: "all", name: "All" }];
  }
}

// Client-side functions for CRUD operations
export const blogApi = {
  // Create a new blog post
  async createPost(
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
  ): Promise<BlogPost> {
    const response = await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    return await handleApiResponse<BlogPost>(response);
  },

  // Update an existing blog post
  async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
    const response = await fetch(`/api/blog/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    return await handleApiResponse<BlogPost>(response);
  },

  // Delete a blog post
  async deletePost(id: string): Promise<{ message: string }> {
    const response = await fetch(`/api/blog/${id}`, {
      method: "DELETE",
    });

    return await handleApiResponse<{ message: string }>(response);
  },

  // Create a new category
  async createCategory(name: string): Promise<BlogCategory> {
    const response = await fetch("/api/blog/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    return await handleApiResponse<BlogCategory>(response);
  },
};

// Course-related functions using real API data

export async function getCountries(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/countries`, {
      cache: "no-store", // Ensure fresh data on every request
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const data = await response.json();
    const countries = data.countries || [];

    // Return array of country codes/names as expected by the component
    return countries.map(
      (country: Country) =>
        country.code?.toLowerCase() ||
        country.name.toLowerCase().replace(/\s+/g, "-")
    );
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}
