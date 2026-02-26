// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // ✅ مسیرهایی که هرگز نباید ریدایرکت شوند
//   if (
//     pathname.startsWith("/login") ||
//     pathname.startsWith("/register") ||
//     pathname.startsWith("/api/auth") ||
//     pathname.startsWith("/sitemap.xml") ||
//     pathname.startsWith("/robots.txt") ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/favicon.ico")
//   ) {
//     return NextResponse.next();
//   }

//   // ✅ فقط این مسیرها خصوصی هستند
//   const isPrivateRoute =
//     pathname.startsWith("/dashboard") ||
//     pathname.startsWith("/panel") ||
//     pathname.startsWith("/admin");

//   if (!isPrivateRoute) {
//     return NextResponse.next();
//   }

//   // بررسی سشن
//   const hasSession = Boolean(
//     req.cookies.get("__Secure-next-auth.session-token") ||
//       req.cookies.get("next-auth.session-token") ||
//       req.cookies.get("__Secure-authjs.session-token") ||
//       req.cookies.get("authjs.session-token")
//   );

//   if (!hasSession) {
//     const loginUrl = new URL("/login", req.nextUrl.origin);
//     loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/:path*"],
// };
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/api/auth",
  "/sitemap.xml",
  "/robots.txt",
  "/_next",
  "/favicon.ico",
];

const PRIVATE_PREFIXES = ["/dashboard", "/panel", "/admin", "/teacher", "/institute"];

export function middleware(req: NextRequest) {
  const { pathname, href, origin } = req.nextUrl;

  // Public routes bypass middleware
  if (
    PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    )
  ) {
    return NextResponse.next();
  }

  const isPrivateRoute = PRIVATE_PREFIXES.some((p) =>
    pathname === p || pathname.startsWith(p + "/")
  );

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  const hasSession = Boolean(
    req.cookies.get("__Secure-next-auth.session-token") ||
      req.cookies.get("next-auth.session-token") ||
      req.cookies.get("__Secure-authjs.session-token") ||
      req.cookies.get("authjs.session-token")
  );

  if (!hasSession) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};