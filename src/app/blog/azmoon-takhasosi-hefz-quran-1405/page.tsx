import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ARTICLE_TOKENS,
  Callout,
  PremiumArticleLayout,
  PremiumComparisonTable,
  type PremiumArticleData,
} from "@/components/article/premium-article-layout";
import { ArticleReveal, MidArticleCta } from "@/components/article/article-interactions";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hefztest.ir";

const data: PremiumArticleData = {
  baseUrl,
  canonicalPath: "/blog/azmoon-takhasosi-hefz-quran-1405",
  title: "ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵: شرایط، مراحل، حد نصاب و راهنمای قبولی",
  subtitle:
    "راهنمای جامع و ساخت‌یافته برای ثبت‌نام، درجات مدرک، زمان‌بندی، ساختار کتبی و شفاهی، مراحل تکمیلی و مسیر آمادگی حرفه‌ای.",
  category: "راهنما",
  author: { name: "تحریریه hefztest", role: "راهنمای رسمی و آموزشی" },
  publishedAtISO: "2026-02-25",
  publishedAtLabel: "۱۴۰۵/۰۱/۱۵",
  updatedAtISO: "2026-02-25",
  readingTimeMinutes: 18,
  coverImageUrl: "/logo2.png",
  coverAlt: "ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵",
  toc: [
    { id: "what", label: "آزمون چیست و چرا مهم است؟" },
    { id: "equivalency", label: "وضعیت رسمی و هم‌ترازی" },
    { id: "degrees", label: "درجات مدرک" },
    { id: "conditions", label: "شرایط ثبت نام و مدارک" },
    { id: "timeline", label: "زمان‌بندی" },
    { id: "written", label: "ساختار آزمون کتبی" },
    { id: "passing", label: "حد نصاب قبولی" },
    { id: "oral", label: "ارزیابی شفاهی" },
    { id: "stages34", label: "مرحله سوم و چهارم" },
    { id: "exemptions", label: "معافیت‌ها" },
    { id: "prep", label: "آمادگی" },
    { id: "why-sim", label: "چرا شبیه‌سازی؟" },
    { id: "compare", label: "مقایسه" },
    { id: "faq", label: "سوالات متداول" },
    { id: "internal-links", label: "مسیر مطالعه" },
    { id: "related", label: "مقالات مرتبط" },
  ],
  faq: [
    {
      question: "آزمون تخصصی حفظ قرآن ۱۴۰۵ چیست و برای چه کسانی مناسب است؟",
      answer: "یک ارزیابی چندمرحله‌ای برای سنجش تسلط بر محفوظات، معناشناسی و مهارت‌های شفاهی؛ مناسب حافظان ۱۰، ۲۰ و ۳۰ جزء و متقاضیان درجات عالی.",
    },
    { question: "آیا آزمون کتبی نمره منفی دارد؟", answer: "الگوی رایج بدون نمره منفی است و تمرکز بر دقت و مدیریت زمان است." },
    {
      question: "حد نصاب قبولی مرحله کتبی چقدر است؟",
      answer: "۱۰ جزء: ۳۰ از ۵۰؛ ۲۰ جزء: ۶۰ از ۱۰۰؛ حافظ کل: ۱۰۵ از ۱۵۰؛ درجات ۲ و ۱: ۱۲۰ از ۱۵۰.",
    },
    { question: "ساختار آزمون شفاهی چگونه است؟", answer: "پرسش چندسطری، ارزیابی حسن‌حفظ، تجوید، وقف و ابتدا و سنجش صوت و لحن." },
    { question: "چه مدارکی برای ثبت‌نام لازم است؟", answer: "شناسنامه، کارت ملی، عکس پرسنلی و مدارک وضعیت نظام وظیفه در صورت لزوم." },
    {
      question: "مرحله سوم و چهارم شامل چه محتوایی است؟",
      answer: "مرحله سوم بر ترجمه و مفردات تمرکز دارد و مرحله چهارم بر تفسیر و علوم قرآنی در مسیر درجات عالی.",
    },
    { question: "از کجا تمرین را شروع کنم؟", answer: "از شبیه‌ساز آنلاین آزمون حافظان قرآن در hefztest شروع کنید." },
  ],
  internalLinks: [
    { href: "/azmoon-hafizan-quran-online", label: "شبیه‌ساز آنلاین آزمون حافظان قرآن", description: "آزمون زمان‌دار و سنجش واقعی." },
    { href: "/bank-soal-azmoon-hifz", label: "بانک سوال آزمون حفظ", description: "تمرین پرتکرار و هدفمند." },
    { href: "/rahnama-azmoon-hifz-quran", label: "راهنمای آزمون حفظ قرآن", description: "چک‌لیست ارزیابی و پیشنهاد تمرین." },
    { href: "/features", label: "امکانات hefztest", description: "قابلیت‌های تحلیلی و مسیرهای تمرینی." },
    { href: "/pricing", label: "طرح‌های عضویت", description: "مشاهده پلن‌ها و انتخاب مسیر." },
  ],
  related: [
    {
      href: "/blog/had-nasab-ghabooli-azmoon-hefz",
      title: "حد نصاب قبولی آزمون تخصصی حفظ قرآن: امتیازدهی و استراتژی نمره بالا",
      excerpt: "حدنصاب‌های کتبی و شفاهی و مسیر افزایش نمره برای عبور مطمئن.",
      category: "حد نصاب",
      date: "۱۴۰۵/۰۱/۲۳",
      image: "/logo2.png",
    },
    {
      href: "/blog/sharaet-sabt-nam-azmoon-hefz-1405",
      title: "شرایط ثبت نام آزمون تخصصی حفظ قرآن ۱۴۰۵: مدارک، هزینه و خطاهای رایج",
      excerpt: "چک‌لیست مدارک و نکات ثبت‌نام بی‌خطا، مطابق الگوی دوره‌های قبل.",
      category: "آیین‌نامه",
      date: "۱۴۰۵/۰۱/۲۰",
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
        <section id="what" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-relaxed">
            آزمون تخصصی حفظ قرآن چیست و چرا اهمیت دارد؟
          </h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            آزمون تخصصی حفظ قرآن، سازوکار رسمی ارزیابی تسلط حافظان بر محفوظات، درک معنا، تشخیص آیات مشابه و مهارت‌های تجوید، صوت و لحن است.
            خروجی این ارزیابی «مدرک تخصصی حفظ قرآن» است که جایگاه علمی و اداری مشخصی دارد و برای فعالیت‌های آموزشی، پژوهشی و حرفه‌ای قرآنی
            یک امتیاز مهم محسوب می‌شود. این آزمون در چند مرحله برگزار می‌شود و عبور از هر مرحله برای ورود به مرحله بعد ضروری است.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>سنجش دقیق میزان تسلط بر محفوظات و آیات مشابه</li>
            <li>ارزیابی درک معنای آیات و ترجمه در سطوح مختلف</li>
            <li>بررسی مهارت‌های تجوید، وقف و ابتدا و حسن‌حفظ</li>
            <li>سنجش توانمندی‌های تکمیلی مانند مفردات، علوم قرآنی و تفسیر در درجات بالاتر</li>
          </ul>
          <Callout variant="info" title="هدف این مقاله">
            این صفحه، اطلاعات پراکنده آزمون را به یک مسیر عملی برای ثبت‌نام و قبولی تبدیل می‌کند.
          </Callout>
        </section>
      </ArticleReveal>

        <section id="equivalency" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">وضعیت رسمی و هم‌ترازی تحصیلی مدرک تخصصی</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            مدرک تخصصی حفظ قرآن یک گواهی رسمی و دارای هم‌ترازی علمی با مقاطع تحصیلی رایج است. بر اساس چارچوب‌های سال‌های گذشته،
            درجات این مدرک از سطح معادل دیپلم تا هم‌تراز دکتری تعریف می‌شود. این هم‌ترازی به‌منزله پذیرش سطح علمی حافظان در محیط‌های دانشگاهی و اداری است،
            مشروط به طی موفق مراحل آزمون و احراز صلاحیت طبق آیین‌نامه‌های هر دوره.
          </p>
          <Callout variant="success" title="پیام کلیدی">
            اگر هدف شما دریافت مدرک است، از ابتدا مسیر و درجه را دقیق انتخاب کنید و تمرین را داده‌محور پیش ببرید.
          </Callout>
        </section>

        <section id="degrees" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">درجات مدرک و شرایط احراز</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            جدول زیر تصویری روشن از درجات مدرک تخصصی حفظ قرآن، هم‌ترازی و شرایط احراز ارائه می‌دهد.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-right border-b">
                  <th className="py-2">درجه</th>
                  <th className="py-2">حجم حفظ</th>
                  <th className="py-2">هم‌ترازی علمی</th>
                  <th className="py-2">شرایط احراز نمونه</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">۵</td>
                  <td className="py-2">حافظ ۱۰ جزء پیوسته</td>
                  <td className="py-2">هم‌تراز دیپلم</td>
                  <td className="py-2">تسلط بر ۱۰ جزء پیوسته و درک معنای آیات</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">۴</td>
                  <td className="py-2">حافظ ۲۰ جزء پیوسته</td>
                  <td className="py-2">هم‌تراز کاردانی</td>
                  <td className="py-2">تسلط بر ۲۰ جزء پیوسته و درک معنا</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">۳</td>
                  <td className="py-2">حافظ کل قرآن</td>
                  <td className="py-2">هم‌تراز کارشناسی</td>
                  <td className="py-2">حفظ کل، حسن‌حفظ و درک معنا</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">۲</td>
                  <td className="py-2">حافظ ممتاز</td>
                  <td className="py-2">هم‌تراز کارشناسی ارشد</td>
                  <td className="py-2">حفظ کل، ترجمه و مفردات با استاندارد بالاتر</td>
                </tr>
                <tr>
                  <td className="py-2">۱</td>
                  <td className="py-2">استاد حفظ</td>
                  <td className="py-2">هم‌تراز دکتری</td>
                  <td className="py-2">حفظ کل، تسلط بر علوم قرآنی و تفسیر، سوابق علمی</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            معیار «پیوستگی اجزاء» برای درجات ۵ و ۴ اهمیت دارد؛ به‌عنوان نمونه مجموعه‌های ۱ تا ۱۰ یا ۱۳ تا ۲۲ یا ۲۱ تا ۳۰ پذیرفته می‌شود،
            اما حفظ پراکنده امتیاز لازم را ایجاد نمی‌کند.
          </p>
          <Callout variant="warning" title="هشدار مهم">
            برای مسیرهای ۱۰ و ۲۰ جزء، پیوستگی اجزاء را قبل از ثبت‌نام احراز کنید تا در مراحل بعدی دچار ریسک رد یا افت امتیاز نشوید.
          </Callout>
        </section>

        <MidArticleCta
          headline="شبیه‌سازی آزمون تخصصی حفظ قرآن را همین حالا شروع کنید"
          description="قبل از ثبت‌نام، سطح واقعی خود را با آزمون‌های زمان‌دار بسنجید. با گزارش تحلیلی hefztest، تمرین را روی آیات مشابه و نقاط ضعف متمرکز کنید."
          primary={{ href: "/azmoon-hafizan-quran-online", label: "شروع آزمون" }}
          secondary={{ href: "/features", label: "مشاهده امکانات" }}
        />

        <section id="conditions" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">شرایط ثبت نام آزمون حفظ قرآن ۱۴۰۵</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            چارچوب‌های سال‌های گذشته نشان می‌دهد که شرایط عمومی برای ثبت‌نام عمدتاً بر احراز حداقل حجم حفظ، مدارک هویتی معتبر و بارگذاری صحیح
            مستندات تکیه دارد. ثبت‌نام به‌صورت اینترنتی انجام می‌شود و مطالعه دقیق اطلاعیه دوره الزامی است.
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">شرایط عمومی</h3>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>حداقل ۱۰ جزء پیوسته برای آغاز فرایند</li>
            <li>بارگذاری مدارک هویتی معتبر و عکس پرسنلی</li>
            <li>پذیرش قوانین و آیین‌نامه‌های دوره</li>
            <li>پرداخت هزینه ثبت‌نام طبق اطلاعیه همان دوره</li>
          </ul>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">مدارک لازم</h3>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>تصویر صفحه اول شناسنامه</li>
            <li>تصویر کارت ملی</li>
            <li>عکس پرسنلی با زمینه روشن</li>
            <li>مدرک یا گواهی وضعیت نظام وظیفه در صورت لزوم</li>
          </ul>
        </section>

        <section id="timeline" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">زمان‌بندی پیشنهادی بر پایه الگوی سال‌های گذشته</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            با توجه به روند ادوار قبل، تقویم زیر یک برآورد عملی برای برنامه‌ریزی داوطلبان است. تاریخ‌های دقیق، در اطلاعیه همان دوره اعلام می‌شود.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>آغاز ثبت‌نام: اواخر بهمن ۱۴۰۴</li>
            <li>پایان ثبت‌نام: نیمه اسفند ۱۴۰۴</li>
            <li>مهلت ویرایش اطلاعات: چند روز پس از پایان ثبت‌نام</li>
            <li>مرحله اول (کتبی): اردیبهشت ۱۴۰۵</li>
            <li>مرحله دوم (شفاهی): بازه‌های تیر و آبان ۱۴۰۵</li>
            <li>مراحل تکمیلی: طبق اعلان دوره</li>
          </ul>
        </section>

        <section id="written" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">ساختار آزمون کتبی: مهارت‌ها و سهم هر بخش</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            آزمون کتبی با هدف سنجش تسلط بر «حفظ»، «آیات مشابه» و «درک معنا» برگزار می‌شود. الگوی مرسوم، پرسش‌های چهارگزینه‌ای و بدون نمره منفی است.
            تمرکز اصلی روی ترجمه، پیوند آیات و تشخیص مشابهت‌ها قرار دارد تا عمق حفظ و دقت حافظ سنجیده شود.
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">ترکیب نمونه پرسش‌ها</h3>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>برای هر جزء: ۳ پرسش از ترجمه و درک معنا</li>
            <li>برای هر جزء: ۲ پرسش از حفظ و مشابهت آیات</li>
            <li>سؤالات چهارگزینه‌ای و بدون نمره منفی</li>
          </ul>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">جدول ساختار آزمون کتبی بر حسب مسیر</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-right border-b">
                  <th className="py-2">مسیر</th>
                  <th className="py-2">حجم سؤالات</th>
                  <th className="py-2">ترکیب مهارتی نمونه</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">۱۰ جزء</td>
                  <td className="py-2">۵۰ سؤال</td>
                  <td className="py-2">ترجمه و معنا، حفظ و مشابهت، مدیریت زمان پاسخ‌گویی</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">۲۰ جزء</td>
                  <td className="py-2">۱۰۰ سؤال</td>
                  <td className="py-2">بار شناختی بالاتر در معناشناسی، دامنه وسیع‌تر مشابهت‌ها</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">۳۰ جزء (درجه ۳)</td>
                  <td className="py-2">۱۵۰ سؤال</td>
                  <td className="py-2">معناشناسی عمیق‌تر و مشابهت‌های گسترده</td>
                </tr>
                <tr>
                  <td className="py-2">۳۰ جزء (درجه ۲ و ۱)</td>
                  <td className="py-2">۱۵۰ سؤال</td>
                  <td className="py-2">سطح دشواری بالاتر، دقت ترجمه و واژگان، تله‌های مشابهتی</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="passing" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">حد نصاب قبولی مرحله کتبی</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            حد نصاب‌های نمونه زیر بر اساس الگوی دوره‌های قبل برای برنامه‌ریزی آموزشی مفید است.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-right border-b">
                  <th className="py-2">مسیر</th>
                  <th className="py-2">تعداد سؤال</th>
                  <th className="py-2">حد نصاب قبولی</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">حافظ ۱۰ جزء</td>
                  <td className="py-2">۵۰ سؤال</td>
                  <td className="py-2">حداقل ۳۰ پاسخ صحیح</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">حافظ ۲۰ جزء</td>
                  <td className="py-2">۱۰۰ سؤال</td>
                  <td className="py-2">حداقل ۶۰ پاسخ صحیح</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">حافظ کل (درجه ۳)</td>
                  <td className="py-2">۱۵۰ سؤال</td>
                  <td className="py-2">حداقل ۱۰۵ پاسخ صحیح</td>
                </tr>
                <tr>
                  <td className="py-2">درجات ۲ و ۱</td>
                  <td className="py-2">۱۵۰ سؤال</td>
                  <td className="py-2">حداقل ۱۲۰ پاسخ صحیح</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            موفقیت در آزمون کتبی شرط ورود به مرحله شفاهی است.
          </p>
        </section>

        <section id="oral" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">آزمون شفاهی: شاخص‌های ارزیابی و امتیازدهی</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            در مرحله شفاهی، تسلط بر حفظ در شرایط پرسش مستقیم، دقت در اجرای قواعد تجوید، کیفیت وقف و ابتدا و حسن‌حفظ سنجیده می‌شود.
            الگوی رایج، پرسش‌های چندبخشی از صفحات قرآن و ارزیابی‌های تکمیلی صوت و لحن است.
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>پرسش‌های چندسطری از متن ۱۵ سطری قرآن</li>
            <li>ارزیابی حسن‌حفظ و تسلط در انتقال بین آیات</li>
            <li>دقت در قواعد تجوید و مخارج حروف</li>
            <li>سنجش وقف و ابتدا و پیوند معنایی</li>
            <li>کیفیت صوت و لحن و یکپارچگی اداء</li>
          </ul>
          <Callout variant="success" title="تمرین پیشنهادی">
            شفاهی را با سناریوهای چندسطری تمرین کنید تا انتقال بین آیات و کنترل مکث‌ها تقویت شود.
          </Callout>
        </section>

        <section id="stages34" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">مرحله سوم و چهارم: ترجمه، مفردات، تفسیر و علوم قرآنی</h2>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">مرحله سوم: ترجمه و مفردات</h3>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            ویژه حافظان کل و درجات بالاتر: سؤالات ترکیبی از ترجمه آیات و مفردات قرآنی. در الگوی مرسوم، حجم سؤالات به‌گونه‌ای است که تسلط
            عمیق بر شبکه معنایی واژگان و فهم دقیق اتصال معنایی آیات را می‌سنجد.
          </p>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">مرحله چهارم: تفسیر و علوم قرآنی</h3>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            در مسیر استادی و درجات عالی، دانش تفسیر و مباحث علوم قرآنی ارزیابی می‌شود. مباحث آزمون با تأکید بر فهم مبانی، روش‌شناسی،
            تحلیل پیوند آیات و کاربرد عملی در قرائت و تعلیم می‌تواند طرح گردد. احراز برخی پیش‌نیازها مانند سابقه علمی و آموزشی محتمل است.
          </p>
        </section>

        <section id="exemptions" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">معافیت‌ها: چه کسانی از بخشی از مراحل معاف می‌شوند؟</h2>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            چارچوب‌های دوره‌های قبل نشان می‌دهد، برخی داوطلبان بنا به سوابق علمی یا رتبه‌های شاخص در رقابت‌های معتبر، از بخشی از مراحل
            ارزیابی معاف می‌شوند. جزئیات هر دوره در اطلاعیه همان دوره اعلام می‌شود؛ نمونه مصادیق رایج:
          </p>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>دارندگان سوابق تحصیلی یا پژوهشی مرتبط با حوزه قرآن</li>
            <li>رتبه‌های برتر رقابت‌های معتبر قرآنی</li>
            <li>داوطلبانی که در ادوار پیشین مراحل بالاتر را گذرانده‌اند</li>
          </ul>
        </section>

        <section id="prep" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">نقشه راه آمادگی حرفه‌ای</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>بازبینی روزانه با چرخه‌های مرور فاصله‌دار برای تثبیت بلندمدت</li>
            <li>تمرین هدفمند آیات مشابه برای کاهش خطاهای جابه‌جایی</li>
            <li>گسترش دامنه معناشناسی؛ ترجمه، پیوندهای درون‌متنی و مفردات</li>
            <li>تمرین مدیریت زمان در تست‌های ۵۰، ۱۰۰ و ۱۵۰ سؤالی</li>
            <li>شبیه‌سازی شرایط واقعی آزمون برای کنترل اضطراب و افزایش تمرکز</li>
            <li>تصحیح مستمر خطاها با بازخورد تحلیلی و دفترچه خطا</li>
          </ul>
        </section>

        <section id="why-sim" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">چرا شبیه‌سازی hefztest نرخ موفقیت را افزایش می‌دهد؟</h2>
          <ul className="list-disc pr-6 space-y-2 text-slate-700 dark:text-slate-300 leading-8">
            <li>آشنایی با سبک سؤالات و الگوهای پرتکرار</li>
            <li>اندازه‌گیری پیشرفت با گزارش‌های تحلیلی و دقت‌سنجی</li>
            <li>بهینه‌سازی منابع و زمان با تمرکز بر نقاط ضعف</li>
            <li>افزایش سرعت پاسخ‌گویی و دقت در جزئیات</li>
          </ul>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            در hefztest می‌توانید با دسترسی به بانک استاندارد سؤالات و شبیه‌سازی سازگار با ساختار چند دوره،
            تمرین مرحله‌ای انجام دهید، عملکرد خود را تحلیل کنید و برای عبور از حد نصاب‌های کتبی و شفاهی آماده شوید.
          </p>
        </section>

        <section id="compare" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8 space-y-4")}>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">مقایسه ساختاری: آزمون رسمی در برابر شبیه‌ساز hefztest</h2>
          <PremiumComparisonTable
            rows={[
              {
                label: "نوع سوال",
                a: "چهارگزینه‌ای، بدون نمره منفی، تمرکز بر معنا و مشابهت",
                b: "سؤال‌های استاندارد چنددوره و تمرین پرتکرار",
              },
              {
                label: "مدیریت زمان",
                a: "ساعت‌بندی ثابت برحسب مسیر",
                b: "تمرین زمان‌دار با گزارش سرعت",
              },
              {
                label: "بازخورد",
                a: "اعلام نتیجه نهایی",
                b: "گزارش تحلیلی خطاهای مشابهتی و معناشناسی",
              },
              {
                label: "آمادگی شفاهی",
                a: "حسن‌حفظ، تجوید، وقف و ابتدا، صوت و لحن",
                b: "تمرین سناریوی چندسطری و انتقال بین آیات",
              },
              {
                label: "انعطاف تمرین",
                a: "فقط در روز آزمون",
                b: "هر زمان، در مسیرهای ۱۰/۲۰/۳۰ جزء",
              },
            ]}
          />
        </section>
    </PremiumArticleLayout>
  );
}
