"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type DemoQuestion = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

interface DemoExamProps {
  questions: DemoQuestion[];
}

export default function DemoExam({ questions }: DemoExamProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D" | null>>({});
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const current = questions[currentIndex];

  const juzNumbers = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);
  const enabledJuz = useMemo(() => new Set([1, 2, 3, 4, 5, 6]), []);

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
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Top builder-like panel (visual mimic, disabled interactions) */}
      <Card>
        <CardHeader>
          <CardTitle>آزمون سفارشی (دمو)</CardTitle>
          <CardDescription>این یک پیش‌نمایش محدود است؛ تنظیمات غیرقابل تغییر هستند.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {/* Year */}
            <div>
              <Label>سال آزمون</Label>
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" variant="secondary" disabled>
                  ۱۴۰۴
                </Button>
                <span className="text-muted-foreground text-xs">(ثابت در حالت دمو)</span>
              </div>
            </div>

            {/* Juz selection (only 1-6 enabled visually) */}
            <div>
              <Label>جزء‌های قابل انتخاب</Label>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {juzNumbers.map((j) => {
                  const enabled = enabledJuz.has(j);
                  return (
                    <Button
                      key={j}
                      size="sm"
                      variant={enabled ? "default" : "outline"}
                      className={enabled ? "" : "cursor-not-allowed"}
                      disabled={!enabled}
                      aria-disabled={!enabled}
                    >
                      {j}
                    </Button>
                  );
                })}
              </div>
              <p className="text-muted-foreground text-xs mt-2">
                فقط جزءهای ۱ تا ۶ در دمو فعال هستند.
              </p>
            </div>

            {/* Difficulty (visual only) */}
            <div>
              <Label>سطح دشواری</Label>
              <RadioGroup className="mt-2 grid grid-cols-3" defaultValue="Medium" disabled>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="diff-easy" value="Easy" />
                  <Label htmlFor="diff-easy">آسان</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="diff-medium" value="Medium" />
                  <Label htmlFor="diff-medium">متوسط</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="diff-hard" value="Hard" />
                  <Label htmlFor="diff-hard">سخت</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question viewer */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>سوال {currentIndex + 1} از {total}</CardTitle>
          <CardDescription>سال ۱۴۰۴، جزءهای ۱ تا ۶، ۳۰ سوال ثابت</CardDescription>
        </CardHeader>
        <CardContent>
          {current ? (
            <div className="space-y-6">
              <div className="text-lg leading-relaxed">
                {current.questionText}
              </div>

              <RadioGroup
                value={answers[current.id] ?? undefined}
                onValueChange={(val) => onSelect(val as "A" | "B" | "C" | "D")}
                className="grid gap-3"
              >
                {([
                  { key: "A" as const, text: current.optionA },
                  { key: "B" as const, text: current.optionB },
                  { key: "C" as const, text: current.optionC },
                  { key: "D" as const, text: current.optionD },
                ]).map((opt, idx) => (
                  <div key={opt.key} className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-accent">
                    <RadioGroupItem id={`opt-${current.id}-${opt.key}`} value={opt.key} />
                    <Label htmlFor={`opt-${current.id}-${opt.key}`}>{opt.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="text-destructive">سوالی یافت نشد.</div>
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

      {/* Finish message */}
      {finished && (
        <Card className="border-green-600">
          <CardHeader>
            <CardTitle>این یک دمو بود.</CardTitle>
            <CardDescription>برای دسترسی کامل ثبت‌نام کنید.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/register" passHref>
              <Button>ایجاد آزمون کامل</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}