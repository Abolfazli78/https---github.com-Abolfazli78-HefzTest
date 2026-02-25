import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";
import { SeoCtaRow } from "@/components/seo/cta-row";

export const metadata: Metadata = {
  title: "راهنمای آزمون حفظ قرآن | معیارها و چک‌لیست ارزیابی",
  description:
    "راهنمای عملی آزمون حفظ قرآن: معیارهای ارزیابی، چک‌لیست آزمون‌گیر، روش ثبت خطا و پیشنهاد تمرین برای بهبود نتیجه آزمون حافظان قرآن.",
  alternates: {
    canonical: "https://hefztest.ir/rahnama-azmoon-hifz-quran",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "آزمون آنلاین حفظ قرآن", item: "https://hefztest.ir/azmoon-online-hifz-quran" },
    { name: "راهنمای آزمون حفظ قرآن", item: "https://hefztest.ir/rahnama-azmoon-hifz-quran" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout toc={[{ href: "#checklist", label: "چک‌لیست" }, { href: "#criteria", label: "معیارها" }, { href: "#after", label: "بعد از آزمون" }]}>
        <header className="space-y-4">
          <h1 className="text-3xl font-bold leading-relaxed">راهنمای آزمون حفظ قرآن (چک‌لیست کامل ارزیابی)</h1>
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            این راهنما برای برگزاری یک آزمون منصفانه و قابل مقایسه نوشته شده است. اگر از سامانه
            <strong> آزمون آنلاین حفظ قرآن</strong> استفاده می‌کنید، با یک الگوی ثابت برای ثبت خطا و معیارهای مشخص،
            خروجی آزمون تبدیل به گزارش پیشرفت و برنامه تمرین می‌شود.
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            بازگشت به صفحه مادر:{" "}
            <Link className="underline" href="/azmoon-online-hifz-quran">آزمون آنلاین حفظ قرآن</Link>
          </p>
          <SeoCtaRow />
        </header>

        <section id="checklist" className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">چک‌لیست آزمون‌گیر (قبل از شروع)</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300">
            <li>سطح آزمون را دقیق مشخص کنید (جزء/سوره/مقطع)</li>
            <li>زمان آزمون و تعداد سوال/تکرار را تعیین کنید</li>
            <li>معیارهای ارزیابی را به قرآن‌آموز توضیح دهید</li>
            <li>روش ثبت خطا را از قبل یکسان کنید</li>
          </ul>
        </section>

        <section id="criteria" className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">معیارهای ارزیابی استاندارد</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            پیشنهاد می‌شود حداقل این موارد ارزیابی شوند: دقت در کلمات، روان‌خوانی، مکث‌های طولانی، وقف و ابتدا، و
            میزان رجوع به حافظه. هرچه معیارها ثابت‌تر باشد، گزارش‌ها دقیق‌تر و تصمیم‌گیری آموزشی بهتر خواهد بود.
          </p>
        </section>

        <section id="after" className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">بعد از آزمون: تبدیل نتیجه به برنامه تمرین</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            خطاها را به «پرتکرار» و «مقطعی» تقسیم کنید. برای خطاهای پرتکرار، تمرین کوتاه و روزانه با مرور هدفمند
            پیشنهاد می‌شود؛ برای خطاهای مقطعی معمولاً مرور همان بخش کافی است.
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            پیشنهاد مطالعه:{" "}
            <Link className="underline" href="/gozaresh-pishraft-hafizan-quran">گزارش پیشرفت حافظان قرآن</Link>
          </p>
        </section>

        <footer className="mt-12">
          <SeoCtaRow />
        </footer>
      </SeoPillarLayout>
    </>
  );
}
