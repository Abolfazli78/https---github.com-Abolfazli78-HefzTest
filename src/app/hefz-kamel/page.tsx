import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";
import { SeoCtaRow } from "@/components/seo/cta-row";

export const metadata: Metadata = {
  title: "حفظ کل قرآن | مدیریت مرور، آزمون و گزارش پیشرفت",
  description:
    "نقشه راه حفظ کل قرآن با برنامه‌ریزی مرور، آزمون‌های منظم و گزارش پیشرفت برای کنترل کیفیت درازمدت.",
  alternates: {
    canonical: "https://hefztest.ir/hefz-kamel",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "آزمون آنلاین حفظ قرآن", item: "https://hefztest.ir/azmoon-online-hifz-quran" },
    { name: "حفظ کل قرآن", item: "https://hefztest.ir/hefz-kamel" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold leading-relaxed">حفظ کل قرآن؛ استمرار، مرور هوشمند و ارزیابی</h1>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            در <strong>حفظ کل قرآن</strong> اولویت اصلی مدیریت مرور و تثبیت بلندمدت است. آزمون‌های منظم و گزارش‌گیری به حفظ کیفیت کمک می‌کند.
          </p>
          <SeoCtaRow />
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">چارچوب مرور و ارزیابی</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>مرور روزانه با حلقه‌های زمانی (روزانه/هفتگی/ماهانه)</li>
            <li>آزمون‌های دوره‌ای ساختارمند با ثبت خطا</li>
            <li>گزارش پیشرفت و پایش نقاط پرتکرار</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">لینک‌های مرتبط</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            راهنما: <Link className="underline" href="/rahnama-azmoon-hifz-quran">راهنمای آزمون حفظ قرآن</Link>
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            طراحی سوال: <Link className="underline" href="/bank-soal-azmoon-hifz">بانک سوال آزمون حفظ</Link>
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

