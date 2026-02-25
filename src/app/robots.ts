import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://hefztest.ir";

  return {
    rules: [
      {
        userAgent: "*",
        // Public marketing and informational pages that should be indexed
        allow: [
          "/",
          "/features",
          "/pricing",
          "/faq",
          "/contact",
          "/demo",
          "/about",
          "/legal/privacy",
          "/legal/terms",
          "/azmoon-online-hifz-quran",
          "/bank-soal-azmoon-hifz",
          "/gozaresh-pishraft-hafizan-quran",
          "/rahnama-azmoon-hifz-quran",
          "/rahnama-samane-test-hefz",
          "/hefz-5-joz",
          "/hefz-10-joz",
          "/hefz-20-joz",
          "/hefz-kamel",
        ],
        // Auth-required dashboards and exam flows that should not be indexed
        disallow: [
          // Auth flows (also covered by (auth) layout robots, but duplicated here for clarity)
          "/login",
          "/register",
          "/forgot",
          // User dashboard and related private pages
          "/dashboard",
          "/dashboard/*",
          "/exams",
          "/exams/*",
          "/history",
          "/leaderboard",
          "/subscriptions",
          "/support",
          "/settings",
          // Teacher area
          "/teacher",
          "/teacher/*",
          // Institute area
          "/institute",
          "/institute/*",
          // Admin area
          "/admin",
          "/admin/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
