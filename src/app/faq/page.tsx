import type { Metadata } from "next";

import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "سوالات متداول آزمون حفظ قرآن | حفظ تست",
  description: "پاسخ به سوالات متداول درباره سامانه تست حفظ: آزمون آنلاین حفظ قرآن، شبیه‌ساز، گزارش پیشرفت، و امکانات معلمان و موسسات.",
  alternates: {
    canonical: "https://hefztest.ir/faq",
  },
};

export default function Page() {
  return <FaqClient />;
}
