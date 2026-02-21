"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b py-3 mb-4 -mx-4 px-4 flex justify-between items-center text-sm">
        <span className="font-medium">
          سوال {currentIndex + 1} از {total}
        </span>
        <span className="font-mono tabular-nums">
          زمان: {timerStr}
        </span>
      </div>

      {!timerStarted ? (
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">مدت آزمون: {durationMinutes} دقیقه. با کلیک روی دکمه زیر زمان شروع می‌شود.</p>
            <Button onClick={handleStart}>شروع زمان‌دار</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{current?.questionText}</CardTitle>
              {current && (
                <CardDescription>
                  جزء {current.juz} — {mapTopicToPersian(current.questionKind)}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {current && (
                <RadioGroup
                  value={answers[current.id] ?? ""}
                  onValueChange={(v) =>
                    setAnswers((prev) => ({ ...prev, [current.id]: v }))
                  }
                  className="space-y-3"
                >
                  {["A", "B", "C", "D"].map((opt) => (
                    <div key={opt} className="flex items-center gap-2">
                      <RadioGroupItem value={opt} id={`${current.id}-${opt}`} />
                      <Label htmlFor={`${current.id}-${opt}`} className="cursor-pointer">
                        {current[`option${opt}` as keyof Question] as string}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => i - 1)}
                >
                  قبلی
                </Button>
                {currentIndex < total - 1 ? (
                  <Button onClick={() => setCurrentIndex((i) => i + 1)}>
                    بعدی
                  </Button>
                ) : (
                  <Button onClick={handleSubmit}>ارسال و مشاهده نتیجه</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
