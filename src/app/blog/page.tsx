import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { BlogListingClient } from "@/components/blog/blog-listing-client";

export const metadata: Metadata = {
  title: "مقالات تخصصی حفظ قرآن | hefztest",
  description:
    "مرکز مقالات آموزشی و تخصصی حفظ قرآن: راهنمای آزمون‌ها، روش‌های آمادگی، و تجربه‌های موفق برای قبولی.",
  alternates: {
    canonical: "https://hefztest.ir/blog",
  },
};

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
};

const ARTICLES: Article[] = [
  {
    slug: "azmoon-takhasosi-hefz-quran-1405",
    title: "ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵: شرایط، مراحل و حد نصاب",
    excerpt:
      "راهنمای جامع ثبت‌نام آزمون تخصصی حفظ قرآن ۱۴۰۵ با درجات مدرک، مدارک لازم، زمان‌بندی، ساختار آزمون کتبی و شفاهی و راهکارهای قبولی.",
    date: "1405-01-15",
    category: "راهنما",
    image: "/logo2.png",
  },
  {
    slug: "sharaet-sabt-nam-azmoon-hefz-1405",
    title: "شرایط ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵: مدارک، هزینه و خطاهای رایج",
    excerpt:
      "Eligibility، معادل‌سازی علمی، چک‌لیست مدارک، هزینه ثبت‌نام، خطاهای رایج و ۱۰ پرسش متداول؛ راهنمای عملی ثبت‌نام بی‌خطا.",
    date: "1405-01-20",
    category: "آیین‌نامه",
    image: "/logo2.png",
  },
  {
    slug: "marhale-azmoon-hefz-1405",
    title: "مراحل آزمون تخصصی حفظ قرآن ۱۴۰۵: کتبی، شفاهی، ترجمه و تفسیر",
    excerpt:
      "شرح کامل چهار مرحله آزمون تخصصی ۱۴۰۵ به‌همراه نکات قبولی و جدول حد نصاب.",
    date: "1405-01-22",
    category: "مراحل",
    image: "/logo2.png",
  },
  {
    slug: "had-nasab-ghabooli-azmoon-hefz",
    title: "حد نصاب قبولی آزمون تخصصی حفظ قرآن: امتیازدهی و استراتژی نمره بالا",
    excerpt:
      "حدنصاب‌های کتبی و شفاهی، آستانه درجات و راهکارهای افزایش نمره برای قبولی.",
    date: "1405-01-23",
    category: "حد نصاب",
    image: "/logo2.png",
  },
  {
    slug: "manabe-azmoon-hefz-1405",
    title: "منابع آزمون تخصصی حفظ قرآن ۱۴۰۵: ترجمه، مفردات و تفسیر",
    excerpt:
      "معیارهای انتخاب منابع و الگوی برنامه‌ریزی مطالعه برای آمادگی هدفمند.",
    date: "1405-01-24",
    category: "منابع",
    image: "/logo2.png",
  },
  {
    slug: "ghobooli-dar-azmoon-hefz",
    title: "چگونه در آزمون تخصصی حفظ قرآن قبول شویم؟ برنامه راهبردی و ۳۰ روز تمرین",
    excerpt:
      "راهبرد عملی، برنامه ۳۰ روزه، خطاهای رایج و نقش شبیه‌ساز در موفقیت.",
    date: "1405-01-25",
    category: "قبولی",
    image: "/logo2.png",
  },
];

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "مقالات", item: "https://hefztest.ir/blog" },
  ]);

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    inLanguage: "fa-IR",
    name: "بلاگ hefztest",
    url: "https://hefztest.ir/blog",
    blogPost: ARTICLES.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `https://hefztest.ir/blog/${a.slug}`,
      image: a.image ? [`https://hefztest.ir${a.image}`] : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={blogLd} />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <nav className="text-sm mb-6 text-slate-600 dark:text-slate-300">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">خانه</Link>
            </li>
            <li className="opacity-70">/</li>
            <li aria-current="page" className="font-medium text-emerald-700 dark:text-emerald-400">مقالات</li>
          </ol>
        </nav>

        <header className="space-y-3 mb-6">
          <h1 className="text-3xl font-bold leading-relaxed">مقالات تخصصی حفظ قرآن</h1>
          <p className="text-slate-700 dark:text-slate-300 leading-8">
            مجموعه‌ای از راهنماهای آموزشی و خوشه‌های تخصصی پیرامون آزمون‌های حفظ قرآن، شبیه‌ساز hefztest و برنامه‌ریزی حرفه‌ای برای قبولی.
          </p>
        </header>

        <BlogListingClient articles={ARTICLES} />
      </div>
    </>
  );
}
