import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // Allow access to public routes
  const publicRoutes = ["/", "/login", "/register", "/forgot"];
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect non-admin users trying to access admin routes
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
