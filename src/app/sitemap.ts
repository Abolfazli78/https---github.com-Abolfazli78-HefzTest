import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");

  const routes: string[] = [
    "/",
    "/about",
    "/features",
    "/pricing",
    "/legal/terms",
    "/legal/privacy",
    "/azmoon-online-hifz-quran",
    "/azmoon-hafizan-quran-online",
    "/bank-soal-azmoon-hifz",
    "/system-modiriyat-kelas-quran",
    "/modiriyat-amoozeshi-moassesat",
    "/gozaresh-pishرفت-hafizan-quran",
    "/gozaresh-modiriati-moassesat-qurani",
    "/tahlil-amalkard-kelas-quran",
    "/tahrir-va-sabt-khata-azmoon-hifz",
    "/rahنمای-azmoon-hifz-quran",
    "/rahnama-samane-test-hefz",
    "/faq",
    "/abzar-moalem-quran",
    "/faq-moalem-quran",
    "/demo",
    "/narm-afzar-modiriyat-moassese-qurani",
  ];

  const now = new Date();

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/about" ? 0.8 : 0.7,
  }));
}
