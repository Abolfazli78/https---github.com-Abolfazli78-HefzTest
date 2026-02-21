import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const hasSession = Boolean(
    request.cookies.get("__Secure-next-auth.session-token") ||
    request.cookies.get("next-auth.session-token")
  );
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // Allow access to public routes
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot",
    "/features",
    "/pricing",
    "/about",
    "/legal/terms",
    "/legal/privacy",
  ];
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route handling is enforced in page-level code; proceed

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
