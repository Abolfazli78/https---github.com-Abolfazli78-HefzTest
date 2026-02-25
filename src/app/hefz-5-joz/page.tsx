import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";
import { SeoCtaRow } from "@/components/seo/cta-row";

export const metadata: Metadata = {
  title: "حفظ ۵ جزء قرآن | برنامه تمرین و آزمون",
  description:
    "مسیر پیشنهادی برای حفظ ۵ جزء قرآن: برنامه تمرین هفتگی، آزمون‌های دوره‌ای، مرور و نکات تثبیت برای شروعی اصولی.",
  alternates: {
    canonical: "https://hefztest.ir/hefz-5-joz",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "آزمون آنلاین حفظ قرآن", item: "https://hefztest.ir/azmoon-online-hifz-quran" },
    { name: "حفظ ۵ جزء قرآن", item: "https://hefztest.ir/hefz-5-joz" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold leading-relaxed">حفظ ۵ جزء قرآن؛ شروع استاندارد و قابل‌پیگیری</h1>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            برای <strong>حفظ ۵ جزء قرآن</strong> بهتر است از برنامه هفتگی با مرور منظم و آزمون‌های دوره‌ای استفاده کنید تا
            هم سرعت مناسب باشد و هم فراموشی کنترل شود.
          </p>
          <SeoCtaRow />
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">پیشنهاد برنامه تمرین</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>روزانه ۱ تا ۲ صفحه حفظ جدید + ۱۰ تا ۱۵ دقیقه مرور</li>
            <li>آزمون هفتگی از محفوظات همان هفته</li>
            <li>آزمون جمع‌بندی در پایان هر جزء</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">لینک‌های مرتبط</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            طراحی سوال: <Link className="underline" href="/bank-soal-azmoon-hifz">بانک سوال آزمون حفظ</Link>
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            آزمون آنلاین: <Link className="underline" href="/azmoon-online-hifz-quran">آزمون آنلاین حفظ قرآن</Link>
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            گزارش پیشرفت: <Link className="underline" href="/gozaresh-pishraft-hafizan-quran">گزارش پیشرفت حافظان قرآن</Link>
          </p>
        </section>

        <footer className="mt-12">
          <SeoCtaRow />
        </footer>
      </SeoPillarLayout>
    </>
  );
}

