import Link from "next/link";

export function HomeSeoSections() {
  return (
    <section aria-label="محتوای سئو" className="mx-auto max-w-5xl px-4 py-10">
      <header className="space-y-4">
        <h2 className="text-2xl font-bold leading-relaxed text-slate-900 dark:text-white">
          سامانه آزمون آنلاین حفظ قرآن و مدیریت آموزشی موسسات
        </h2>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
          اگر به دنبال یک راه دقیق و استاندارد برای <strong>آزمون آنلاین حفظ قرآن</strong> هستید،
          این سامانه برای قرآنآموزان، معلمان و مدیران موسسه طراحی شده است. با برگزاری
          <strong> آزمون حافظان قرآن</strong>، ثبت خطاها، گزارش پیشرفت و تحلیل عملکرد، میتوانید
          مسیر حفظ را هدفمند کنید. در کنار آزمونها، امکانات <strong>مدیریت آموزشی موسسات</strong>
          مثل تعریف کلاس، مدیریت کاربران و گزارشهای مدیریتی نیز در دسترس است.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/register" className="rounded-lg bg-slate-900 px-4 py-2 text-white">
            ثبت نام رایگان
          </Link>
          <Link
            href="/demo"
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 dark:text-white"
          >
            مشاهده دموی سیستم
          </Link>
          <Link href="/login" className="rounded-lg bg-emerald-600 px-4 py-2 text-white">
            ورود
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-8">
        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            آزمون حافظان قرآن با ارزیابی دقیق و گزارش پیشرفت
          </h3>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            در هر آزمون میتوانید خطاها را دستهبندی کنید (اشتباه لفظی، جاافتادگی، وقف و ابتدا)
            تا گزارشها قابل تحلیل باشند و تمرینها دقیقتر تنظیم شوند.
          </p>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            مطالعه بیشتر: <Link className="underline" href="/azmoon-online-hifz-quran">آزمون آنلاین حفظ قرآن</Link>
            {" "}و{" "}
            <Link className="underline" href="/gozaresh-pishرفت-hafizan-quran">گزارش پیشرفت حافظان قرآن</Link>
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            امکانات ویژه برای قرآنآموز، معلم و مدیر موسسه
          </h3>

          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">برای قرآنآموز</h4>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            قرآنآموز با مشاهده نتیجه، نقاط ضعف پرتکرار و پیشنهاد تمرین، مسیر حفظ را هدفمندتر دنبال میکند.
          </p>

          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">برای معلم</h4>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            برای ابزارهای طراحی آزمون، ثبت ارزیابی و گزارش کلاسی صفحه {" "}
            <Link className="underline" href="/abzar-moalem-quran">ابزار معلم قرآن</Link>
            {" "}را ببینید.
          </p>

          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">برای مدیر موسسه</h4>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            اگر موسسه دارید، صفحه {" "}
            <Link className="underline" href="/modiriyat-amoozeshi-moassesat">مدیریت آموزشی موسسات</Link>
            {" "}را ببینید تا با گزارشهای مدیریتی و استانداردسازی آزمونها آشنا شوید.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">راهنمای کوتاه آزمون حفظ قرآن (آموزشی)</h3>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            برای یک آزمون استاندارد، سطح آزمون را مشخص کنید (جزء/سوره/مقطع)، معیارهای ارزیابی را از قبل ثابت نگه دارید
            (روانخوانی، دقت، وقف و ابتدا) و بعد از آزمون خطاها را دستهبندی کنید تا تمرینها هدفمند شوند.
          </p>
          <Link className="underline" href="/rahنمای-azmoon-hifz-quran">مطالعه راهنمای کامل آزمون حفظ قرآن</Link>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">سوالات متداول</h3>

          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">آیا این سامانه برای موسسات قرآنی مناسب است؟</h4>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            بله. با تمرکز بر <strong>مدیریت آموزشی موسسات</strong>، گزارشهای تجمیعی و نقشهای مختلف، مدیر موسسه میتواند کیفیت آموزش را دقیقتر پیگیری کند.
          </p>

          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">تفاوت آزمون آنلاین حفظ قرآن با آزمونهای ساده چیست؟</h4>
          <p className="leading-8 text-slate-700 dark:text-slate-300">
            این سامانه بر ثبت خطا، گزارش پیشرفت و استانداردسازی ارزیابی تمرکز دارد تا آزمون به برنامه تمرین و بهبود واقعی عملکرد تبدیل شود.
          </p>
        </section>
      </div>
    </section>
  );
}
