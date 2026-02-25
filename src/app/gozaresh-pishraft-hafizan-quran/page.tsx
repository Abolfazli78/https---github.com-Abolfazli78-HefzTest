import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";
import { SeoCtaRow } from "@/components/seo/cta-row";

export const metadata: Metadata = {
  title: "گزارش پیشرفت حافظان قرآن | تحلیل نتایج آزمون حفظ",
  description:
    "گزارش پیشرفت قرآن‌آموزان با تحلیل خطاها، روند رشد، سطح‌بندی و پیشنهاد مسیر تمرین؛ مناسب کلاس‌ها و موسسات قرآنی.",
  alternates: {
    canonical: "https://hefztest.ir/gozaresh-pishraft-hafizan-quran",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "آزمون آنلاین حفظ قرآن", item: "https://hefztest.ir/azmoon-online-hifz-quran" },
    { name: "گزارش پیشرفت حافظان قرآن", item: "https://hefztest.ir/gozaresh-pishraft-hafizan-quran" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold leading-relaxed">گزارش پیشرفت حافظان قرآن و تحلیل نتایج آزمون</h1>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            گزارش پیشرفت فقط یک عدد یا نمره نیست؛ هدف این است که از دل نتایج <strong>آزمون حافظان قرآن</strong>
            ، خطاهای پرتکرار، روند رشد و پیشنهاد تمرین استخراج شود. با یک گزارش دقیق، معلم می‌تواند تصمیم‌های آموزشی بهتر بگیرد
            و مدیر موسسه کیفیت کلاس‌ها را داده‌محور پیگیری کند.
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            صفحه مادر:{" "}
            <Link className="underline" href="/azmoon-online-hifz-quran">آزمون آنلاین حفظ قرآن</Link>
          </p>
          <SeoCtaRow />
        </header>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">چه چیزهایی را در گزارش پیگیری کنیم؟</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>تعداد و نوع خطاها (لفظی، جاافتادگی، وقف و ابتدا)</li>
            <li>روند تغییر خطاها در آزمون‌های متوالی</li>
            <li>مقایسه عملکرد در سطوح مختلف آزمون</li>
            <li>پیشنهاد تمرین برای نقاط ضعف پرتکرار</li>
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">چگونه گزارش را به برنامه تمرین تبدیل کنیم؟ (آموزشی)</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            اگر یک خطا در چند آزمون تکرار می‌شود، معمولاً مشکل از مرور یا تثبیت است. برای این موارد، تمرین‌های کوتاه و روزانه با مرور هدفمند
            پیشنهاد می‌شود. اگر خطا مقطعی است، مرور همان بخش کافی است. این روش باعث می‌شود آزمون‌ها به‌مرور زمان مؤثرتر شوند.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">لینک‌های مرتبط</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            برای معیارها و چک‌لیست:{" "}
            <Link className="underline" href="/rahnama-azmoon-hifz-quran">راهنمای آزمون حفظ قرآن</Link>
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            برای طراحی سوال:{" "}
            <Link className="underline" href="/bank-soal-azmoon-hifz">بانک سوال آزمون حفظ قرآن</Link>
          </p>
        </section>

        <footer className="mt-12">
          <SeoCtaRow />
        </footer>
      </SeoPillarLayout>
    </>
  );
}
