"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { AnimatedUnderline } from "@/components/brand/AnimatedUnderline";
import { Revealer } from "@/components/brand/Revealer";
import { Counter } from "@/components/brand/Counter";
import { PatternOverlay } from "@/components/brand/PatternOverlay";
import { CheckCircle, Gauge, LineChart, LayoutDashboard, Bot, MinusCircle } from "lucide-react";
import dynamic from "next/dynamic";

// Render Particles only on the client to avoid hydration mismatch due to Math.random
const Particles = dynamic(() => import("@/components/brand/Particles").then(m => m.Particles), {
  ssr: false,
});

export default function AboutPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "درباره ما", item: "https://hefztest.ir/about" },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "آزمون اعطای مدرک حفظ قرآن چیست؟",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "آزمون اعطای مدرک حفظ قرآن یک ارزیابی رسمی برای سنجش میزان تسلط حافظ بر محفوظات و مفاهیم قرآن است که بر اساس درجه های استاندارد (۳، ۴ و ۵) برگزار می‌شود و پس از قبولی، مدرک معتبر اعطا می‌گردد.",
        },
      },
      {
        "@type": "Question",
        name: "درجه ۳، ۴ و ۵ چه تفاوتی دارند؟",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "درجه‌های ۳، ۴ و ۵ سطح دشواری و گستره حفظ را مشخص می‌کنند. هر پایه شامل ساختار زمانی، تعداد سؤالات و معیارهای ارزیابی ویژه است و نشان می‌دهد حافظ در چه سطحی از آمادگی قرار دارد.",
        },
      },
      {
        "@type": "Question",
        name: "آیا تست حفظ شبیه آزمون رسمی است؟",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "بله، شبیه‌ساز آزمون تست حفظ با الگوگیری از ساختار رسمی، زمان‌بندی استاندارد و بانک سؤالات ۲۰ سال گذشته طراحی شده تا تجربه‌ای نزدیک به آزمون اعطای مدرک فراهم کند.",
        },
      },
      {
        "@type": "Question",
        name: "آیا معلمان می‌توانند کلاس‌های خود را مدیریت کنند؟",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "بله، پنل معلم امکان طراحی آزمون، ثبت ارزیابی، گزارش پیشرفت و مدیریت کلاس‌ها را فراهم می‌کند تا آموزش با داده‌محوری و استانداردسازی همراه شود.",
        },
      },
      {
        "@type": "Question",
        name: "تمرین آنلاین حفظ قرآن چه کمکی می‌کند؟",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "تمرین آنلاین با بازخورد فوری، تحلیل خطاها و پیشنهاد تمرین هدفمند، کیفیت آمادگی را افزایش می‌دهد و با پیوستگی تمرین، مسیر حفظ پایدارتر می‌شود.",
        },
      },
    ],
  };

  const faqs = [
    { q: "آزمون اعطای مدرک حفظ قرآن چیست؟", a: "آزمون اعطای مدرک حفظ قرآن یک ارزیابی رسمی برای سنجش معیارهای اصلی مانند  حفظ و مفاهیم. پس از قبولی در پایه‌های استاندارد، مدرک معتبر اعطا می‌شود." },
    { q: "درجه ۳، ۴ و ۵ چه تفاوتی دارند؟", a: "هر درجه نشان‌دهنده سطح گستره حفظ و معیارهای ارزیابی متفاوت است؛ از ساختار زمانی تا تعداد سؤالات و سطح دشواری." },
    { q: "آیا تست حفظ شبیه آزمون رسمی است؟", a: "بله؛ شبیه‌ساز تست حفظ با زمان‌بندی استاندارد و آرشیو سؤالات ۲۰ سال گذشته، تجربه‌ای نزدیک به آزمون رسمی فراهم می‌کند." },
    { q: "آیا معلمان می‌توانند کلاس‌های خود را مدیریت کنند؟", a: "در پنل معلم امکان طراحی آزمون، ثبت ارزیابی و گزارش‌های تحلیلی وجود دارد و مدیریت کلاس‌ها ساده و استاندارد می‌شود." },
    { q: "تمرین آنلاین حفظ قرآن چه کمکی می‌کند؟", a: "تمرین آنلاین با بازخورد فوری و تحلیل خطاها باعث تمرکز بر نقاط ضعف و برنامه‌ریزی دقیق‌تر برای قبولی در آزمون اعطای مدرک می‌شود." },
  ];

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqJsonLd} />

      {/* Hero Section */}
      <section className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700" />
        <PatternOverlay opacity={0.03} />

        <div className="relative mx-auto max-w-[1200px] px-6 py-24 md:py-28 lg:py-32">
          <div className="glass rounded-3xl px-8 py-10 md:px-12 md:py-14 shadow-2xl">
            <Revealer>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] text-white text-center">
                تست حفظ — شبیه‌ساز آزمون اعطای مدرک
              </h1>
            </Revealer>
            <div className="mt-3 flex justify-center">
              <AnimatedUnderline />
            </div>
            <Revealer delay={120}>
              <p className="mx-auto mt-6 max-w-[720px] text-center text-lg md:text-xl text-white/85">
                سامانه‌ای مدرن و قابل اعتماد برای قرآن‌آموزان و معلمان؛ تمرین آنلاین، شبیه‌ساز آزمون رسمی، تحلیل هوشمند و مدیریت آموزشی در یک تجربه آرام اما قدرتمند.
              </p>
            </Revealer>
          </div>
        </div>
      </section>

      {/* Storytelling Section */}
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="accent-line">
            <Revealer>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">چرا تست حفظ شکل گرفت؟</h2>
            </Revealer>
            <Revealer delay={100}>
              <p className="mt-6 max-w-[720px] text-base md:text-lg leading-8 text-slate-700 dark:text-slate-300">
                خلأ جدی در اکوسیستم حفظ قرآن وجود داشت: نبود مرجع استاندارد برای تمرین ساختاریافته، تحلیل عملکرد و مدیریت آموزشی. تست حفظ با هدف ارتقای کیفیت آمادگی حافظان قرآن و هم‌راستاسازی روش‌ها با الزامات آزمون‌های رسمی شکل گرفت؛ شبیه‌ساز آزمون اعطای مدرک با اتکا به آرشیو سؤالات ۲۰ سال گذشته، تجربه‌ای نزدیک به آزمون واقعی می‌سازد تا مسیر مطالعه هدفمند و قابل اعتماد شود.
              </p>
            </Revealer>
            <Revealer delay={180}>
              <p className="mt-4 max-w-[720px] text-base md:text-lg leading-8 text-slate-700 dark:text-slate-300">
                فناوری در تست حفظ، جایگزین شتاب‌زده سنت‌ها نیست؛ بلکه مکمل هوشمندی است برای افزایش دقت ارزیابی، سهولت دسترسی و استمرار تمرین. از ثبت خطاها و بازخورد فوری تا تحلیل روند پیشرفت و پیشنهاد تمرین هدفمند؛ هر جلسه تمرین به گامی مؤثر برای قبولی در آزمون تبدیل می‌شود.
              </p>
            </Revealer>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-100 to-transparent blur-3xl opacity-40" />
            <div className="grid gap-6">
              <Revealer>
                <div className="glass rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <Image src="/window.svg" alt="UI" width={72} height={72} />
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold">رابط کاربری مدرن</p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">مینیمال، منظم، با تایپوگرافی بزرگ و عمق نرم</p>
                    </div>
                  </div>
                </div>
              </Revealer>
              <Revealer delay={120}>
                <div className="glass rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <Image src="/globe.svg" alt="Archive" width={72} height={72} />
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold">آرشیو ۲۰ سال سؤالات</p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">تمرین نزدیک به آزمون رسمی؛ استانداردسازی تجربه</p>
                    </div>
                  </div>
                </div>
              </Revealer>
              <Revealer delay={220}>
                <div className="glass rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4">
                    <Image src="/window.svg" alt="Analytics" width={72} height={72} />
                    <div>
                      <p className="text-slate-900 dark:text-white font-semibold">تحلیل هوشمند</p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">شناسایی خطاها و پیشنهاد تمرین هدفمند</p>
                    </div>
                  </div>
                </div>
              </Revealer>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Impact: 20 Years */}
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <Revealer>
              <p className="text-slate-900 dark:text-white text-2xl font-bold">
                آرشیو <Counter to={20} className="inline-block text-emerald-600" /> سال سؤالات رسمی
              </p>
            </Revealer>
            <div className="mt-6 h-24">
              <div className="relative h-full w-full">
                <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-emerald-500/60 via-emerald-400/60 to-emerald-300/60" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span key={i} className="block h-6 w-[2px] bg-emerald-400/60" />
                  ))}
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-xl w-48 h-48" />
              </div>
            </div>
            <p className="mt-6 text-slate-700 dark:text-slate-300 max-w-[720px]">
              شناخت الگوهای پرتکرار، دامنه‌ها و سطح دشواری آزمون‌ها؛ کلیدی برای آمادگی هدفمند و افزایش کیفیت پاسخ‌دهی.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: "تمرین نزدیک به آزمون رسمی", body: "زمان‌بندی استاندارد و ساختار واقعی سؤال" },
              { title: "تحلیل خطا و پیشنهاد تمرین", body: "تمرکز بر نقاط ضعف و برنامه‌ریزی دقیق" },
              { title: "اعتماد و شفافیت", body: "تجربه کاربری آرام اما مقتدر" },
            ].map((b, idx) => (
              <Revealer key={idx} delay={idx * 100}>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-slate-900 dark:text-white font-semibold">{b.title}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">{b.body}</p>
                </div>
              </Revealer>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] to-[#0F172A]" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-24">
          <Revealer>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">فناوری در خدمت آموزش قرآن</h2>
          </Revealer>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Bot, title: "تصحیح خودکار", desc: "ارزیابی سریع و دقیق" },
              { icon: Gauge, title: "شبیه‌ساز آزمون", desc: "ساختار واقعی و زمان‌بندی" },
              { icon: LineChart, title: "تحلیل هوشمند", desc: "بینش داده‌محور" },
              { icon: LayoutDashboard, title: "داشبورد معلم", desc: "مدیریت کلاس و گزارش" },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <Revealer key={idx} delay={idx * 100}>
                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/7">
                  <Icon className="text-emerald-400" />
                  <p className="mt-4 text-white font-semibold">{title}</p>
                  <p className="mt-2 text-white/80 text-sm">{desc}</p>
                </div>
              </Revealer>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <Revealer>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center">تفاوت روش سنتی و تست حفظ</h2>
        </Revealer>
        <div className="relative mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl p-6 bg-gradient-to-b from-red-950 to-red-900 text-white">
            <p className="text-lg font-semibold mb-4">روش سنتی</p>
            {["پراکندگی ارزیابی و نتایج", "عدم شناخت دقیق الگوها", "وابستگی به زمان و مکان"].map((t, i) => (
              <div key={i} className="group flex items-center gap-3 rounded-xl p-3 hover:bg-white/10 transition">
                <MinusCircle className="opacity-80" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-6 bg-gradient-to-b from-emerald-950 to-emerald-900 text-white">
            <p className="text-lg font-semibold mb-4">تست حفظ</p>
            {["استانداردسازی تجربه آزمون", "تحلیل هوشمند و پیشنهاد تمرین", "دسترسی آنلاین و پایدار"].map((t, i) => (
              <div key={i} className="group flex items-center gap-3 rounded-xl p-3 hover:bg-white/10 transition">
                <CheckCircle className="text-emerald-400" />
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-red-500 via-neutral-300 to-emerald-500 rounded-full" />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <Revealer>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center">سوالات متداول</h2>
        </Revealer>
        <div className="mx-auto mt-8 max-w-[720px] space-y-4">
          {faqs.map((f, idx) => (
            <details key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-black/50 shadow-md">
              <summary className="cursor-pointer list-none p-4 font-semibold text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50">
                {f.q}
              </summary>
              <div className="accordion-content px-4 pb-4">
                <p className="text-slate-700 dark:text-slate-300 leading-8">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] to-[#0F172A]" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-24">
          <div className="relative mx-auto max-w-[720px] text-center">
            <Revealer>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">آماده تجربه‌ای استاندارد هستید؟</h2>
            </Revealer>
            <p className="mt-4 text-white/80">اکنون با ثبت‌نام رایگان وارد شوید و تمرین را آغاز کنید.</p>
            <div className="relative mt-8 flex justify-center">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.25),transparent_60%)] blur-xl" />
              <Particles className="-z-10" />
              <Link href="/register">
                <Button className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-6 text-lg shadow-[0_0_30px_rgba(16,185,129,.35)] hover:shadow-[0_0_50px_rgba(16,185,129,.5)] transition-shadow">
                  ثبت نام رایگان
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}