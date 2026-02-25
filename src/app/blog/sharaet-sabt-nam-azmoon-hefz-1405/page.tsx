import type { Metadata } from "next";
import Link from "next/link";
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
  canonicalPath: "/blog/sharaet-sabt-nam-azmoon-hefz-1405",
  title: "شرایط ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵: مدارک، هزینه و خطاهای رایج",
  subtitle:
    "راهنمای رسمی و آموزشی شرایط ثبت‌نام: احراز صلاحیت، مدارک لازم، هم‌ترازی علمی، هزینه ثبت‌نام و پرتکرارترین اشتباهات ثبت‌نام.",
  category: "آیین‌نامه",
  author: { name: "تحریریه hefztest", role: "راهنمای ثبت‌نام و آمادگی" },
  publishedAtISO: "2026-02-25",
  publishedAtLabel: "۱۴۰۵/۰۱/۲۰",
  updatedAtISO: "2026-02-25",
  readingTimeMinutes: 10,
  coverImageUrl: "/logo2.png",
  coverAlt: "شرایط ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵",
  toc: [
    { id: "eligibility", label: "شرایط احراز صلاحیت" },
    { id: "equivalency", label: "هم‌ترازی علمی مدرک" },
    { id: "docs", label: "چک‌لیست مدارک" },
    { id: "cost", label: "هزینه ثبت‌نام" },
    { id: "mistakes", label: "خطاهای رایج" },
    { id: "faq", label: "سوالات متداول" },
    { id: "internal-links", label: "مسیر مطالعه" },
    { id: "related", label: "مقالات مرتبط" },
  ],
  faq: [
    {
      question: "شرایط ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵ چیست؟",
      answer: "حداقل ۱۰ جزء پیوسته برای شروع، مدارک هویتی معتبر، بارگذاری صحیح مستندات و پذیرش آیین‌نامه دوره. مسیرهای ۲۰ و ۳۰ جزء نیاز به تسلط متناسب دارند.",
    },
    {
      question: "مدارک لازم برای ثبت‌نام کدام است؟",
      answer: "تصویر شناسنامه، کارت ملی، عکس پرسنلی زمینه روشن و در صورت لزوم گواهی وضعیت نظام وظیفه. فایل‌ها باید خوانا و بدون برش اطلاعات باشند.",
    },
    {
      question: "آیا شرط سنی برای ثبت‌نام وجود دارد؟",
      answer: "به‌طور معمول محدودیت سنی برای آغاز فرآیند ثبت‌نام اعلام نمی‌شود؛ اما برخی درجات عالی ممکن است پیش‌نیازهایی مانند سابقه آموزشی داشته باشند.",
    },
    {
      question: "هزینه ثبت‌نام آزمون چقدر است؟",
      answer: "مبلغ دقیق در اطلاعیه همان دوره اعلام می‌شود. الگوی رایج: پرداخت آنلاین در زمان ثبت‌نام و عدم استرداد در بسیاری از موارد.",
    },
    {
      question: "در صورت خطا در اطلاعات ثبت‌نام چه باید کرد؟",
      answer: "در بازه ویرایش اطلاعات، موارد نادرست را اصلاح کنید. پس از پایان مهلت، تغییرات تابع رویه‌های همان دوره است.",
    },
    { question: "آیا آزمون کتبی نمره منفی دارد؟", answer: "الگوی رایج بدون نمره منفی است؛ تمرین مدیریت زمان و کاهش خطا در آیات مشابه اهمیت بالایی دارد." },
    {
      question: "معادل‌سازی مدرک تخصصی چگونه است؟",
      answer: "درجات مدرک از هم‌تراز دیپلم تا هم‌تراز دکتری تعریف می‌شود؛ پذیرش علمی و اداری مشروط به احراز شرایط و قبولی در مراحل آزمون است.",
    },
    { question: "نحوه ثبت‌نام اینترنتی چگونه است؟", answer: "ثبت‌نام اینترنتی و با بارگذاری مدارک انجام می‌شود؛ آماده‌سازی فایل‌ها پیش از ورود به سامانه توصیه می‌گردد." },
    { question: "چه خطاهایی بیشترین رد ثبت‌نام را ایجاد می‌کند؟", answer: "مدارک بی‌کیفیت، عدم پیوستگی اجزاء در مسیرهای ۱۰ و ۲۰ جزء، اطلاعات هویتی نادرست و عدم رعایت فرمت عکس پرسنلی." },
    { question: "برای موفقیت در ثبت‌نام و قبولی چه توصیه‌ای دارید؟", answer: "چک‌لیست مدارک را کامل کنید، اطلاعات را دوباره بررسی کنید و با شبیه‌ساز زمان‌دار تمرین کنید تا سرعت و دقت افزایش یابد." },
  ],
  internalLinks: [
    {
      href: "/blog/azmoon-takhasosi-hefz-quran-1405",
      label: "ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵: شرایط و مراحل",
      description: "مقاله مادر: ساختار آزمون، درجات، حدنصاب‌ها و مسیر آمادگی.",
    },
    {
      href: "/rahnama-azmoon-hifz-quran",
      label: "راهنمای آزمون حفظ قرآن",
      description: "چک‌لیست معیارهای ارزیابی و پیشنهاد برنامه تمرین.",
    },
    {
      href: "/rahnama-samane-test-hefz",
      label: "راهنمای سامانه تست حفظ",
      description: "آموزش استفاده از امکانات و گزارش‌های تحلیلی hefztest.",
    },
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
      title: "مراحل آزمون تخصصی حفظ قرآن ۱۴۰۵: کتبی، شفاهی، ترجمه و تفسیر",
      excerpt: "شناخت مرحله‌ای آزمون برای برنامه‌ریزی حرفه‌ای.",
      category: "مراحل",
      date: "۱۴۰۵/۰۱/۲۲",
      image: "/logo2.png",
    },
  ],
  trustStats: [
    { value: "۲۰+ سال", label: "سؤالات ادوار آزمون" },
    { value: "۱۰۰۰+", label: "کاربر فعال" },
    { value: "گزارش تحلیلی", label: "سرعت و خطا" },
    { value: "تمرین زمان‌دار", label: "آمادگی واقعی" },
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
        <section id="eligibility" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">
            شرایط احراز صلاحیت (Eligibility)
          </h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            برای آغاز ثبت‌نام، داشتن حداقل «۱۰ جزء پیوسته» الزامی است. مسیرهای ۲۰ جزء و حافظ کل نیز باید متناسب با حجم انتخابی، از تسلط کافی برخوردار باشند.
            پیوستگی اجزاء در مسیرهای ۱۰ و ۲۰ جزء یک معیار کلیدی است و حفظ پراکنده معمولاً امتیاز لازم را ایجاد نمی‌کند.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>حداقل ۱۰ جزء پیوسته برای شروع فرایند ثبت‌نام</li>
            <li>تسلط متناسب برای مسیرهای ۲۰ جزء و حافظ کل</li>
            <li>تکمیل فرم‌های اینترنتی و پذیرش آیین‌نامه دوره</li>
            <li>بارگذاری مدارک هویتی معتبر با کیفیت استاندارد</li>
          </ul>
          <div className="text-sm text-slate-700 dark:text-slate-300">
            مطالعه تکمیلی:{" "}
            <Link className="underline text-emerald-700 dark:text-emerald-300" href="/azmoon-takhasosi-hefz-quran-1405">
              ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵: شرایط و مراحل
            </Link>
          </div>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="equivalency" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">
            هم‌ترازی علمی مدرک تخصصی (Academic Equivalency)
          </h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            مدرک تخصصی حفظ قرآن، در چارچوب پذیرفته‌شده ادوار گذشته، از سطوح هم‌تراز دیپلم تا دکتری تعریف می‌شود. این هم‌ترازی، پذیرش سطح علمی حافظان را
            در بسترهای آموزشی و اداری تسهیل می‌کند؛ البته احراز هر سطح منوط به قبولی در مراحل مربوط به همان مسیر است.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-right border-b">
                  <th className="py-3 px-4">درجه</th>
                  <th className="py-3 px-4">حجم حفظ</th>
                  <th className="py-3 px-4">هم‌ترازی نمونه</th>
                  <th className="py-3 px-4">نکته احراز</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">۵</td>
                  <td className="py-3 px-4">۱۰ جزء پیوسته</td>
                  <td className="py-3 px-4">هم‌تراز دیپلم</td>
                  <td className="py-3 px-4">درک معنا و آیات مشابه پایه</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">۴</td>
                  <td className="py-3 px-4">۲۰ جزء پیوسته</td>
                  <td className="py-3 px-4">هم‌تراز کاردانی</td>
                  <td className="py-3 px-4">دامنه مشابهت گسترده‌تر</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">۳</td>
                  <td className="py-3 px-4">حافظ کل</td>
                  <td className="py-3 px-4">هم‌تراز کارشناسی</td>
                  <td className="py-3 px-4">حسن‌حفظ و درک معنا</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">۲</td>
                  <td className="py-3 px-4">حافظ ممتاز</td>
                  <td className="py-3 px-4">هم‌تراز کارشناسی ارشد</td>
                  <td className="py-3 px-4">ترجمه و مفردات سخت‌گیرانه‌تر</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">۱</td>
                  <td className="py-3 px-4">استاد حفظ</td>
                  <td className="py-3 px-4">هم‌تراز دکتری</td>
                  <td className="py-3 px-4">تفسیر و علوم قرآنی + سوابق آموزشی</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Callout variant="success" title="جمع‌بندی کاربردی">
            انتخاب مسیر درست، هم احتمال قبولی را بالا می‌برد و هم فرآیند هم‌ترازی را قابل اتکا می‌کند.
          </Callout>
        </section>
      </ArticleReveal>

      <MidArticleCta
        headline="شبیه‌سازی آزمون تخصصی حفظ قرآن را همین حالا شروع کنید"
        description="برای ثبت‌نام بی‌خطا و قبولی مطمئن، قبل از هر چیز سطح خود را با آزمون‌های زمان‌دار بسنجید و مسیر را درست انتخاب کنید."
        primary={{ href: "/azmoon-hafizan-quran-online", label: "شروع آزمون" }}
        secondary={{ href: "/features", label: "مشاهده امکانات" }}
      />

      <ArticleReveal>
        <section id="docs" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">
            چک‌لیست مدارک لازم برای ثبت‌نام
          </h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            پیش از ورود به سامانه، مدارک زیر را با کیفیت مناسب آماده کنید. خوانایی، اندازه صحیح و پرهیز از برش اطلاعات الزامی است.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>تصویر صفحه اول شناسنامه</li>
            <li>تصویر کارت ملی</li>
            <li>عکس پرسنلی زمینه روشن با نسبت استاندارد</li>
            <li>مدرک وضعیت نظام وظیفه (در صورت لزوم)</li>
          </ul>
          <div className="text-sm text-slate-700 dark:text-slate-300">
            راهنمای اجرا:{" "}
            <Link className="underline text-emerald-700 dark:text-emerald-300" href="/rahnama-samane-test-hefz">
              راهنمای سامانه تست حفظ
            </Link>
          </div>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="cost" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">
            هزینه ثبت‌نام و ملاحظات پرداخت
          </h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            مبلغ دقیق ثبت‌نام در اطلاعیه همان دوره اعلام می‌شود. الگوی رایج، پرداخت آنلاین در زمان ثبت‌نام است و در بسیاری از موارد، وجه پرداخت‌شده قابل
            استرداد نیست؛ بنابراین پیش از پرداخت، اطلاعات را دوباره بررسی کنید.
          </p>
          <Callout variant="warning" title="قبل از پرداخت">
            مسیر (۱۰/۲۰/۳۰ جزء) و کیفیت مدارک آپلودشده را بررسی کنید؛ بسیاری از مشکلات از همین دو مورد ایجاد می‌شود.
          </Callout>
        </section>
      </ArticleReveal>

      <ArticleReveal>
        <section id="mistakes" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-5")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">
            خطاهای رایج ثبت‌نام و راهکار پیشگیری
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Callout variant="important" title="مدارک بی‌کیفیت">
              تصاویر تار یا برش‌خورده، یکی از پرتکرارترین دلایل رد شدن پرونده است. قبل از آپلود، خوانایی را کنترل کنید.
            </Callout>
            <Callout variant="warning" title="عدم پیوستگی اجزاء">
              برای مسیر ۱۰ و ۲۰ جزء، حفظ پراکنده ریسک رد شدن یا افت امتیاز را بالا می‌برد. بازه‌های پیوسته را دقیق انتخاب کنید.
            </Callout>
            <Callout variant="info" title="اطلاعات هویتی نادرست">
              اختلاف کوچک در نام/کد ملی/تاریخ تولد ممکن است مشکل ایجاد کند؛ قبل از نهایی‌سازی یک‌بار دیگر بررسی کنید.
            </Callout>
            <Callout variant="success" title="راه حل سریع">
              قبل از ثبت‌نام، یک آزمون زمان‌دار بزنید و با نتیجه، مسیر مناسب را انتخاب کنید.
            </Callout>
          </div>
        </section>
      </ArticleReveal>
    </PremiumArticleLayout>
  );
}
