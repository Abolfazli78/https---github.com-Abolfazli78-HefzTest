import { NextRequest, NextResponse } from "next/server";

// Define fully public routes that should bypass authentication checks
const publicRoutes = [
  "/features",
  "/pricing",
  "/about",
  "/legal/terms",
  "/legal/privacy",
  // Preserve current behavior for the landing page
  "/",
];

// Auth-related pages that must remain accessible to avoid redirect loops
const authPages = [
  "/login",
  "/register",
  "/forgot",
  "/subscription-required",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public pages and nested paths (if any)
  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (isPublic) {
    return NextResponse.next();
  }

  // Always allow auth-related pages
  const isAuthPage = authPages.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (isAuthPage) {
    return NextResponse.next();
  }

  // For all other matched pages, enforce authentication (Edge-safe cookie check)
  const hasSession = Boolean(
    req.cookies.get("__Secure-next-auth.session-token") ||
    req.cookies.get("next-auth.session-token")
  );
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url);
    // Preserve original destination for post-login redirect
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Exclude API routes and Next.js internal/static assets from the middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};