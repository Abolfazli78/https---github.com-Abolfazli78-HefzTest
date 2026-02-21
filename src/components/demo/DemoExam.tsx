"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Sparkles, Trophy, CheckCircle2, XCircle, Minus, Star } from "lucide-react";

type DemoQuestion = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer?: "A" | "B" | "C" | "D";
};

interface DemoExamProps {
  questions: DemoQuestion[];
}

export default function DemoExam({ questions }: DemoExamProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D" | null>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ correct: number; wrong: number; unanswered: number; score: number } | null>(null);

  const total = questions.length;
  const current = questions[currentIndex];

  const juzNumbers = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);
  const enabledJuz = useMemo(() => new Set([1, 2, 3, 4, 5, 6]), []);
  const progressValue = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  function onSelect(answer: "A" | "B" | "C" | "D") {
    setAnswers((prev) => ({ ...prev, [current.id]: answer }));
  }

  function next() {
    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
  }

  function prev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  function finishDemo() {
    setFinished(true);
    const stats = questions.reduce(
      (acc, q) => {
        const sel = answers[q.id];
        if (!sel) {
          acc.unanswered += 1;
        } else if (q.correctAnswer && sel === q.correctAnswer) {
          acc.correct += 1;
        } else {
          acc.wrong += 1;
        }
        return acc;
      },
      { correct: 0, wrong: 0, unanswered: 0 }
    );
    const score = Math.round((stats.correct / total) * 100);
    setResult({ ...stats, score });
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 space-y-8" dir="rtl">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-l from-indigo-50 via-white to-emerald-50 p-6 shadow-2xl">
        <div className="pointer-events-none absolute -top-24 left-0 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              <span className="text-sm text-emerald-700">نسخه دمو</span>
            </div>
            <Badge className="px-4 py-1 text-sm">تجربه سریع و حرفه‌ای</Badge>
          </div>
          <div className="text-right space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">آزمون سفارشی با حس واقعی</h1>
            <p className="text-sm text-muted-foreground leading-7">
              یک تجربه کامل، سریع و چشم‌نواز برای ارزیابی سطح کاربر در چند دقیقه
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            {["بانک سوالات واقعی", "کارنامه جذاب", "رابط کاربری لوکس"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-xs text-slate-700 shadow-sm">
                <Star className="h-3 w-3 text-amber-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="text-right">
          <CardTitle className="text-2xl font-bold">تنظیمات دمو</CardTitle>
          <CardDescription className="leading-7">تنظیمات این بخش ثابت است و برای تجربه سریع تنظیم شده.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {/* Year */}
            <div>
              <Label className="block text-right">سال آزمون</Label>
              <div className="mt-2 flex items-center gap-2 justify-end">
                <Badge className="px-3 py-1 text-sm">۱۴۰۴</Badge>
                <span className="text-muted-foreground text-xs">ثابت در حالت دمو</span>
              </div>
            </div>

            {/* Juz selection (only 1-6 enabled visually) */}
            <div>
              <Label className="block text-right">جزءهای قابل انتخاب</Label>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {juzNumbers.map((j) => {
                  const enabled = enabledJuz.has(j);
                  return (
                    <Button
                      key={j}
                      size="sm"
                      variant={enabled ? "default" : "outline"}
                      className={`rounded-full ${enabled ? "" : "cursor-not-allowed"}`}
                      disabled={!enabled}
                      aria-disabled={!enabled}
                    >
                      {j}
                    </Button>
                  );
                })}
              </div>
              <p className="text-muted-foreground text-xs mt-2 text-right">
                فقط جزءهای ۱ تا ۶ در دمو فعال هستند.
              </p>
            </div>

            {/* Difficulty (visual only) */}
            <div>
              <Label className="block text-right">سطح دشواری</Label>
              <RadioGroup className="mt-2 grid grid-cols-3" defaultValue="Medium" disabled>
                <div className="flex items-center gap-2 justify-end">
                  <RadioGroupItem id="diff-easy" value="Easy" />
                  <Label htmlFor="diff-easy">آسان</Label>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <RadioGroupItem id="diff-medium" value="Medium" />
                  <Label htmlFor="diff-medium">متوسط</Label>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <RadioGroupItem id="diff-hard" value="Hard" />
                  <Label htmlFor="diff-hard">سخت</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question viewer */}
      <Card className="shadow-xl">
        <CardHeader className="border-b text-right">
          <div className="flex items-center justify-between gap-4">
            <div className="text-right">
              <CardTitle>سوال {currentIndex + 1} از {total}</CardTitle>
              <CardDescription>سال ۱۴۰۴، جزءهای ۱ تا ۶</CardDescription>
            </div>
            <div className="w-40">
              <Progress value={progressValue} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {current ? (
            <motion.div
              className="space-y-6"
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-xl leading-relaxed text-right font-semibold">
                {current.questionText}
              </div>

              <RadioGroup
                value={answers[current.id] ?? undefined}
                onValueChange={(val) => onSelect(val as "A" | "B" | "C" | "D")}
                className="grid gap-3 text-right"
                dir="rtl"
              >
                {([
                  { key: "A" as const, text: current.optionA },
                  { key: "B" as const, text: current.optionB },
                  { key: "C" as const, text: current.optionC },
                  { key: "D" as const, text: current.optionD },
                ]).map((opt, idx) => (
                  <motion.div
                    key={opt.key}
                    className={`group flex flex-row-reverse items-center gap-3 rounded-xl border p-4 transition-all hover:bg-accent hover:border-primary ${
                      answers[current.id] === opt.key ? "bg-accent border-primary" : ""
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.995 }}
                  >
                    <RadioGroupItem id={`opt-${current.id}-${opt.key}`} value={opt.key} />
                    <Label htmlFor={`opt-${current.id}-${opt.key}`} className="text-right flex-1 w-full leading-relaxed">{opt.text}</Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </motion.div>
          ) : (
            <div className="text-destructive text-right">سوالی یافت نشد.</div>
          )}
        </CardContent>
        <CardFooter className="border-t">
          <div className="flex w-full items-center justify-between">
            <Button variant="outline" size="sm" onClick={prev} disabled={currentIndex === 0}>قبلی</Button>
            {currentIndex < total - 1 ? (
              <Button size="sm" onClick={next}>بعدی</Button>
            ) : (
              <Button size="sm" onClick={finishDemo}>پایان دمو</Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {finished && (
        <Card className="border-green-600 shadow-2xl overflow-hidden">
          <CardHeader className="text-right bg-gradient-to-l from-emerald-50 to-transparent">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  کارنامه دمو
                </CardTitle>
                <CardDescription>جمع‌بندی عملکرد شما در این آزمون آزمایشی</CardDescription>
              </div>
              <Badge className="px-4 py-1 text-base">نتیجه نهایی</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {result ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border bg-gradient-to-l from-emerald-50 to-slate-50 p-6 text-right shadow-inner">
                    <div className="text-sm text-muted-foreground">درصد نمره</div>
                    <div className="mt-2 flex items-center gap-4 justify-end">
                      <div className="text-5xl font-bold text-emerald-600">{result.score}%</div>
                      <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={result.score} />
                    </div>
                  </div>
                  <div className="rounded-3xl border bg-white p-6 text-right shadow-sm">
                    <div className="text-sm text-muted-foreground">وضعیت کلی</div>
                    <div className="mt-3 text-lg font-semibold">
                      {result.score >= 80 ? "عالی" : result.score >= 60 ? "خیلی خوب" : result.score >= 40 ? "نیاز به تمرین" : "شروع مجدد"}
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
                        <span className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="h-4 w-4" />پاسخ‌های صحیح</span>
                        <span className="font-semibold text-emerald-700">{result.correct}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2">
                        <span className="flex items-center gap-2 text-rose-700"><XCircle className="h-4 w-4" />پاسخ‌های غلط</span>
                        <span className="font-semibold text-rose-700">{result.wrong}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <span className="flex items-center gap-2 text-slate-600"><Minus className="h-4 w-4" />بدون پاسخ</span>
                        <span className="font-semibold text-slate-600">{result.unanswered}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-right text-muted-foreground">برای دسترسی کامل ثبت‌نام کنید.</div>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            <Link href="/register" passHref>
              <Button>ثبت‌نام برای نسخه کامل</Button>
            </Link>
            <Link href="/demo" passHref>
              <Button variant="outline">تکرار دمو</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
