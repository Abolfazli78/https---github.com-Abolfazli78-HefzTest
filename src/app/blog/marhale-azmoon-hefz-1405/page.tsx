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
  canonicalPath: "/blog/marhale-azmoon-hefz-1405",
  title: "مراحل آزمون تخصصی حفظ قرآن ۱۴۰۵: مرحله ۱ تا ۴ به زبان ساده",
  subtitle:
    "شرح دقیق مرحله کتبی، شفاهی، ترجمه و مفردات، و تفسیر و علوم قرآنی + جدول حد نصاب و مسیر آمادگی حرفه‌ای.",
  category: "مراحل",
  author: { name: "تحریریه hefztest", role: "تحلیل ساختار آزمون" },
  publishedAtISO: "2026-02-25",
  publishedAtLabel: "۱۴۰۵/۰۱/۲۲",
  updatedAtISO: "2026-02-25",
  readingTimeMinutes: 9,
  coverImageUrl: "/logo2.png",
  coverAlt: "مراحل آزمون تخصصی حفظ قرآن ۱۴۰۵",
  toc: [
    { id: "stage1", label: "مرحله اول: کتبی" },
    { id: "stage2", label: "مرحله دوم: شفاهی" },
    { id: "stage3", label: "مرحله سوم: ترجمه و مفردات" },
    { id: "stage4", label: "مرحله چهارم: تفسیر و علوم قرآنی" },
    { id: "passing", label: "جدول حد نصاب" },
    { id: "faq", label: "سوالات متداول" },
    { id: "internal-links", label: "مسیر مطالعه" },
    { id: "related", label: "مقالات مرتبط" },
  ],
  faq: [
    { question: "مرحله کتبی شامل چه بخش‌هایی است؟", answer: "تمرکز بر ترجمه و درک معنا، حفظ و آیات مشابه با سوالات چهارگزینه‌ای و بدون نمره منفی." },
    { question: "مرحله شفاهی چگونه ارزیابی می‌شود؟", answer: "پرسش چندسطری، حسن‌حفظ، تجوید، وقف و ابتدا، صوت و لحن با تاکید بر دقت و پیوستگی." },
    { question: "مرحله ترجمه و مفردات مخصوص چه سطحی است؟", answer: "ویژه حافظان کل و درجات بالاتر برای سنجش شبکه معنایی و واژگان." },
    { question: "مرحله تفسیر و علوم قرآنی شامل چیست؟", answer: "مبانی و روش‌شناسی، تحلیل پیوند آیات و مباحث علوم قرآنی در مسیر درجات عالی." },
    { question: "حد نصاب قبولی کتبی چقدر است؟", answer: "۱۰ جزء: ۳۰/۵۰، ۲۰ جزء: ۶۰/۱۰۰، حافظ کل: ۱۰۵/۱۵۰، درجات ۲ و ۱: ۱۲۰/۱۵۰." },
  ],
  internalLinks: [
    { href: "/blog/azmoon-takhasosi-hefz-quran-1405", label: "ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵", description: "راهنمای مادر مراحل، درجات و ثبت‌نام." },
    { href: "/rahnama-azmoon-hifz-quran", label: "راهنمای آزمون حفظ قرآن", description: "شاخص‌های ارزیابی و چک‌لیست آمادگی." },
    { href: "/rahnama-samane-test-hefz", label: "راهنمای سامانه تست حفظ", description: "نحوه استفاده از شبیه‌ساز و گزارش‌ها." },
  ],
  related: [
    {
      href: "/blog/had-nasab-ghabooli-azmoon-hefz",
      title: "حد نصاب قبولی آزمون تخصصی حفظ قرآن: امتیازدهی و استراتژی نمره بالا",
      excerpt: "حدنصاب‌های کتبی و شفاهی و مسیر افزایش نمره برای قبولی.",
      category: "حد نصاب",
      date: "۱۴۰۵/۰۱/۲۳",
      image: "/logo2.png",
    },
    {
      href: "/blog/ghobooli-dar-azmoon-hefz",
      title: "چگونه در آزمون تخصصی حفظ قرآن قبول شویم؟ برنامه راهبردی و ۳۰ روز تمرین",
      excerpt: "برنامه عملی و اشتباهات رایج برای افزایش احتمال قبولی.",
      category: "قبولی",
      date: "۱۴۰۵/۰۱/۲۵",
      image: "/logo2.png",
    },
  ],
  trustStats: [
    { value: "۲۰+ سال", label: "سؤالات ادوار آزمون" },
    { value: "تمرین زمان‌دار", label: "شبیه‌سازی واقعی" },
    { value: "گزارش تحلیلی", label: "سرعت و خطا" },
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
        <section id="stage1" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">مرحله اول: آزمون کتبی</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            هدف مرحله کتبی سنجش ترجمه و درک معنا، حفظ و آیات مشابه است. الگوی رایج، تست‌های چهارگزینه‌ای و بدون نمره منفی است؛ بنابراین مدیریت زمان و کاهش
            خطای مشابهت‌ها، تعیین‌کننده عبور از این مرحله است.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Callout variant="info" title="ترکیب مهارتی نمونه">
              برای هر جزء معمولاً پرسش‌های معنا/ترجمه و پرسش‌های حفظ/مشابهت طرح می‌شود.
            </Callout>
            <Callout variant="success" title="نکات قبولی">
              تمرین زمان‌دار + مرور هدفمند مشابهت‌ها + تحلیل خطاها، سریع‌ترین مسیر افزایش نمره است.
            </Callout>
          </div>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="stage2" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">مرحله دوم: آزمون شفاهی</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            در شفاهی، حسن‌حفظ، انتقال بین آیات، دقت در تجوید، وقف و ابتدا و کیفیت صوت و لحن ارزیابی می‌شود. پرسش‌های چندسطری رایج است و تسلط عملی حافظ را
            می‌سنجد.
          </p>
          <Callout variant="warning" title="دام رایج شفاهی">
            مکث‌های طولانی و تداخل آیات مشابه؛ این دو مورد بیشترین افت امتیاز را ایجاد می‌کند.
          </Callout>
        </section>
      </ArticleReveal>

      <MidArticleCta
        headline="شبیه‌سازی آزمون تخصصی حفظ قرآن را همین حالا شروع کنید"
        description="برای مرحله کتبی آزمون‌های زمان‌دار بزنید و برای شفاهی سناریوهای چندسطری را تمرین کنید. hefztest گزارش تحلیلی خطاها را به شما می‌دهد."
        primary={{ href: "/azmoon-hafizan-quran-online", label: "شروع آزمون" }}
        secondary={{ href: "/features", label: "مشاهده امکانات" }}
      />

      <ArticleReveal>
        <section id="stage3" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">مرحله سوم: ترجمه و مفردات</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            ویژه حافظان کل و درجات بالاتر. هدف، سنجش عمق معناشناسی و تسلط واژگانی است. سهم پرسش‌ها معمولاً به‌گونه‌ای است که دقت ترجمه و شبکه معنایی
            واژگان را مشخص می‌کند.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>دفترچه مفردات پرتکرار بسازید و مرور فاصله‌دار انجام دهید</li>
            <li>وجوه معنایی مشابه و متفاوت را با مثال تمرین کنید</li>
            <li>آیات دارای اتصال مفهومی را برای تثبیت معنا مرور کنید</li>
          </ul>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="stage4" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">مرحله چهارم: تفسیر و علوم قرآنی</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            در مسیر درجات عالی، مبانی تفسیر، روش‌شناسی و پیوند آیات بررسی می‌شود. هدف، توان تحلیل و تبیین است؛ نه صرفاً حفظ متن.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>مرور مفاهیم کلیدی علوم قرآنی و روش‌های تفسیر</li>
            <li>تحلیل نمونه‌های تفسیری با تمرکز بر ارتباط بین‌آیه‌ای</li>
            <li>یادداشت‌برداری ساختاریافته و مرور منظم</li>
          </ul>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="passing" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">جدول حد نصاب قبولی مرحله کتبی</h2>
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
        </section>
      </ArticleReveal>
    </PremiumArticleLayout>
  );
}
