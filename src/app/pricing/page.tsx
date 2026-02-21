import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";
import { SeoCtaRow } from "@/components/seo/cta-row";

export const metadata: Metadata = {
  title: "تعرفه موسسات قرآنی | پلن‌های آزمون آنلاین حفظ قرآن",
  description:
    "تعرفه و پلن‌های موسسات قرآنی برای آزمون آنلاین حفظ قرآن و مدیریت آموزشی موسسات. انتخاب پلن متناسب با تعداد کاربران و نیاز آموزشی.",
  alternates: {
    canonical: "https://hefztest.ir/pricing",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "تعرفه و پلن‌ها", item: "https://hefztest.ir/pricing" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold leading-relaxed">تعرفه و پلن‌های موسسات قرآنی</h1>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            پلن‌ها بر اساس نیاز شما در آزمون‌گیری، گزارش‌گیری و مدیریت کاربران طراحی می‌شوند. اگر موسسه دارید و دنبال یک سامانه
            برای <strong>آزمون آنلاین حفظ قرآن</strong> و <strong>مدیریت آموزشی موسسات</strong> هستید، ابتدا با دمو شروع کنید و سپس
            پلن مناسب را انتخاب کنید.
          </p>
          <SeoCtaRow />
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">راهنمای انتخاب پلن (آموزشی)</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>اگر هدف شما آشنایی و شروع است: ثبت‌نام رایگان</li>
            <li>اگر معلم هستید و آزمون و گزارش کلاسی می‌خواهید: پلن معلم</li>
            <li>اگر موسسه دارید و گزارش تجمیعی و نقش‌ها مهم است: پلن سازمانی</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">لینک‌های مرتبط</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            <Link className="underline" href="/modiriyat-amoozeshi-moassesat">مدیریت آموزشی موسسات</Link>
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            <Link className="underline" href="/azmoon-online-hifz-quran">آزمون آنلاین حفظ قرآن</Link>
          </p>
        </section>

        <footer className="mt-12">
          <SeoCtaRow />
        </footer>
      </SeoPillarLayout>
    </>
  );
}
