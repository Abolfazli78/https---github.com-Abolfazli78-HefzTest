"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type GalleryItem = {
  src: string;
  title: string;
  description?: string;
  notes?: string[];
};

type GalleryBaseProps = {
  images: GalleryItem[];
};

export function GalleryBase({ images }: GalleryBaseProps) {
  const steps = useMemo(() => images ?? [], [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const disabled = steps.length <= 1;

  const goPrev = () => {
    setActiveIndex((p) => (p - 1 + steps.length) % steps.length);
  };
  const goNext = () => {
    setActiveIndex((p) => (p + 1) % steps.length);
  };

  useEffect(() => {
    if (steps.length === 0) return;
    if (activeIndex >= steps.length) setActiveIndex(0);
  }, [activeIndex, steps.length]);

  if (steps.length === 0) return null;

  const active = steps[activeIndex];

  return (
    <section
      className="w-full overflow-x-hidden flex flex-col lg:grid lg:grid-cols-[35%_65%] min-h-[70vh] md:min-h-[80vh] lg:min-h-[92vh]"
      dir="rtl"
    >
      <div className="order-2 lg:order-1 h-full flex flex-col min-w-0 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">
              مرحله {activeIndex + 1} از {steps.length}
            </span>
            <div className="flex flex-wrap gap-2 ml-auto min-w-0">
              {steps.map((s, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={s.src + idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      "h-7 rounded-full px-2 text-[11px] font-semibold transition-colors border sm:h-8 sm:px-3 sm:text-xs",
                      isActive
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-900/40"
                    )}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {active?.title}
            </h3>
            {active?.description ? (
              <p className="mt-3 sm:mt-4 text-sm sm:text-lg leading-7 sm:leading-8 text-slate-700 dark:text-slate-300 break-words">
                {active.description}
              </p>
            ) : null}
            {active?.notes?.length ? (
              <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 pr-5 text-slate-700 dark:text-slate-300 list-disc text-sm sm:text-base">
                {active.notes.map((n, i) => (
                  <li key={n + i} className="break-words">
                    {n}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-6 hidden sm:flex items-center justify-between gap-3">
              <Button type="button" variant="outline" onClick={goPrev} disabled={disabled}>
                <ChevronRight className="h-4 w-4" />
                قبلی
              </Button>
              <Button type="button" onClick={goNext} disabled={disabled}>
                بعدی
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2 w-full bg-white dark:bg-slate-950/40 flex items-center justify-center p-0 md:p-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="بزرگ‌نمایی تصویر این مرحله"
          className="w-full h-full"
        >
          <Image
            src={active.src}
            alt={active.title}
            width={1600}
            height={900}
            className="w-full h-auto max-h-[58vh] sm:max-h-[64vh] md:max-h-[72vh] lg:max-h-[82vh] object-contain"
          />
        </button>
      </div>

      <div className="sm:hidden sticky bottom-0 z-[9999] border-t bg-white/95 dark:bg-slate-950/95 backdrop-blur px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg min-h-16">
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="outline" className="flex-1 min-w-0" onClick={goPrev} disabled={disabled}>
            <ChevronRight className="h-4 w-4" />
            قبلی
          </Button>
          <Button type="button" className="flex-1 min-w-0" onClick={goNext} disabled={disabled}>
            بعدی
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] w-[1100px] p-0">
          <Image
            src={active.src}
            alt={active.title}
            width={1600}
            height={900}
            className="max-h-[88vh] w-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
