import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره تست حفظ | شبیه‌ساز آزمون مدرک حافظان قرآن",
  description: "تست حفظ؛ شبیه‌ساز آزمون اعطای مدرک حافظان قرآن با آرشیو سؤالات ۲۰ سال، تمرین آنلاین، تحلیل عملکرد و آمادگی برای پایه‌های ۳،۴،۵. معرفی مأموریت و فناوری.",
  keywords: [
    "آزمون حفظ قرآن",
    "سامانه آزمون قرآن",
    "تست حفظ",
    "آزمون آنلاین قرآن",
    "مدرک حفظ قرآن",
    "آزمون‌های رسمی حفظ",
    "ابزار معلم قرآن",
    "مدیریت موسسات قرآنی",
  ],
  openGraph: {
    title: "درباره تست حفظ",
    description: "شبیه‌ساز آزمون اعطای مدرک با تمرین آنلاین و آرشیو سؤالات ۲۰ سال.",
    url: "https://hefztest.ir/about",
    siteName: "تست حفظ",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/about/opengraph-image",
        width: 1200,
        height: 630,
        alt: "درباره تست حفظ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره تست حفظ",
    description: "شبیه‌ساز آزمون اعطای مدرک با تمرین آنلاین و آرشیو سؤالات ۲۰ سال.",
    images: ["/about/twitter-image"],
  },
  alternates: {
    canonical: "https://hefztest.ir/about",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
