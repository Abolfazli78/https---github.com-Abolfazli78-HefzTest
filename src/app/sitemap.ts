import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");

  const routes: string[] = [
    "/",
    "/about",
    "/features",
    "/pricing",
    "/contact",
    "/faq",
    "/faq-moalem-quran",
    "/demo",
    "/legal/terms",
    "/legal/privacy",
    "/azmoon-online-hifz-quran",
    "/azmoon-hafizan-quran-online",
    "/bank-soal-azmoon-hifz",
    "/system-modiriyat-kelas-quran",
    "/modiriyat-amoozeshi-moassesat",
    "/gozaresh-pishraft-hafizan-quran",
    "/gozaresh-modiriati-moassesat-qurani",
    "/tahlil-amalkard-kelas-quran",
    "/tahrir-va-sabt-khata-azmoon-hifz",
    "/rahnama-azmoon-hifz-quran",
    "/rahnama-samane-test-hefz",
    "/abzar-moalem-quran",
    "/narm-afzar-modiriyat-moassese-qurani",
    "/hefz-5-joz",
    "/hefz-10-joz",
    "/hefz-20-joz",
    "/hefz-kamel",
  ];

  const now = new Date();
  const mainServicePaths = new Set<string>([
    "/azmoon-online-hifz-quran",
    "/azmoon-hafizan-quran-online",
    "/bank-soal-azmoon-hifz",
    "/system-modiriyat-kelas-quran",
    "/modiriyat-amoozeshi-moassesat",
    "/gozaresh-modiriati-moassesat-qurani",
    "/tahlil-amalkard-kelas-quran",
    "/abzar-moalem-quran",
    "/narm-afzar-modiriyat-moassese-qurani",
  ]);
  const featurePaths = new Set<string>([
    "/features",
    "/pricing",
    "/faq",
    "/faq-moalem-quran",
    "/demo",
    "/contact",
    "/rahnama-samane-test-hefz",
    "/rahnama-azmoon-hifz-quran",
    "/hefz-5-joz",
    "/hefz-10-joz",
    "/hefz-20-joz",
    "/hefz-kamel",
    "/about",
  ]);
  const legalPaths = new Set<string>(["/legal/terms", "/legal/privacy"]);

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1.0
        : legalPaths.has(path)
        ? 0.3
        : mainServicePaths.has(path)
        ? 0.9
        : featurePaths.has(path)
        ? 0.8
        : 0.7,
  }));
}
