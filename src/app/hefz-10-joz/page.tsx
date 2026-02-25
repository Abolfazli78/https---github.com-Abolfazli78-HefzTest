import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";
import { SeoCtaRow } from "@/components/seo/cta-row";

export const metadata: Metadata = {
  title: "حفظ ۱۰ جزء قرآن | برنامه تمرین، آزمون و تثبیت",
  description:
    "راهنمای حفظ ۱۰ جزء قرآن با برنامه تمرین مرحله‌ای، آزمون‌های دوره‌ای و مرور هدفمند برای تثبیت محفوظات.",
  alternates: {
    canonical: "https://hefztest.ir/hefz-10-joz",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "آزمون آنلاین حفظ قرآن", item: "https://hefztest.ir/azmoon-online-hifz-quran" },
    { name: "حفظ ۱۰ جزء قرآن", item: "https://hefztest.ir/hefz-10-joz" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold leading-relaxed">حفظ ۱۰ جزء قرآن؛ برنامه‌ریزی و کنترل کیفیت</h1>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            برای <strong>حفظ ۱۰ جزء قرآن</strong> از چرخه «حفظ جدید → مرور روزانه → آزمون هفتگی → آزمون جمع‌بندی» استفاده کنید تا
            هم پیشروی ثابت بماند و هم دقت بالا برود.
          </p>
          <SeoCtaRow />
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">چارچوب پیشنهادی</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>روزانه ۲ صفحه حفظ جدید + مرور ۲۰ دقیقه‌ای محفوظات اخیر</li>
            <li>آزمون هفتگی از مجموع محفوظات همان هفته</li>
            <li>آزمون جمع‌بندی در پایان هر ۲ جزء</li>
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

