// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  // Only apply middleware to /api routes
  if (req.nextUrl.pathname.startsWith("/api")) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      // Attach userId to headers for API routes
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", decoded.id);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (_err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  // For non-API routes, continue normally
  return NextResponse.next();
}

// Ensure middleware only runs for API routes
export const config = {
  matcher: ["/api/:path*"],
};
