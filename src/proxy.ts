import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/features",
  "/pricing",
  "/about",
  "/legal/terms",
  "/legal/privacy",
  "/demo",
  "/",
  "/rahnama-samane-test-hefz",
  "/faq",
    // ✅ Blog
  "/blog",

  // ✅ SEO Files
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.json",
  "/favicon.ico",

  // ✅ Logo or public assets
  "/logo2.png",
  "/logo.png"

];

const authPages = [
  "/login",
  "/register",
  "/forgot",
  "/subscription-required",
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (isPublic) {
    return NextResponse.next();
  }

  const hasSession = Boolean(
    request.cookies.get("__Secure-next-auth.session-token") ||
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-authjs.session-token") ||
    request.cookies.get("authjs.session-token")
  );

  const isAuthPage = authPages.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (isAuthPage) {
    if (pathname === "/login" && hasSession) {
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
      if (callbackUrl) {
        try {
          const decoded = decodeURIComponent(callbackUrl);
          return NextResponse.redirect(decoded || "/dashboard");
        } catch {
          return NextResponse.redirect(callbackUrl);
        }
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
