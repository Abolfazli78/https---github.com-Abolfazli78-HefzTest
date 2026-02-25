import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";
import { SeoCtaRow } from "@/components/seo/cta-row";

export const metadata: Metadata = {
  title: "حفظ ۲۰ جزء قرآن | برنامه سنگین و مدیریت مرور",
  description:
    "راهنمای حفظ ۲۰ جزء قرآن با برنامه تمرین منظم، آزمون‌های دوره‌ای و مدیریت مرور برای حفظ کیفیت و جلوگیری از فراموشی.",
  alternates: {
    canonical: "https://hefztest.ir/hefz-20-joz",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "آزمون آنلاین حفظ قرآن", item: "https://hefztest.ir/azmoon-online-hifz-quran" },
    { name: "حفظ ۲۰ جزء قرآن", item: "https://hefztest.ir/hefz-20-joz" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold leading-relaxed">حفظ ۲۰ جزء قرآن؛ پیشروی سریع با کنترل کیفیت</h1>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            در <strong>حفظ ۲۰ جزء</strong> باید نسبت تمرین جدید به مرور را مدیریت کنید تا هم سرعت مناسب داشته باشید و هم افت کیفیت رخ ندهد.
          </p>
          <SeoCtaRow />
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">چارچوب پیشنهادی</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>روزانه ۲ تا ۳ صفحه حفظ جدید + مرور تفکیکی</li>
            <li>آزمون هفتگی از محفوظات همان هفته</li>
            <li>آزمون جمع‌بندی در پایان هر ۳ تا ۴ جزء</li>
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

