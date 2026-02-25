"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Step = {
  src: string;
  title: string;
  description: string;
  notes: string[];
};

export function LoginGallery() {
  const steps = useMemo<Step[]>(
    () => [
      {
        src: "/images/guide/Login.png",
        title: "مرحله ۱: ورود به پنل کاربری",
        description: "اطلاعات حساب خود را وارد کنید و وارد پنل شوید.",
        notes: [
          "شماره همراه و رمز عبور را وارد کنید.",
          "همچنین میتوانید از طریق کد پیامکی وارد شوید.",
          "در صورت فراموشی رمز، روی «بازیابی رمز» بزنید.",
          "در صورت نداشتن حساب، از بخش ثبت‌نام حساب بسازید.",
        ],
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [renderIndex, setRenderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  };

  useEffect(() => {
    const start = window.requestAnimationFrame(() => setIsTransitioning(true));
    const timer = window.setTimeout(() => {
      setRenderIndex(activeIndex);
      window.requestAnimationFrame(() => setIsTransitioning(false));
    }, 140);
    return () => {
      window.cancelAnimationFrame(start);
      window.clearTimeout(timer);
    };
  }, [activeIndex]);

  const activeStep = steps[renderIndex];

  return (
    <>
      <section className="min-h-[92vh] lg:grid lg:grid-cols-[35%_65%]" dir="rtl">
        <div className="order-2 lg:order-1 h-full flex flex-col px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                مرحله {activeIndex + 1} از {steps.length}
              </span>
            </div>

            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                isTransitioning ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
              )}
            >
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {activeStep.title}
              </h3>
              <p className="mt-4 text-lg leading-8 text-slate-700 dark:text-slate-300">
                {activeStep.description}
              </p>
              <ul className="mt-6 space-y-3 pr-5 text-slate-700 dark:text-slate-300 list-disc">
                {activeStep.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between gap-3">
                <Button type="button" variant="outline" onClick={goPrev} disabled={steps.length === 1}>
                  <ChevronRight className="h-4 w-4" />
                  قبلی
                </Button>
                <Button type="button" onClick={goNext} disabled={steps.length === 1}>
                  بعدی
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 w-full h-[75vh] md:h-[80vh] lg:h-[90vh] bg-white flex items-center justify-center p-0 md:p-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="بزرگ‌نمایی تصویر این مرحله"
            className="w-full h-full"
          >
            <img
              src={activeStep.src}
              alt={activeStep.title}
              width={1600}
              height={900}
              className={cn(
                "w-full h-full max-h-[75vh] md:max-h-[80vh] lg:max-h-[90vh] object-contain transition-all duration-300 ease-in-out",
                isTransitioning ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
              )}
            />
          </button>
        </div>

        <div className="sticky bottom-0 z-10 -mx-4 border-t bg-white px-6 py-4 dark:bg-slate-950/95 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="outline" className="w-full" onClick={goPrev} disabled={steps.length === 1}>
              <ChevronRight className="h-4 w-4" />
              قبلی
            </Button>
            <Button type="button" className="w-full" onClick={goNext} disabled={steps.length === 1}>
              بعدی
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] w-[1100px] p-0">
          <DialogHeader className="p-4 pb-2" dir="rtl">
            <DialogTitle className="text-right text-base md:text-lg">
              {activeStep.title}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4" dir="rtl">
            <div className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-3">
              <img
                src={activeStep.src}
                alt={activeStep.title}
                width={1600}
                height={900}
                className="max-h-[88vh] w-full object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
