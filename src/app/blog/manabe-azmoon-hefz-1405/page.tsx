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
  canonicalPath: "/blog/manabe-azmoon-hefz-1405",
  title: "منابع آزمون تخصصی حفظ قرآن ۱۴۰۵: ترجمه، مفردات، تفسیر + برنامه مطالعه",
  subtitle:
    "معیارهای انتخاب منابع ترجمه و معنا، واژگان و مفردات، و منابع تفسیر و علوم قرآنی به‌همراه ساختار برنامه‌ریزی مطالعه برای قبولی.",
  category: "منابع",
  author: { name: "تحریریه hefztest", role: "راهنمای منابع و برنامه مطالعه" },
  publishedAtISO: "2026-02-25",
  publishedAtLabel: "۱۴۰۵/۰۱/۲۴",
  updatedAtISO: "2026-02-25",
  readingTimeMinutes: 8,
  coverImageUrl: "/logo2.png",
  coverAlt: "منابع آزمون تخصصی حفظ قرآن ۱۴۰۵",
  toc: [
    { id: "translation", label: "منابع ترجمه" },
    { id: "vocab", label: "واژگان و مفردات" },
    { id: "tafsir", label: "منابع تفسیر" },
    { id: "plan", label: "ساختار برنامه مطالعه" },
    { id: "faq", label: "سوالات متداول" },
    { id: "internal-links", label: "مسیر مطالعه" },
    { id: "related", label: "مقالات مرتبط" },
  ],
  faq: [
    { question: "منابع ترجمه برای آزمون ۱۴۰۵ چه ویژگی‌هایی باید داشته باشد؟", answer: "پوشش معنایی دقیق، ذکر وجوه ترجمه و مثال‌های متنی برای اتصال بین‌آیه‌ای." },
    { question: "برای مفردات چه روشی پیشنهاد می‌شود؟", answer: "دفترچه واژگان پرتکرار با مرور فاصله‌دار و تمرین تشخیص هم‌ریشه‌ها و مشابهت‌های معنایی." },
    { question: "منابع تفسیر را چگونه انتخاب کنیم؟", answer: "ترکیب منابع آموزشی با مثال‌های روشن و منابع تحلیلی برای درک پیوند آیات و روش‌شناسی." },
    { question: "چطور برنامه مطالعه را پایدار نگه داریم؟", answer: "واحدهای کوچک روزانه، مرور هفتگی، و سنجش با آزمون‌های زمان‌دار." },
    { question: "بهترین زمان برای تست‌زنی چیست؟", answer: "از هفته اول، به‌صورت کوتاه و زمان‌دار، تا خطاها زود شناسایی و اصلاح شوند." },
  ],
  internalLinks: [
    { href: "/blog/azmoon-takhasosi-hefz-quran-1405", label: "ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵", description: "مقاله مادر برای ساختار آزمون و مراحل." },
    { href: "/rahnama-azmoon-hifz-quran", label: "راهنمای آزمون حفظ قرآن", description: "شاخص‌های ارزیابی و پیشنهادهای تمرینی." },
    { href: "/rahnama-samane-test-hefz", label: "راهنمای سامانه تست حفظ", description: "نحوه تمرین و گزارش‌گیری در hefztest." },
  ],
  related: [
    {
      href: "/blog/marhale-azmoon-hefz-1405",
      title: "مراحل آزمون تخصصی حفظ قرآن ۱۴۰۵: مرحله ۱ تا ۴ به زبان ساده",
      excerpt: "هر مرحله دقیقاً چه می‌خواهد و چطور برای آن آماده شویم؟",
      category: "مراحل",
      date: "۱۴۰۵/۰۱/۲۲",
      image: "/logo2.png",
    },
    {
      href: "/blog/ghobooli-dar-azmoon-hefz",
      title: "چگونه در آزمون تخصصی حفظ قرآن قبول شویم؟ برنامه راهبردی و ۳۰ روز تمرین",
      excerpt: "برنامه عملی، اشتباهات رایج و نقش شبیه‌ساز در افزایش موفقیت.",
      category: "قبولی",
      date: "۱۴۰۵/۰۱/۲۵",
      image: "/logo2.png",
    },
  ],
  trustStats: [
    { value: "تمرین زمان‌دار", label: "کنار منابع" },
    { value: "گزارش تحلیلی", label: "خطا و پیشرفت" },
    { value: "بانک سوال", label: "تمرین استاندارد" },
    { value: "مسیر مرحله‌ای", label: "آمادگی هدفمند" },
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
        <section id="translation" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">منابع ترجمه و درک معنا</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>پوشش دقیق معنای آیات با ذکر وجوه احتمالی</li>
            <li>مثال‌های متنی برای پیوند بین‌آیه‌ای</li>
            <li>سازگاری با زبان روان برای فهم سریع‌تر</li>
          </ul>
          <Callout variant="info" title="روش مطالعه ترجمه">
            مطالعه بخش‌بندی‌شده + خلاصه‌نویسی کاربردی + تست زمان‌دار، ترکیب استاندارد برای افزایش دقت است.
          </Callout>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="vocab" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">واژگان و مفردات</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            تمرکز بر واژگان پرتکرار و شبکه هم‌خانواده‌ها، تشابهات معنایی و تمایز کاربردی آنها، کلید موفقیت در مرحله مفردات است.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>فهرست واژگان پرتکرار را با مثال بسازید</li>
            <li>هم‌ریشه‌ها و هم‌معنی‌ها را با تمایز کاربرد یاد بگیرید</li>
            <li>مرور فاصله‌دار برای تثبیت طولانی‌مدت</li>
          </ul>
        </section>
      </ArticleReveal>

      <MidArticleCta
        headline="شبیه‌سازی آزمون تخصصی حفظ قرآن را همین حالا شروع کنید"
        description="منبع خوب بدون تمرین زمان‌دار، نتیجه نمی‌دهد. با hefztest تست بزنید، خطاها را بشناسید و مطالعه را دقیقاً روی نقاط ضعف تنظیم کنید."
        primary={{ href: "/azmoon-hafizan-quran-online", label: "شروع آزمون" }}
        secondary={{ href: "/features", label: "مشاهده امکانات" }}
      />

      <ArticleReveal>
        <section id="tafsir" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">منابع تفسیر و علوم قرآنی</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            ترکیب منابع آموزشی با بیان روشن و منابع تحلیلی برای عمق‌بخشی ضروری است. هدف، درک مبانی و روش‌شناسی و توان تحلیل پیوند آیات است.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>مرور مبانی علوم قرآنی و روش‌های تفسیر</li>
            <li>مطالعه نمونه‌های تفسیری با تاکید بر ارتباطات</li>
            <li>یادداشت‌برداری ساختاریافته از کلیدواژه‌ها</li>
          </ul>
          <Callout variant="success" title="هدف درست">
            هدف از منابع تفسیر، «توان تحلیل» است؛ یعنی بتوانید اتصال مفهومی آیات را توضیح دهید.
          </Callout>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="plan" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-5")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">ساختار برنامه‌ریزی مطالعه</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Callout variant="info" title="اصل تقسیم‌بندی">
              منابع را به واحدهای کوچک روزانه تقسیم کنید، زمان ثابت برای مرور هفتگی بگذارید و روند را ثبت کنید.
            </Callout>
            <Callout variant="warning" title="اشتباه رایج">
              مطالعه حجیم بدون تست‌زنی باعث توهم آمادگی می‌شود. از هفته اول، تست زمان‌دار کوتاه را وارد برنامه کنید.
            </Callout>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5 p-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">ترکیب تمرین</h3>
            <ul className="mt-3 list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
              <li>تست ترجمه و معنا</li>
              <li>دفترچه مفردات + مرور فاصله‌دار</li>
              <li>مرور تفسیری و استخراج پیوندهای بین‌آیه‌ای</li>
            </ul>
          </div>
        </section>
      </ArticleReveal>
    </PremiumArticleLayout>
  );
}
