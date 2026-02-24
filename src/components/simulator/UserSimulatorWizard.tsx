"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, BookOpen } from "lucide-react";

const TOTAL_STEPS = 4;
const YEARS = Array.from({ length: 1404 - 1385 + 1 }, (_, i) => 1385 + i).reverse();

const GRADE_OPTIONS = [
  { value: 3, label: "درجه ۳", sublabel: "۳۰ جزء", juz: 30 },
  { value: 4, label: "درجه ۴", sublabel: "۲۰ جزء", juz: 20 },
  { value: 5, label: "درجه ۵", sublabel: "۱۰ جزء", juz: 10 },
] as const;

const RANGE_GRADE_4 = [
  { value: "1-20", label: "۱ تا ۲۰", juzStart: 1, juzEnd: 20 },
  { value: "10-30", label: "۱۱ تا ۳۰", juzStart: 11, juzEnd: 30 },
] as const;

const RANGE_GRADE_5 = [
  { value: "first", label: "۱۰ جزء اول", juzStart: 1, juzEnd: 10 },
  { value: "second", label: "۱۰ جزء دوم", juzStart: 11, juzEnd: 20 },
  { value: "third", label: "۱۰ جزء سوم", juzStart: 21, juzEnd: 30 },
] as const;

function getDerived(grade: number, range: string | null) {
  if (grade === 3) return { juzStart: 1, juzEnd: 30, juzCount: 30, questions: 150, minutes: 150 };
  if (grade === 4) {
    const r = RANGE_GRADE_4.find((x) => x.value === range) ?? RANGE_GRADE_4[0];
    const juzCount = r.juzEnd - r.juzStart + 1;
    return { juzStart: r.juzStart, juzEnd: r.juzEnd, juzCount, questions: juzCount * 5, minutes: juzCount * 5 };
  }
  if (grade === 5) {
    const r = RANGE_GRADE_5.find((x) => x.value === range) ?? RANGE_GRADE_5[0];
    return { juzStart: r.juzStart, juzEnd: r.juzEnd, juzCount: 10, questions: 50, minutes: 50 };
  }
  return { juzStart: 1, juzEnd: 30, juzCount: 30, questions: 150, minutes: 150 };
}

type UserSimulatorWizardProps = {
  basePath: string;
};

export function UserSimulatorWizard({ basePath }: UserSimulatorWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [grade, setGrade] = useState<number | null>(null);
  const [range, setRange] = useState<string | null>(null);
  const [year, setYear] = useState<string>("");

  const derived = grade != null ? getDerived(grade, range) : null;
  const rangeLabel =
    grade === 4 && range
      ? RANGE_GRADE_4.find((x) => x.value === range)?.label
      : grade === 5 && range
        ? RANGE_GRADE_5.find((x) => x.value === range)?.label
        : grade === 3
          ? "۳۰ جزء (کل)"
          : null;

  const canNext =
    step === 1 ? grade != null :
    step === 2 ? (grade === 3 ? true : range != null) :
    step === 3 ? year !== "" :
    true;

  const handleNext = () => {
    if (step === 2 && grade === 3) setRange(null);
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (grade == null || !year) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/user-exams/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          range: grade === 3 ? undefined : range ?? undefined,
          year: parseInt(year, 10),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ساخت آزمون");
      toast.success("آزمون با موفقیت ساخته شد.");
      try {
        window.dispatchEvent(new Event("subscription:updated"));
      } catch {}
      try {
        router.refresh();
      } catch {}
      router.push(`${basePath}/${data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl" dir="rtl">
      <div className="mb-8">
        <Link
          href={basePath}
          className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
          بازگشت به لیست
        </Link>
      </div>

      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>مرحله {step} از {TOTAL_STEPS}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={false}
            transition={{ type: "tween", duration: 0.3 }}
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-1">انتخاب درجه</h2>
              <p className="text-muted-foreground text-sm">درجه تحصیلی و بازه جزء را انتخاب کنید.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {GRADE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGrade(opt.value)}
                  className={`rounded-2xl border-2 p-6 text-right transition-all duration-200 hover:shadow-md ${
                    grade === opt.value
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className="font-semibold text-lg">{opt.label}</div>
                  <div className="text-muted-foreground text-sm mt-1">{opt.sublabel}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && grade != null && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-1">بازه جزء</h2>
              <p className="text-muted-foreground text-sm">
                {grade === 3 ? "۳۰ جزء برای این درجه در نظر گرفته شده است." : "بازه مورد نظر را انتخاب کنید."}
              </p>
            </div>
            {grade === 3 ? (
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="py-8 flex items-center justify-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="font-medium">۳۰ جزء (کل قرآن)</span>
                </CardContent>
              </Card>
            ) : grade === 4 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RANGE_GRADE_4.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRange(opt.value)}
                    className={`rounded-2xl border-2 p-6 text-right transition-all duration-200 hover:shadow-md ${
                      range === opt.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-muted-foreground text-sm mt-1">
                      جزء {opt.juzStart} تا {opt.juzEnd}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {RANGE_GRADE_5.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRange(opt.value)}
                    className={`rounded-2xl border-2 p-6 text-right transition-all duration-200 hover:shadow-md ${
                      range === opt.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-muted-foreground text-sm mt-1">
                      جزء {opt.juzStart} تا {opt.juzEnd}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-1">سال تحصیلی</h2>
              <p className="text-muted-foreground text-sm">سال مورد نظر برای فیلتر سوالات را انتخاب کنید.</p>
            </div>
            <div className="space-y-2">
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-full h-12 text-base rounded-xl">
                  <SelectValue placeholder="انتخاب سال" />
                </SelectTrigger>
                <SelectContent side="left" className="rounded-xl">
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)} className="text-right">
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {step === 4 && derived != null && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-1">خلاصه آزمون</h2>
              <p className="text-muted-foreground text-sm">تنظیمات را بررسی کرده و آزمون را بسازید.</p>
            </div>
            <Card className="border-2 border-primary/10 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">شبیه‌ساز درجه {grade}</CardTitle>
                <CardDescription>
                  {rangeLabel} · سال {year}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="text-muted-foreground">بازه جزء</div>
                    <div className="font-medium mt-0.5">جزء {derived.juzStart} تا {derived.juzEnd}</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="text-muted-foreground">تعداد سوالات</div>
                    <div className="font-medium mt-0.5">{derived.questions} سوال</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="text-muted-foreground">مدت زمان</div>
                    <div className="font-medium mt-0.5">{derived.minutes} دقیقه</div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="text-muted-foreground">سال</div>
                    <div className="font-medium mt-0.5">{year}</div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full h-14 text-lg rounded-xl mt-4"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin ml-2" />
                      در حال ساخت آزمون...
                    </>
                  ) : (
                    "شروع آزمون"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between mt-10">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="gap-1 rounded-xl"
        >
          <ChevronRight className="h-4 w-4" />
          قبلی
        </Button>
        {step < TOTAL_STEPS ? (
          <Button type="button" onClick={handleNext} disabled={!canNext} className="gap-1 rounded-xl">
            بعدی
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
