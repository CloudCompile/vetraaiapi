import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  // Graceful degradation: skip Kinde auth if not configured
  if (!process.env.KINDE_CLIENT_ID || !process.env.KINDE_CLIENT_SECRET) {
    return NextResponse.next();
  }
  return withAuth(req, {
    isReturnToCurrentPage: true,
  });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};