// import { NextRequest, NextResponse } from "next/server";

// const publicRoutes = [
//   "/features",
//   "/pricing",
//   "/about",
//   "/legal/terms",
//   "/legal/privacy",
//   "/demo",
//   "/",
//   "/rahnama-samane-test-hefz",
//   "/faq",
//   "/sitemap.xml",
//   "/robots.txt",
// ];

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
];

const authPages = [
  "/login",
  "/register",
  "/forgot",
  "/subscription-required",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔓 آزادسازی قطعی فایل‌های عمومی مهم
  if (
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // 🔓 بررسی مسیرهای عمومی
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // 🔐 بررسی سشن
  const hasSession = Boolean(
    req.cookies.get("__Secure-next-auth.session-token") ||
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-authjs.session-token") ||
    req.cookies.get("authjs.session-token")
  );

  // 📄 صفحات احراز هویت
  const isAuthPage = authPages.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthPage) {
    if (pathname === "/login" && hasSession) {
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");

      if (callbackUrl) {
        try {
          const decoded = decodeURIComponent(callbackUrl);
          return NextResponse.redirect(decoded || "/dashboard");
        } catch {
          return NextResponse.redirect(callbackUrl);
        }
      }

      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }

    return NextResponse.next();
  }

  // 🚫 اگر سشن ندارد → ریدایرکت به لاگین
  if (!hasSession) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};