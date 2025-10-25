import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Allowed origins for production
const allowedOrigins = [
  "https://careerhq.in",
  "https://www.careerhq.in",
  "http://localhost:3000", // For local development
];

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const url = request.nextUrl.clone();

  // Redirect www to non-www for consistency (prevents CORS issues)
  if (
    hostname === "www.careerhq.in" &&
    !request.nextUrl.pathname.startsWith("/api/")
  ) {
    url.hostname = "careerhq.in";
    return NextResponse.redirect(url, { status: 301 });
  }

  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    // Determine which origin to allow
    const allowOrigin = isAllowedOrigin ? origin : allowedOrigins[0];

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": allowOrigin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Add CORS headers to all API responses
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", allowOrigin);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
