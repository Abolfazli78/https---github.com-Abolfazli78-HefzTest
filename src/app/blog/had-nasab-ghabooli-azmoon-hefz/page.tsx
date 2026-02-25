import Link from "next/link";
import type { Metadata } from "next";
import {
  ARTICLE_TOKENS,
  Callout,
  PremiumArticleLayout,
  type PremiumArticleData,
} from "@/components/article/premium-article-layout";
import { ArticleReveal, MidArticleCta } from "@/components/article/article-interactions";
import { cn } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hefztest.ir";

const data: PremiumArticleData = {
  baseUrl,
  canonicalPath: "/blog/had-nasab-ghabooli-azmoon-hefz",
  title: "حد نصاب قبولی آزمون تخصصی حفظ قرآن: کتبی، شفاهی و درجات",
  subtitle:
    "جدول حد نصاب، منطق امتیازدهی کتبی و شفاهی، آستانه‌های درجات و استراتژی عملی برای رسیدن به نمره بالا در آزمون تخصصی حفظ قرآن.",
  category: "حد نصاب",
  author: { name: "تحریریه hefztest", role: "تحلیل و راهنمای آمادگی" },
  publishedAtISO: "2026-02-25",
  publishedAtLabel: "۱۴۰۵/۰۱/۲۳",
  updatedAtISO: "2026-02-25",
  readingTimeMinutes: 7,
  coverImageUrl: "/logo2.png",
  coverAlt: "حد نصاب قبولی آزمون تخصصی حفظ قرآن",
  toc: [
    { id: "katbi", label: "حد نصاب مرحله کتبی" },
    { id: "oral", label: "ارزیابی مرحله شفاهی" },
    { id: "degrees", label: "آستانه‌های درجات" },
    { id: "strategy", label: "استراتژی افزایش نمره" },
    { id: "faq", label: "سوالات متداول" },
    { id: "internal-links", label: "مسیر مطالعه" },
    { id: "related", label: "مقالات مرتبط" },
  ],
  faq: [
    {
      question: "حد نصاب کتبی برای مسیرهای مختلف چقدر است؟",
      answer: "۱۰ جزء: ۳۰ از ۵۰؛ ۲۰ جزء: ۶۰ از ۱۰۰؛ حافظ کل (درجه ۳): ۱۰۵ از ۱۵۰؛ درجات ۲ و ۱: ۱۲۰ از ۱۵۰.",
    },
    {
      question: "در شفاهی چه مواردی امتیازآور است؟",
      answer: "حسن‌حفظ، انتقال بین آیات، تجوید، وقف و ابتدا، صوت و لحن؛ خطاهای تکراری معمولاً باعث افت امتیاز می‌شود.",
    },
    {
      question: "چگونه نمره کتبی را سریع‌تر افزایش دهیم؟",
      answer: "تمرین هدفمند آیات مشابه و ترجمه، شبیه‌سازی زمان‌دار، تحلیل خطا و تمرکز بر دام‌های پرتکرار.",
    },
    {
      question: "اگر حد نصاب کتبی را رد کنم، شفاهی برگزار می‌شود؟",
      answer: "در الگوی رایج، قبولی کتبی پیش‌نیاز ورود به شفاهی است.",
    },
    {
      question: "برای افزایش امتیاز شفاهی مهم‌ترین تمرین چیست؟",
      answer: "تمرین پرسش چندسطری و انتقال بین آیات همراه با بازخورد تجوید، وقف و ابتدا.",
    },
  ],
  internalLinks: [
    {
      href: "/blog/azmoon-takhasosi-hefz-quran-1405",
      label: "ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵",
      description: "راهنمای جامع ساختار آزمون، مراحل و مدارک لازم.",
    },
    {
      href: "/rahnama-azmoon-hifz-quran",
      label: "راهنمای آزمون حفظ قرآن",
      description: "چک‌لیست استاندارد ارزیابی و تبدیل نتیجه به برنامه تمرین.",
    },
    {
      href: "/rahnama-samane-test-hefz",
      label: "راهنمای سامانه تست حفظ",
      description: "راهنمای استفاده از ابزارها و مسیرهای تمرینی در hefztest.",
    },
  ],
  related: [
    {
      href: "/blog/marhale-azmoon-hefz-1405",
      title: "مراحل آزمون تخصصی حفظ قرآن ۱۴۰۵: کتبی، شفاهی، ترجمه و تفسیر",
      excerpt: "ساختار مرحله‌ای آزمون را دقیق بشناسید و برای هر مرحله هدفمند تمرین کنید.",
      category: "مراحل",
      date: "۱۴۰۵/۰۱/۲۲",
      image: "/logo2.png",
    },
    {
      href: "/blog/sharaet-sabt-nam-azmoon-hefz-1405",
      title: "شرایط ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵: مدارک، هزینه و خطاهای رایج",
      excerpt: "چک‌لیست مدارک، شرایط و خطاهای رایج ثبت‌نام برای کاهش ریسک رد پرونده.",
      category: "آیین‌نامه",
      date: "۱۴۰۵/۰۱/۲۰",
      image: "/logo2.png",
    },
  ],
  trustStats: [
    { value: "۲۰+ سال", label: "سؤالات ادوار آزمون" },
    { value: "۱۰۰۰+", label: "کاربر فعال" },
    { value: "۵۰,۰۰۰+", label: "سوال در بانک تمرین" },
    { value: "گزارش تحلیلی", label: "پیشرفت و خطاها" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${baseUrl}${data.canonicalPath}`;
  return {
    title: `${data.title} | hefztest`,
    description: data.subtitle,
    alternates: { canonical },
    openGraph: {
      title: `${data.title} | hefztest`,
      description: data.subtitle,
      url: canonical,
      siteName: "hefztest",
      locale: "fa_IR",
      type: "article",
      images: [{ url: `${baseUrl}${data.coverImageUrl}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | hefztest`,
      description: data.subtitle,
      images: [`${baseUrl}${data.coverImageUrl}`],
    },
  };
}

export default function Page() {
  const canonical = `${baseUrl}${data.canonicalPath}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: "fa-IR",
    headline: data.title,
    description: data.subtitle,
    image: [`${baseUrl}${data.coverImageUrl}`],
    author: { "@type": "Organization", name: "hefztest" },
    publisher: { "@type": "Organization", name: "hefztest" },
    mainEntityOfPage: canonical,
    datePublished: data.publishedAtISO,
    dateModified: data.updatedAtISO ?? data.publishedAtISO,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "fa-IR",
    mainEntity: data.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "مقالات", item: `${baseUrl}/blog` },
      { "@type": "ListItem", position: 3, name: data.title, item: canonical },
    ],
  };

  return (
    <PremiumArticleLayout
      data={data}
      breadcrumbs={[
        { name: "خانه", href: "/" },
        { name: "مقالات", href: "/blog" },
        { name: data.title, href: data.canonicalPath },
      ]}
      articleJsonLd={articleJsonLd}
      faqJsonLd={faqJsonLd}
      breadcrumbJsonLd={breadcrumbJsonLd}
    >
      <ArticleReveal>
        <section id="katbi" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">حد نصاب مرحله کتبی</h2>
          <Callout variant="info" title="نکته کلیدی">
            در چارچوب رایج، عبور از حد نصاب کتبی پیش‌نیاز ورود به مرحله شفاهی است؛ بنابراین «سقف نمره» شما از همین مرحله ساخته می‌شود.
          </Callout>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-right border-b">
                  <th className="py-3 px-4">مسیر</th>
                  <th className="py-3 px-4">تعداد سؤال</th>
                  <th className="py-3 px-4">حد نصاب قبولی</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">۱۰ جزء</td>
                  <td className="py-3 px-4">۵۰</td>
                  <td className="py-3 px-4">۳۰ پاسخ صحیح</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">۲۰ جزء</td>
                  <td className="py-3 px-4">۱۰۰</td>
                  <td className="py-3 px-4">۶۰ پاسخ صحیح</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">حافظ کل (درجه ۳)</td>
                  <td className="py-3 px-4">۱۵۰</td>
                  <td className="py-3 px-4">۱۰۵ پاسخ صحیح</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">درجات ۲ و ۱</td>
                  <td className="py-3 px-4">۱۵۰</td>
                  <td className="py-3 px-4">۱۲۰ پاسخ صحیح</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white/60 dark:bg-white/5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">وزن مهارت‌ها در کتبی</h3>
            <ul className="mt-3 list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
              <li>ترجمه و معنا: تشخیص دقیق مفاهیم و روابط</li>
              <li>حفظ و مشابهت: کاهش خطای جابه‌جایی و دام‌های معنایی</li>
              <li>مدیریت زمان: حفظ کیفیت پاسخ در محدودیت زمانی</li>
            </ul>
          </div>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="oral" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">ارزیابی مرحله شفاهی</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            در شفاهی، کیفیت اجرای حفظ در فشار تمرکز سنجیده می‌شود. خطاهای پرتکرار، مکث‌های طولانی یا تداخل آیات مشابه معمولاً باعث افت امتیاز می‌شود.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Callout variant="success" title="امتیازآور">
              حسن‌حفظ، انتقال روان بین آیات، دقت تجویدی و انتخاب صحیح وقف و ابتدا.
            </Callout>
            <Callout variant="warning" title="کاهنده امتیاز">
              مکث‌های طولانی، تکرار خطاهای مشابهتی، تلفظ نادرست و وقف نامناسب که معنا را تغییر دهد.
            </Callout>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white/60 dark:bg-white/5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">شاخص‌های کلیدی</h3>
            <ul className="mt-3 list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
              <li>حسن‌حفظ: پیوستگی و بازخوانی بدون مکث</li>
              <li>تجوید: مخارج، صفات، احکام</li>
              <li>وقف و ابتدا: اتصال معنایی و انتخاب محل توقف</li>
              <li>صوت و لحن: یکنواختی اداء، تطابق با معنا</li>
            </ul>
          </div>
        </section>
      </ArticleReveal>

      <MidArticleCta
        headline="شبیه‌سازی آزمون تخصصی حفظ قرآن را همین حالا شروع کنید"
        description="برای عبور مطمئن از حد نصاب، تمرین زمان‌دار + تحلیل خطا ضروری است. با شبیه‌ساز hefztest، سرعت و دقت را بسنجید و نقاط ضعف را هدف بگیرید."
        primary={{ href: "/azmoon-hafizan-quran-online", label: "شروع آزمون" }}
        secondary={{ href: "/features", label: "مشاهده امکانات" }}
      />

      <ArticleReveal>
        <section id="degrees" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">آستانه‌های درجات و تفسیر نتیجه</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            عبور از مرحله کتبی شرط ورود به شفاهی است. برای ارتقاء به درجات بالاتر، کسب حد نصاب‌های ویژه مرحله ترجمه و در نهایت تفسیر ضروری است.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>درجه ۵ و ۴: تاکید بر پیوستگی اجزاء و درک معنا</li>
            <li>درجه ۳: حافظ کل با معناشناسی عمیق‌تر</li>
            <li>درجه ۲ و ۱: ترجمه، مفردات، سپس تفسیر و علوم قرآنی</li>
          </ul>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="strategy" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-5")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">استراتژی افزایش نمره</h2>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white/60 dark:bg-white/5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">برای کتبی</h3>
            <ul className="mt-3 list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
              <li>تمرین پرتکرار آیات مشابه و دام‌های مفهومی</li>
              <li>شبیه‌سازی زمان‌دار ۵۰/۱۰۰/۱۵۰ سوالی</li>
              <li>تحلیل خطا و ساخت فهرست اشتباهات پرتکرار</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white/60 dark:bg-white/5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">برای شفاهی</h3>
            <ul className="mt-3 list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
              <li>تمرین پرسش چندسطری و انتقال بین آیات</li>
              <li>بازخورد صوتی و اصلاح تلفظ و مخارج</li>
              <li>تقویت وقف و ابتدا مبتنی بر معنا</li>
            </ul>
          </div>

          <Callout variant="important" title="یک اصل طلایی">
            تمرین را «داده‌محور» کنید: هر آزمون آزمایشی باید به یک فهرست مشخص از خطاها و یک برنامه مرور کوتاه تبدیل شود.
          </Callout>

          <div className="text-sm text-slate-700 dark:text-slate-300">
            مطالعه تکمیلی:{" "}
            <Link className="underline text-emerald-700 dark:text-emerald-300" href="/blog/azmoon-takhasosi-hefz-quran-1405">
              مقاله مادر آزمون تخصصی ۱۴۰۵
            </Link>
          </div>
        </section>
      </ArticleReveal>
    </PremiumArticleLayout>
  );
}
