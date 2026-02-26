 

// const authPages = [
//   "/login",
//   "/register",
//   "/forgot",
//   "/subscription-required",
// ];

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
//   if (isPublic) {
//     return NextResponse.next();
//   }

//   const hasSession = Boolean(
//     req.cookies.get("__Secure-next-auth.session-token") ||
//     req.cookies.get("next-auth.session-token") ||
//     req.cookies.get("__Secure-authjs.session-token") ||
//     req.cookies.get("authjs.session-token")
//   );

//   const isAuthPage = authPages.some((route) => pathname === route || pathname.startsWith(`${route}/`));
//   if (isAuthPage) {
//     if (pathname === "/login" && hasSession) {
//       const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
//       if (callbackUrl) {
//         try {
//           const decoded = decodeURIComponent(callbackUrl);
//           return NextResponse.redirect(decoded || "/dashboard");
//         } catch {
//           return NextResponse.redirect(callbackUrl);
//         }
//       }
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }
//     return NextResponse.next();
//   }

//   if (!hasSession) {
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.url;
//     const loginUrl = new URL("/login", baseUrl);
//     loginUrl.searchParams.set("callbackUrl", req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//         "/((?!api|_next|favicon.ico|sitemap.xml|robots.txt|.*\\.(png|jpg|jpeg|svg|webp)$).*)",
//   ],
// };
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   if (!token) {
//     if (
//       req.headers.get("next-router-prefetch") === "1" ||
//       req.headers.get("purpose") === "prefetch" ||
//       req.method === "HEAD"
//     ) {
//       return NextResponse.next();
//     }
//     const loginUrl = new URL("/login", req.nextUrl.origin);
//     const callbackUrl = req.nextUrl.clone();
//     callbackUrl.searchParams.delete("callbackUrl");
//     loginUrl.searchParams.set("callbackUrl", callbackUrl.href);
//     return NextResponse.redirect(loginUrl);
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/panel/:path*", "/admin/:path*"],
// };
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ مسیرهایی که هرگز نباید ریدایرکت شوند
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ✅ فقط این مسیرها خصوصی هستند
  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/panel") ||
    pathname.startsWith("/admin");

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  // بررسی سشن
  const hasSession = Boolean(
    req.cookies.get("__Secure-next-auth.session-token") ||
      req.cookies.get("next-auth.session-token") ||
      req.cookies.get("__Secure-authjs.session-token") ||
      req.cookies.get("authjs.session-token")
  );

  if (!hasSession) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};