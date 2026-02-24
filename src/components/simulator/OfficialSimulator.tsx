"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { mapTopicToPersian } from "@/lib/simulator-labels";

export type ExamMeta = {
  id: string;
  title: string;
  year: number;
  degree: number;
  juzStart: number;
  juzEnd: number;
  durationMinutes: number;
  totalQuestions: number;
};

export type Question = {
  id: string;
  officialExamQuestionId: string;
  order: number;
  juz: number;
  questionKind: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
};

type OfficialSimulatorProps = {
  basePath: string;
  subscriptionInfo: { examSimulatorEnabled?: boolean; hasActiveSubscription?: boolean } | null;
  loadingSubscription: boolean;
};

export function OfficialSimulatorLanding({ basePath, subscriptionInfo, loadingSubscription }: OfficialSimulatorProps) {
  const [exam, setExam] = useState<ExamMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const simulatorEnabled = subscriptionInfo?.examSimulatorEnabled === true;
  const showLock = !loadingSubscription && (!subscriptionInfo?.hasActiveSubscription || !simulatorEnabled);

  useEffect(() => {
    fetch("/api/official-exams/active")
      .then((res) => res.json())
      .then((data) => setExam(data.exam ?? null))
      .catch(() => setExam(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading || loadingSubscription) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  if (showLock) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>شبیه‌ساز آزمون رسمی</CardTitle>
            <CardDescription>
              این قابلیت در پلن فعلی شما فعال نیست.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={basePath === "/simulator" ? "/subscriptions" : `${basePath.replace("/simulator", "")}/subscriptions`}>
              <Button>ارتقاء پلن</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>شبیه‌ساز آزمون رسمی</CardTitle>
            <CardDescription>در حال حاضر آزمون رسمی فعالی برای شبیه‌سازی وجود ندارد.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>شبیه‌ساز آزمون رسمی</CardTitle>
          <CardDescription>{exam.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-medium">سال: {exam.year} — مقطع: {exam.degree}</p>
          <p className="text-muted-foreground">بازه جزء: جزء {exam.juzStart} تا {exam.juzEnd}</p>
          <p className="text-muted-foreground">تعداد سوالات: {exam.totalQuestions}</p>
          <p className="text-muted-foreground">مدت زمان: {exam.durationMinutes} دقیقه</p>
          <Link href={`${basePath}/${exam.id}`}>
            <Button className="mt-4">شروع آزمون</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export function OfficialSimulatorTake({ basePath }: { basePath: string }) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalQuestions: number;
  } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  const total = questions.length;
  const current = questions[currentIndex];

  useEffect(() => {
    if (!id) return;
    fetch(`/api/official-exams/${id}/questions`)
      .then((res) => res.ok ? res.json() : { questions: [], durationMinutes: 0 })
      .then((data) => {
        setQuestions(data.questions ?? []);
        setDurationMinutes(data.durationMinutes ?? 0);
        setSecondsLeft((data.durationMinutes ?? 0) * 60);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!timerStarted || secondsLeft <= 0 || submitted) return;
    const t = setInterval(() => setSecondsLeft((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [timerStarted, submitted]);

  const handleStart = useCallback(() => setTimerStarted(true), []);

  const handleSubmit = async () => {
    const correctAnswers = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const wrongAnswers = total - correctAnswers;
    const res = await fetch(`/api/official-exams/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctAnswers, totalQuestions: total }),
    });
    const data = await res.json();
    if (data.score != null) {
      setResult({
        score: data.score,
        correctAnswers: data.correctAnswers ?? correctAnswers,
        wrongAnswers,
        totalQuestions: data.totalQuestions ?? total,
      });
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>در حال بارگذاری سوالات...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>سوالی یافت نشد.</p>
        <Button variant="outline" onClick={() => router.push(basePath)}>
          بازگشت
        </Button>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>نتیجه آزمون</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-medium">تعداد صحیح: {result.correctAnswers}</p>
            <p className="text-lg font-medium">تعداد غلط: {result.wrongAnswers}</p>
            <p className="text-lg font-medium">درصد: {result.score}%</p>
            <Button className="mt-4 w-full" onClick={() => router.push(basePath)}>
              بازگشت
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const timerStr = `${m}:${s.toString().padStart(2, "0")}`;

  return (
    <div className="h-screen flex flex-col bg-gray-50" dir="rtl">
      <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
        <div className="sticky top-0 z-20 bg-white border-b px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            سوال {currentIndex + 1} از {total}
          </span>
          <span className="font-mono tabular-nums text-sm">
            زمان: {timerStr}
          </span>
        </div>
        {timerStarted && current && (
          <h1 className="mt-2 text-lg md:text-xl leading-8 font-medium text-slate-800">
            {current.questionText}
          </h1>
        )}
        </div>

      {!timerStarted ? (
        <div className="flex-1 px-4 md:px-6 py-3 flex items-center justify-center">
          <Card className="w-full">
            <CardContent className="pt-4">
              <p className="mb-3 text-base">
                مدت آزمون: {durationMinutes} دقیقه. با کلیک روی دکمه زیر زمان شروع می‌شود.
              </p>
              <Button onClick={handleStart} className="min-h-[40px] px-4 py-2 rounded-lg text-base">
                شروع زمان‌دار
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 space-y-3">
            {current && (
              <Card className="border-0 shadow-none">
                <CardHeader className="pt-0">
                  <CardDescription className="text-xs text-slate-500">
                    جزء {current.juz} — {mapTopicToPersian(current.questionKind)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[current.id] ?? ""}
                    onValueChange={(v) =>
                      setAnswers((prev) => ({ ...prev, [current.id]: v }))
                    }
                    className="space-y-3"
                  >
                    {["A", "B", "C", "D"].map((opt, idx) => {
                      const selected = (answers[current.id] ?? "") === opt;
                      const display = ["الف", "ب", "ج", "د"][idx];
                      return (
                        <label
                          key={opt}
                          htmlFor={`${current.id}-${opt}`}
                          className={[
                            "flex items-start gap-3 p-3 md:p-4 rounded-lg border bg-white cursor-pointer transition",
                            "text-base leading-7",
                            selected
                              ? "border-green-600 bg-green-50"
                              : "hover:border-green-500"
                          ].join(" ")}
                        >
                          <RadioGroupItem
                            value={opt}
                            id={`${current.id}-${opt}`}
                            className="sr-only"
                          />
                          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold text-slate-600">
                            {display}
                          </span>
                          <span className="text-base leading-7">{current[`option${opt}` as keyof Question] as string}</span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t px-4 md:px-6 py-3 flex justify-between gap-3">
            <Button
              variant="outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="min-h-[40px] px-4 py-2 rounded-lg text-base"
            >
              قبلی
            </Button>
            {currentIndex < total - 1 ? (
              <Button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="min-h-[40px] px-4 py-2 rounded-lg text-base"
              >
                بعدی
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="min-h-[40px] px-4 py-2 rounded-lg text-base">
                ارسال و مشاهده نتیجه
              </Button>
            )}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
