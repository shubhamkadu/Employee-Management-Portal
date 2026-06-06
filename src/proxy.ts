import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === "/login";
  const isPublicPath = pathname === "/" || isAuthPage;
  const isStaticAsset =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".");

  // Allow static assets and API routes
  if (isStaticAsset) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login (only for protected pages)
  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page
  if (token && isAuthPage) {
    const employeesUrl = new URL("/employees", request.url);
    return NextResponse.redirect(employeesUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$).*)",
  ],
};
