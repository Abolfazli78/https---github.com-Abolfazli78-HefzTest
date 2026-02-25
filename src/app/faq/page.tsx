"use client";
import type { Metadata } from "next";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Search } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string[];
};

type FaqSection = {
  id: string;
  title: string;
  items: FaqItem[];
};

export const metadata: Metadata = {
  title: "سوالات متداول آزمون حفظ قرآن | حفظ تست",
  description: "پاسخ به سوالات متداول درباره سامانه تست حفظ: آزمون آنلاین حفظ قرآن، شبیه‌ساز، گزارش پیشرفت، و امکانات معلمان و موسسات.",
  alternates: {
    canonical: "https://hefztest.ir/faq",
  },
};

const sections: FaqSection[] = [
  {
    id: "samane",
    title: "سوالات مربوط به استفاده از سامانه",
    items: [
      {
        question: "آیا استفاده از سامانه نیاز به ثبت‌نام دارد؟",
        answer: [
          "بله. برای شرکت در آزمون‌ها، ذخیره نتایج و مشاهده کارنامه، ثبت‌نام در سامانه الزامی است.",
        ],
      },
      {
        question: "تفاوت آزمون دلخواه با شبیه‌ساز چیست؟",
        answer: [
          "در آزمون دلخواه، کاربر می‌تواند محدوده، تعداد سوال و زمان آزمون را شخصاً تنظیم کند.",
          "در شبیه‌ساز، آزمون دقیقاً مطابق ساختار رسمی اعطای مدرک برگزار می‌شود.",
        ],
      },
      {
        question: "آیا آزمون به صورت خودکار تصحیح می‌شود؟",
        answer: [
          "بله. بلافاصله پس از پایان آزمون، سیستم پاسخ‌ها را تصحیح کرده و نمره نهایی نمایش داده می‌شود.",
        ],
      },
      {
        question: "آیا پاسخ‌های غلط نمره منفی دارد؟",
        answer: [
          "خیر. پاسخ‌های نادرست نمره منفی ندارد.",
        ],
      },
      {
        question: "اگر هنگام آزمون اینترنت قطع شود چه اتفاقی می‌افتد؟",
        answer: [
          "در صورت قطع اتصال، توصیه می‌شود مجدداً وارد سامانه شوید. در صورت فعال بودن ذخیره خودکار، اطلاعات ثبت شده باقی خواهد ماند. در غیر این صورت آزمون باید مجدداً آغاز شود.",
        ],
      },
      {
        question: "آیا امکان ویرایش آزمون پس از شروع وجود دارد؟",
        answer: [
          "خیر. پس از آغاز آزمون، تنظیمات قابل تغییر نیست.",
        ],
      },
      {
        question: "آیا امکان پرینت گرفتن از سوالات وجود دارد؟",
        answer: [
          "آزمون‌ها به صورت آنلاین برگزار می‌شوند و در حال حاضر نسخه قابل چاپ ارائه نمی‌شود.",
        ],
      },
    ],
  },
  {
    id: "official",
    title: "سوالات مربوط به آزمون رسمی اعطای مدرک",
    items: [
      {
        question: "آزمون رسمی چند مرحله دارد؟",
        answer: [
          "آزمون شامل مرحله کتبی، شفاهی و در برخی درجات شامل آزمون ترجمه و تفسیر می‌باشد.",
        ],
      },
      {
        question: "ثبت‌نام آزمون رسمی از چه طریقی انجام می‌شود؟",
        answer: [
          "ثبت‌نام آزمون رسمی از طریق سامانه برگزارکننده آزمون انجام می‌شود و ارتباطی با ثبت‌نام در سایت تست حفظ ندارد.",
        ],
      },
      {
        question: "آیا استفاده از تست حفظ تضمین قبولی در آزمون است؟",
        answer: [
          "خیر. این سامانه ابزار تمرینی و شبیه‌ساز آزمون است و قبولی در آزمون رسمی وابسته به میزان آمادگی فرد می‌باشد.",
        ],
      },
    ],
  },
  {
    id: "teachers",
    title: "سوالات مربوط به معلمان و مؤسسات",
    items: [
      {
        question: "آیا معلمان پنل اختصاصی دارند؟",
        answer: [
          "بله. معلمان می‌توانند کلاس ایجاد کرده، قرآن‌آموزان را اضافه کرده و برای آن‌ها آزمون طراحی نمایند.",
        ],
      },
      {
        question: "مدیر مؤسسه چه امکاناتی دارد؟",
        answer: [
          "مدیران می‌توانند عملکرد کلاس‌ها را بررسی کرده، آزمون طراحی کنند و کلاس‌ها را با یکدیگر مقایسه نمایند.",
        ],
      },
    ],
  },
];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const hasQuery = normalizedQuery.length > 0;

  const filteredSections = useMemo(() => {
    if (!hasQuery) {
      return sections;
    }
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const haystack = `${item.question} ${item.answer.join(" ")}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [hasQuery, normalizedQuery]);

  const totalMatches = filteredSections.reduce((sum, section) => sum + section.items.length, 0);

  return (
    <main className="bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <header className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold leading-relaxed text-slate-900 dark:text-white">
            سوالات متداول
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
            در این بخش، پاسخ متداول‌ترین سوالات کاربران درباره نحوه استفاده از سامانه تست حفظ و آزمون رسمی اعطای مدرک ارائه شده است. در صورت عدم یافتن پاسخ سوال خود، می‌توانید با پشتیبانی سامانه تماس بگیرید.
          </p>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] items-center">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجو در سوالات..."
              className="h-11 pr-10 rounded-2xl bg-white/80 dark:bg-white/5"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {hasQuery ? `${totalMatches} نتیجه یافت شد` : "تمام سوالات نمایش داده می‌شود"}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-white/5 p-5 md:p-6">
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
            نکته مهم: برای کاهش نگرانی قبل از شروع آزمون، هر پاسخ به‌صورت رسمی و شفاف ارائه شده است تا مسیر تصمیم‌گیری شما ساده‌تر شود.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {filteredSections.map((section) => (
            <section key={section.id} className="space-y-5">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-white/5 p-6 transition-all hover:shadow-md"
                  >
                    <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">
                          {item.question}
                        </h3>
                      </div>
                      <span className="text-sm text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <div className="mt-4 space-y-3 text-sm md:text-base leading-7 text-slate-600 dark:text-slate-300">
                      {item.answer.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
          {hasQuery && totalMatches === 0 && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-white/5 p-6 text-center text-slate-600 dark:text-slate-300">
              نتیجه‌ای یافت نشد. لطفاً عبارت دیگری جستجو کنید.
            </div>
          )}
        </div>

        <div className="mt-12 rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/30 p-6 md:p-8">
          <p className="text-sm md:text-base leading-8 text-emerald-900 dark:text-emerald-200">
            سامانه تست حفظ با هدف تسهیل آمادگی حافظان قرآن طراحی شده است و صرفاً ابزار تمرینی می‌باشد. ثبت‌نام آزمون رسمی از طریق سامانه برگزارکننده انجام می‌شود.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild className="h-12 px-10 rounded-2xl text-base">
            <Link href="/exams">همین حالا آزمون بده</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
