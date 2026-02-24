"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mapTopicToPersian } from "@/lib/simulator-labels";

type Question = {
  id: string;
  userExamQuestionId: string;
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

type UserExamTakeProps = {
  basePath: string;
};

export function UserExamTake({ basePath }: UserExamTakeProps) {
  const params = useParams();
  const id = params.id as string;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [title, setTitle] = useState("");
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
    fetch(`/api/user-exams/${id}/questions`)
      .then((res) => (res.ok ? res.json() : { questions: [], durationMinutes: 0, title: "" }))
      .then((data) => {
        setQuestions(data.questions ?? []);
        setDurationMinutes(data.durationMinutes ?? 0);
        setTitle(data.title ?? "");
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

  const handleSubmit = useCallback(() => {
    const correctAnswers = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const wrongAnswers = total - correctAnswers;
    const score = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
    setResult({
      score,
      correctAnswers,
      wrongAnswers,
      totalQuestions: total,
    });
    setSubmitted(true);
  }, [questions, answers, total]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4" dir="rtl">
        <p className="text-muted-foreground">در حال بارگذاری سوالات...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md" dir="rtl">
        <Card>
          <CardHeader>
            <CardTitle>سوالی یافت نشد</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={basePath}>
              <Button variant="outline">بازگشت به لیست</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted && result) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md" dir="rtl">
        <Card>
          <CardHeader>
            <CardTitle>نتیجه آزمون</CardTitle>
            <CardDescription>{title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-medium">تعداد صحیح: {result.correctAnswers}</p>
            <p className="text-lg font-medium">تعداد غلط: {result.wrongAnswers}</p>
            <p className="text-lg font-medium">درصد: {result.score}%</p>
            <Link href={basePath}>
              <Button className="w-full mt-4">بازگشت به لیست</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalTimeSeconds = durationMinutes * 60;
  const progressPercent = totalTimeSeconds > 0 ? (secondsLeft / totalTimeSeconds) * 100 : 0;
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const timerStr = `${m}:${s.toString().padStart(2, "0")}`;
  const timerBarColor =
    progressPercent > 50 ? "bg-green-500" : progressPercent > 20 ? "bg-orange-500" : "bg-red-500";

  const optionLetters = ["الف", "ب", "ج", "د"] as const;
  const optionKeys = ["A", "B", "C", "D"] as const;

  return (
    <div className="h-screen flex flex-col bg-gray-50" dir="rtl">
      <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-white border-b px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">سوال {currentIndex + 1} از {total}</span>
          <span className="font-mono tabular-nums text-sm">{timerStr}</span>
        </div>
        {timerStarted && current && (
          <h1 className="mt-2 text-lg md:text-xl leading-8 font-medium text-slate-800">
            {current.questionText}
          </h1>
        )}
        <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${timerBarColor}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {!timerStarted ? (
        <div className="flex-1 px-4 md:px-6 py-3 flex items-center justify-center">
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="text-base">
                مدت آزمون: {durationMinutes} دقیقه. با کلیک روی دکمه زیر زمان شروع می‌شود.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleStart} className="min-h-[40px] px-4 py-2 rounded-lg text-base transition-opacity">
                شروع زمان‌دار
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 space-y-3">
            <Card className="border-0 shadow-none">
              <CardHeader className="pt-0">
                <CardDescription className="text-xs text-slate-500">
                  جزء {current.juz} — {mapTopicToPersian(current.questionKind)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optionKeys.map((opt, idx) => {
                    const selected = answers[current.id] === opt;
                    return (
                      <label
                        key={opt}
                        className={[
                          "flex items-start gap-3 p-3 md:p-4 rounded-lg border bg-white cursor-pointer transition",
                          "text-base leading-7",
                          selected ? "border-green-600 bg-green-50" : "hover:border-green-500"
                        ].join(" ")}
                      >
                        <input
                          type="radio"
                          name={current.id}
                          value={opt}
                          checked={answers[current.id] === opt}
                          onChange={() => setAnswers((prev) => ({ ...prev, [current.id]: opt }))}
                          className="sr-only"
                        />
                        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold text-slate-600">
                          {optionLetters[idx]}
                        </span>
                        <span className="text-base leading-7">{current[`option${opt}` as keyof Question] as string}</span>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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
              <Button onClick={() => setCurrentIndex((i) => i + 1)} className="min-h-[40px] px-4 py-2 rounded-lg text-base">
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
