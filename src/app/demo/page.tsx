import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";
import { SeoCtaRow } from "@/components/seo/cta-row";

export const metadata: Metadata = {
  title: "دموی سیستم | آزمون آنلاین حفظ قرآن و مدیریت موسسات",
  description:
    "دموی سامانه حفظ تست برای آشنایی با آزمون آنلاین حفظ قرآن، گزارش پیشرفت و امکانات مدیریت آموزشی موسسات. درخواست دمو و شروع رایگان.",
  alternates: {
    canonical: "https://hefztest.ir/demo",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "دموی سیستم", item: "https://hefztest.ir/demo" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold leading-relaxed">مشاهده دموی سیستم حفظ تست</h1>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            در این صفحه می‌توانید با قابلیت‌های اصلی سامانه آشنا شوید: <strong>آزمون آنلاین حفظ قرآن</strong>، ثبت خطا،
            <strong> گزارش پیشرفت حافظان قرآن</strong> و ابزارهای <strong>مدیریت آموزشی موسسات</strong>. اگر قصد دارید قبل از ثبت‌نام
            امکانات را ببینید، این دمو بهترین نقطه شروع است.
          </p>
          <SeoCtaRow />
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">چه چیزهایی در دمو می‌بینید؟</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>نمونه جریان برگزاری آزمون و نمایش نتیجه</li>
            <li>نمونه گزارش پیشرفت و تحلیل خطا</li>
            <li>نمای کلی پنل‌های نقش‌محور (قرآن‌آموز، معلم، مدیر موسسه)</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">لینک‌های پیشنهادی برای مطالعه</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            <Link className="underline" href="/azmoon-online-hifz-quran">آزمون آنلاین حفظ قرآن</Link>
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
