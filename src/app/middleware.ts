// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only apply middleware to API routes that need JWT auth (not NextAuth)
export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;

  // Skip NextAuth routes and public API routes
  if (url.startsWith("/api/auth") || url.startsWith("/api/public")) {
    return NextResponse.next();
  }

  // For other API routes, you can still enforce JWT if needed
  // or remove this block entirely if using NextAuth sessions
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"], // all API routes
};
