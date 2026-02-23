"use client";

import { useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

type Step = {
  src: string;
  title: string;
  description: string;
};

export function CreateExamGallery() {
  const steps = useMemo<Step[]>(
    () => [
      {
        src: "/images/guide/create-exam-1.png",
        title: "مرحله ۱: انتخاب محدوده محفوظات",
        description: "ابتدا محدوده سوره‌هایی که می‌خواهید از آن‌ها آزمون بگیرید را انتخاب کنید. می‌توانید چند سوره را همزمان انتخاب کنید یا از گزینه‌های از پیش تعریف‌شده استفاده نمایید."
      },
      {
        src: "/images/guide/create-exam-2.png",
        title: "مرحله ۲: انتخاب سال سوالات",
        description: "سال برگزاری آزمون‌های رسمی که می‌خواهید سوالات از آن‌ها انتخاب شود را مشخص کنید. این کار به شما کمک می‌کند تا با سوالات استاندارد همان سال تمرین کنید."
      },
      {
        src: "/images/guide/create-exam-3.png",
        title: "مرحله ۳: تعیین تعداد سوال",
        description: "تعداد سوالات مورد نظر خود را وارد کنید. می‌توانید بین ۱ تا ۴۰ سوال انتخاب کنید. پیشنهاد می‌شود برای شبیه‌سازی واقعی، تعداد استاندارد آزمون را انتخاب نمایید."
      },
      {
        src: "/images/guide/create-exam-4.png",
        title: "مرحله ۴: تعیین زمان آزمون",
        description: "زمان پاسخ‌گویی به سوالات را بر دقیقه تنظیم کنید. برای هر سوال معمولاً ۱ تا ۲ دقیقه زمان در نظر گرفته می‌شود. می‌توانید زمان استاندارد آزمون رسمی را انتخاب کنید."
      },
      {
        src: "/images/guide/create-exam-5.png",
        title: "مرحله ۵: بررسی تنظیمات و شروع آزمون",
        description: "تنظیمات انتخابی خود را بررسی کنید و در صورت صحیح بودن، روی دکمه «شروع آزمون» کلیک کنید. آزمون شما بلافاصله آماده و اجرا خواهد شد."
      },
      {
        src: "/images/guide/create-exam-6.png",
        title: "مرحله ۶: شروع آزمون",
        description: "پس از کلیک بر روی شروع آزمون، صفحه آزمون باز می‌شود. سوالات به ترتیب نمایش داده می‌شوند و شما می‌توانید پاسخ‌های خود را ثبت کنید."
      },
      {
        src: "/images/guide/create-exam-7.png",
        title: "مرحله ۷: پاسخ‌دهی به سوالات",
        description: "به هر سوال پاسخ صحیح را انتخاب کنید و به سوال بعدی بروید. می‌توانید در صورت نیاز به سوالات قبلی بازگردید و پاسخ خود را تغییر دهید."
      },
      {
        src: "/images/guide/create-exam-8.png",
        title: "مرحله ۸: پایان آزمون",
        description: "پس از پاسخ به تمام سوالات یا اتمام زمان، آزمون به طور خودکار پایان می‌یابد. نتایج اولیه بلافاصله پس از اتمام آزمون نمایش داده می‌شود."
      },
      {
        src: "/images/guide/create-exam-9.png",
        title: "مرحله ۹: مشاهده نتیجه",
        description: "کارنامه کامل آزمون شامل نمره کل، تعداد پاسخ‌های صحیح و نادرست، و تحلیل عملکرد شما نمایش داده می‌شود. می‌توانید از این بخش برای ارزیابی عملکرد خود استفاده کنید."
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  };

  const activeStep = steps[activeIndex];

  return (
    <>
      <div className="mt-4 space-y-5">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40"
        >
          <img
            src={activeStep.src}
            alt={activeStep.title}
            className="w-full h-auto object-cover"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goPrev();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow"
            aria-label="تصویر قبلی"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goNext();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 shadow"
            aria-label="تصویر بعدی"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="absolute top-4 right-4 flex items-center gap-1 rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/85 px-2 py-2 shadow">
            {steps.map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={
                    "h-7 w-7 rounded-full text-xs font-semibold transition-colors" +
                    (isActive
                      ? " bg-indigo-600 text-white"
                      : " bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700")
                  }
                  aria-label={`رفتن به مرحله ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* توضیح روی خود عکس — نوار پایین */}
          <div
            role="region"
            aria-label="توضیح این مرحله"
            className="absolute inset-x-0 bottom-0 text-right p-4 md:p-5 bg-gradient-to-t from-black/92 via-black/88 to-slate-900"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
                <Info className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-xs font-semibold text-white/90">توضیح این مرحله</span>
              <span className="ml-auto rounded bg-white/20 px-2 py-0.5 text-[10px] text-white/90">برای بزرگ‌نمایی کلیک کنید</span>
            </div>
            <h4 className="text-base md:text-lg font-bold text-white mb-1.5 leading-snug">
              {activeStep.title}
            </h4>
            <p className="text-sm md:text-base leading-[1.75] text-white/95 max-w-none">
              {activeStep.description}
            </p>
          </div>
        </button>

        <div className="pt-2">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span className="inline-block h-0.5 w-6 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden />
            مراحل گام به گام ساخت آزمون
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => sliderRef.current?.scrollBy({ left: 420, behavior: "smooth" })}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 shadow"
              aria-label="قبلی"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => sliderRef.current?.scrollBy({ left: -420, behavior: "smooth" })}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 shadow"
              aria-label="بعدی"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={sliderRef}
              className="flex gap-3 overflow-x-auto pb-2 pr-1 scroll-smooth [scrollbar-width:thin]"
            >
              {steps.map((step, idx) => (
                <button
                  key={step.src}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={
                    "relative shrink-0 overflow-hidden rounded-xl border bg-white/80 dark:bg-white/5 transition-all w-40 md:w-48" +
                    (idx === activeIndex
                      ? " border-indigo-500 ring-2 ring-indigo-500/30"
                      : " border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600")
                  }
                >
                  <img
                    src={step.src}
                    alt={step.title}
                    className="w-full h-24 md:h-28 object-cover"
                  />
                  <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-semibold shadow">
                    {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] w-[1100px] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-right text-base md:text-lg">
              {activeStep.title}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4">
            <div className="overflow-auto max-h-[75vh] rounded-xl border border-slate-200 dark:border-slate-700 bg-black/5 dark:bg-white/5">
              <img
                src={activeStep.src}
                alt={activeStep.title}
                className="w-full h-auto"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
