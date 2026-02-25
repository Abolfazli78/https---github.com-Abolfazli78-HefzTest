import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import {
  ARTICLE_TOKENS,
  Callout,
  PremiumArticleLayout,
  type PremiumArticleData,
} from "@/components/article/premium-article-layout";
import { ArticleReveal, MidArticleCta } from "@/components/article/article-interactions";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hefztest.ir";

const data: PremiumArticleData = {
  baseUrl,
  canonicalPath: "/blog/ghobooli-dar-azmoon-hefz",
  title: "چگونه در آزمون تخصصی حفظ قرآن قبول شویم؟ برنامه راهبردی و ۳۰ روز تمرین",
  subtitle:
    "نقشه راه عملی قبولی: برنامه ۳۰ روزه، اشتباهات پرتکرار، راهکارهای افزایش نمره کتبی و آمادگی شفاهی با شبیه‌سازی hefztest.",
  category: "قبولی",
  author: { name: "تحریریه hefztest", role: "استراتژی و برنامه‌ریزی" },
  publishedAtISO: "2026-02-25",
  publishedAtLabel: "۱۴۰۵/۰۱/۲۵",
  updatedAtISO: "2026-02-25",
  readingTimeMinutes: 8,
  coverImageUrl: "/logo2.png",
  coverAlt: "قبولی در آزمون تخصصی حفظ قرآن",
  toc: [
    { id: "strategy", label: "راهبرد کلی آمادگی" },
    { id: "schedule", label: "برنامه ۳۰ روزه" },
    { id: "mistakes", label: "اشتباهات رایج" },
    { id: "faq", label: "سوالات متداول" },
    { id: "internal-links", label: "مسیر مطالعه" },
    { id: "related", label: "مقالات مرتبط" },
  ],
  faq: [
    { question: "موثرترین روش برای افزایش نمره کتبی چیست؟", answer: "تمرین هدفمند آیات مشابه و ترجمه با تست‌های زمان‌دار و تحلیل منظم خطاها." },
    { question: "چگونه برای شفاهی آمادگی بهتری داشته باشیم؟", answer: "تمرین پرسش چندسطری، ضبط صوت، اصلاح تلفظ و تقویت وقف و ابتدا با تمرکز بر معنا." },
    { question: "برنامه ۳۰ روزه چه ساختاری داشته باشد؟", answer: "ترکیبی از مرور روزانه، تست زمان‌دار، تمرین مشابهت‌ها، ترجمه و مرور هفتگی با ارزیابی پیشرفت." },
    { question: "بهترین زمان برای شروع شبیه‌سازی کی است؟", answer: "از همان هفته اول؛ برای کشف خطاهای پرتکرار و جلوگیری از تمرین اشتباه." },
    { question: "اگر زمان کم باشد، اولویت با چیست؟", answer: "آیات مشابه + تست زمان‌دار؛ سپس ترجمه و مفردات." },
  ],
  internalLinks: [
    { href: "/blog/azmoon-takhasosi-hefz-quran-1405", label: "ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵", description: "مقاله مادر برای ساختار آزمون و مسیر کلی." },
    { href: "/rahnama-azmoon-hifz-quran", label: "راهنمای آزمون حفظ قرآن", description: "معیارهای ارزیابی کتبی و شفاهی." },
    { href: "/rahnama-samane-test-hefz", label: "راهنمای سامانه تست حفظ", description: "روش استفاده از شبیه‌ساز و گزارش‌ها." },
  ],
  related: [
    {
      href: "/blog/had-nasab-ghabooli-azmoon-hefz",
      title: "حد نصاب قبولی آزمون تخصصی حفظ قرآن: امتیازدهی و استراتژی نمره بالا",
      excerpt: "حدنصاب‌های کتبی و شفاهی و مسیر افزایش نمره.",
      category: "حد نصاب",
      date: "۱۴۰۵/۰۱/۲۳",
      image: "/logo2.png",
    },
    {
      href: "/blog/marhale-azmoon-hefz-1405",
      title: "مراحل آزمون تخصصی حفظ قرآن ۱۴۰۵: مرحله ۱ تا ۴ به زبان ساده",
      excerpt: "هر مرحله دقیقاً چه می‌خواهد و چطور برای آن آماده شویم؟",
      category: "مراحل",
      date: "۱۴۰۵/۰۱/۲۲",
      image: "/logo2.png",
    },
  ],
  trustStats: [
    { value: "۲۰+ سال", label: "سؤالات ادوار آزمون" },
    { value: "تمرین زمان‌دار", label: "شبیه‌سازی واقعی" },
    { value: "گزارش تحلیلی", label: "خطا و پیشرفت" },
    { value: "۱۰۰۰+", label: "کاربر فعال" },
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
        <section id="strategy" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">راهبرد کلی آمادگی</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>مرور فاصله‌دار برای تثبیت بلندمدت</li>
            <li>تمرین هدفمند آیات مشابه و دام‌های مفهومی</li>
            <li>تست‌های زمان‌دار ۵۰/۱۰۰/۱۵۰ سوالی</li>
            <li>تحلیل خطا و ساخت دفترچه اشتباهات پرتکرار</li>
            <li>تمرین شفاهی چندسطری، وقف و ابتدا، صوت و لحن</li>
          </ul>
          <Callout variant="important" title="اصل طلایی">
            هر آزمون آزمایشی باید به «لیست خطا + برنامه مرور کوتاه» تبدیل شود؛ وگرنه تکرار خطاها تثبیت می‌شود.
          </Callout>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="schedule" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">برنامه ۳۰ روزه پیشنهادی</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-right border-b">
                  <th className="py-3 px-4">بازه</th>
                  <th className="py-3 px-4">تمرکز</th>
                  <th className="py-3 px-4">تمرین</th>
                  <th className="py-3 px-4">خروجی</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">روز ۱–۷</td>
                  <td className="py-3 px-4">تشخیص سطح و مشابهت‌های پایه</td>
                  <td className="py-3 px-4">تست‌های ۵۰ سوالی + دفترچه خطا</td>
                  <td className="py-3 px-4">نقشه نقاط ضعف</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">روز ۸–۱۴</td>
                  <td className="py-3 px-4">ترجمه و معنا + مشابهت‌های پیشرفته</td>
                  <td className="py-3 px-4">تست‌های ۱۰۰ سوالی + مرور مفردات</td>
                  <td className="py-3 px-4">افزایش دقت مفهومی</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">روز ۱۵–۲۱</td>
                  <td className="py-3 px-4">تثبیت زمان‌بندی و کاهش خطا</td>
                  <td className="py-3 px-4">تست‌های ۱۵۰ سوالی + سناریوهای شفاهی</td>
                  <td className="py-3 px-4">پایداری سرعت و دقت</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">روز ۲۲–۳۰</td>
                  <td className="py-3 px-4">جمع‌بندی و شبیه‌سازی کامل</td>
                  <td className="py-3 px-4">آزمون جامع + بازنگری دفترچه خطا</td>
                  <td className="py-3 px-4">آمادگی نهایی</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </ArticleReveal>

      <MidArticleCta
        headline="شبیه‌سازی آزمون تخصصی حفظ قرآن را همین حالا شروع کنید"
        description="برنامه ۳۰ روزه وقتی جواب می‌دهد که در طول مسیر چند بار آزمون زمان‌دار بزنید و اشتباهات را اصلاح کنید. hefztest همین کار را برایتان ساده می‌کند."
        primary={{ href: "/azmoon-hafizan-quran-online", label: "شروع آزمون" }}
        secondary={{ href: "/features", label: "مشاهده امکانات" }}
      />

      <ArticleReveal>
        <section id="mistakes" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-5")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">اشتباهات پرتکرار و راه‌حل‌ها</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Callout variant="warning" title="جابه‌جایی در آیات مشابه">
              تمرین هدفمند مشابهت‌ها و یادداشت‌برداری از تله‌های معنایی، سریع‌ترین راه کاهش این خطاست.
            </Callout>
            <Callout variant="info" title="افت دقت در زمان محدود">
              تست زمان‌دار + تحلیل زمان صرف‌شده و بهینه‌سازی ترتیب پاسخ، دقت را پایدار می‌کند.
            </Callout>
            <Callout variant="important" title="ضعف تجویدی در شفاهی">
              بازخورد صوتی، تمرین مخارج و اصلاح وقف و ابتدا مبتنی بر معنا، افت امتیاز را کم می‌کند.
            </Callout>
            <Callout variant="success" title="راهکار یک‌پارچه">
              نتیجه آزمون آزمایشی را به «دفترچه خطا» تبدیل کنید و هر روز ۱۰ دقیقه روی همان موارد تمرکز کنید.
            </Callout>
          </div>
        </section>
      </ArticleReveal>
    </PremiumArticleLayout>
  );
}
