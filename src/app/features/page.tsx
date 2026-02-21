import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";
import { SeoCtaRow } from "@/components/seo/cta-row";

export const metadata: Metadata = {
  title: "امکانات سامانه | آزمون آنلاین حفظ قرآن و مدیریت موسسات",
  description:
    "معرفی امکانات سامانه حفظ تست: آزمون آنلاین حفظ قرآن، گزارش پیشرفت، بانک سوال، نقش‌های کاربری و مدیریت آموزشی موسسات قرآنی.",
  alternates: {
    canonical: "https://hefztest.ir/features",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "امکانات", item: "https://hefztest.ir/features" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold leading-relaxed">امکانات کلیدی سامانه حفظ تست</h1>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            در این صفحه امکانات اصلی سامانه معرفی می‌شود: <strong>آزمون آنلاین حفظ قرآن</strong>، تصحیح و ثبت خطا،
            <strong> گزارش پیشرفت حافظان قرآن</strong> و قابلیت‌های <strong>مدیریت آموزشی موسسات</strong>. هدف این است که هم آزمون‌ها
            استاندارد شوند و هم خروجی آموزشی قابل پیگیری باشد.
          </p>
          <SeoCtaRow />
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">برای چه کسانی مناسب است؟</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>قرآن‌آموزان: تمرین هدفمند بر اساس نتیجه آزمون</li>
            <li>معلمان: طراحی آزمون، ثبت ارزیابی، گزارش کلاسی</li>
            <li>موسسات: گزارش مدیریتی، کنترل کیفیت، نقش‌محور بودن دسترسی‌ها</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">لینک‌های مرتبط</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            <Link className="underline" href="/azmoon-online-hifz-quran">آزمون آنلاین حفظ قرآن</Link>
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            <Link className="underline" href="/abzar-moalem-quran">ابزار معلم قرآن</Link>
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            <Link className="underline" href="/modiriyat-amoozeshi-moassesat">مدیریت آموزشی موسسات</Link>
          </p>
        </section>

        <footer className="mt-12">
          <SeoCtaRow />
        </footer>
      </SeoPillarLayout>
    </>
  );
}
