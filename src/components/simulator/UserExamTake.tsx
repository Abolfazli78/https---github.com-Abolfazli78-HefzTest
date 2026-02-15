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
    <div className="container mx-auto py-8 px-4 max-w-5xl" dir="rtl">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b py-4 mb-6 -mx-4 px-4 flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">سوال {currentIndex + 1} از {total}</span>
          <span className="font-mono tabular-nums text-lg font-semibold">{timerStr}</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden transition-[width] duration-300 ease-out">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${timerBarColor}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {!timerStarted ? (
        <Card className="p-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-lg">
              مدت آزمون: {durationMinutes} دقیقه. با کلیک روی دکمه زیر زمان شروع می‌شود.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStart} size="lg" className="px-8 py-3 rounded-xl text-base hover:opacity-90 transition-opacity">
              شروع زمان‌دار
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-right p-12 shadow-lg border-2 dir-rtl" dir="rtl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl md:text-3xl text-right leading-relaxed font-medium">
              {current?.questionText}
            </CardTitle>
            {current && (
              <CardDescription className="text-lg text-right mt-4">
                جزء {current.juz} — {mapTopicToPersian(current.questionKind)}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {current && (
              <div className="space-y-6" dir="rtl">
                {optionKeys.map((opt, idx) => (
                  <label
                    key={opt}
                    className="flex items-start gap-4 p-6 rounded-2xl border bg-card hover:border-black dark:hover:border-white transition-colors cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={current.id}
                      value={opt}
                      checked={answers[current.id] === opt}
                      onChange={() => setAnswers((prev) => ({ ...prev, [current.id]: opt }))}
                      className="mt-1.5 shrink-0 w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1 text-right text-lg leading-8">
                      <span className="font-bold ml-2">{optionLetters[idx]}.</span>
                      {current[`option${opt}` as keyof Question] as string}
                    </div>
                  </label>
                ))}
              </div>
            )}
            <div className="flex justify-between mt-10 pt-6 gap-4">
              <Button
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => i - 1)}
                className="px-8 py-3 rounded-xl text-base hover:opacity-90 transition-opacity"
              >
                قبلی
              </Button>
              {currentIndex < total - 1 ? (
                <Button onClick={() => setCurrentIndex((i) => i + 1)} className="px-8 py-3 rounded-xl text-base hover:opacity-90 transition-opacity">
                  بعدی
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="px-8 py-3 rounded-xl text-base hover:opacity-90 transition-opacity">
                  ارسال و مشاهده نتیجه
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
