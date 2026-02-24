import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle2, XCircle, Circle, Trophy } from "lucide-react";
import { RenderText } from "@/components/RenderText";

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const { attempt: attemptId } = await searchParams;

  // Get attempt - either specific one from query or most recent
  const attempt = attemptId
    ? await db.examAttempt.findFirst({
      where: {
        id: attemptId,
        userId: session.user.id,
        examId: id,
        status: "COMPLETED",
      },
      include: {
        exam: true,
        examAnswers: {
          include: {
            question: true,
          },
          orderBy: {
            answeredAt: "asc",
          },
        },
      },
    })
    : await db.examAttempt.findFirst({
      where: {
        userId: session.user.id,
        examId: id,
        status: "COMPLETED",
      },
      include: {
        exam: true,
        examAnswers: {
          include: {
            question: true,
          },
          orderBy: {
            answeredAt: "asc",
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

  if (!attempt) {
    redirect("/dashboard");
  }

  const percentage = Math.round(
    (attempt.correctAnswers / attempt.totalQuestions) * 100
  );

  return (
    <div className="w-full py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[360px] lg:flex-none lg:sticky lg:top-6 lg:self-start lg:order-1">
          <Card className="overflow-hidden border-slate-200/70 bg-white/95 shadow-sm">
            <div className="h-1.5 w-full bg-gradient-to-l from-teal-500/80 via-emerald-500/70 to-emerald-400/80" />
            <CardHeader className="pb-2">
              <CardTitle className="text-base">میانبرها</CardTitle>
              <CardDescription className="text-xs">دسترسی سریع به صفحات مهم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3">
                <div className="text-xs text-muted-foreground mb-2">آزمون</div>
                <div className="text-sm font-semibold text-slate-800">{attempt.exam.title}</div>
              </div>
              <div className="grid gap-2">
                <Link href={`/exams/${id}/take`}>
                  <Button className="w-full">بازگشت به صفحه آزمون</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">بازگشت به داشبورد</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="w-full lg:w-[920px] lg:max-w-[920px] lg:order-2">
          <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl">نتیجه آزمون</CardTitle>
          <CardDescription className="text-xl">{attempt.exam.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{attempt.score}</div>
              <div className="text-sm text-muted-foreground">نتیجه</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {attempt.correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">صحیح</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {attempt.wrongAnswers}
              </div>
              <div className="text-sm text-muted-foreground">غلط</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-primary mb-2">{percentage}%</div>
            <div className="text-muted-foreground">درصد</div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>پاسخ‌های صحیح</span>
              </div>
              <Badge variant="default">{attempt.correctAnswers}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span>پاسخ‌های غلط</span>
              </div>
              <Badge variant="destructive">{attempt.wrongAnswers}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Circle className="h-5 w-5 text-gray-600" />
                <span>بدون پاسخ</span>
              </div>
              <Badge variant="secondary">{attempt.unanswered}</Badge>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mb-6">
            <p>تاریخ ارسال: {new Date(attempt.submittedAt!).toLocaleString("fa-IR")}</p>
            {attempt.timeSpent && (
              <p>زمان صرف شده: {Math.floor(attempt.timeSpent / 60)} دقیقه</p>
            )}
          </div>

          <div className="flex gap-4">
            <a
              href={`/api/exams/${id}/results/pdf?attempt=${attempt.id}`}
              target="_blank"
              className="flex-1"
            >
              <Button className="w-full">دانلود PDF</Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Review */}
      <Card>
        <CardHeader>
          <CardTitle>جزئیات پاسخ‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attempt.examAnswers.map((answer, index) => (
              <div
                key={answer.id}
                className={`p-4 rounded-lg border ${answer.isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                  : "bg-red-50 dark:bg-red-900/20 border-red-500"
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">سوال {index + 1}</span>
                  {answer.isCorrect ? (
                    <Badge variant="default">صحیح</Badge>
                  ) : (
                    <Badge variant="destructive">غلط</Badge>
                  )}
                </div>
                <p className="mb-3"><RenderText text={answer.question.questionText} /></p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {[
                    { key: "A", label: "الف", text: answer.question.optionA },
                    { key: "B", label: "ب", text: answer.question.optionB },
                    { key: "C", label: "ج", text: answer.question.optionC },
                    { key: "D", label: "د", text: answer.question.optionD },
                  ].map((option) => {
                    const isCorrect = answer.question.correctAnswer === option.key;
                    const isSelected = answer.selectedAnswer === option.key;
                    const isWrongSelected = isSelected && !isCorrect;

                    const containerClass = [
                      "flex items-start gap-3 rounded-lg border p-3 sm:p-4 transition",
                      isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isWrongSelected
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40",
                    ].join(" ");

                    const letterClass = [
                      "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs font-bold flex-shrink-0",
                      isCorrect
                        ? "border-green-600 text-green-700 bg-green-100/60 dark:bg-green-900/30 dark:text-green-300"
                        : isWrongSelected
                          ? "border-red-600 text-red-700 bg-red-100/60 dark:bg-red-900/30 dark:text-red-300"
                          : isSelected
                            ? "border-blue-600 text-blue-700 bg-blue-100/60 dark:bg-blue-900/30 dark:text-blue-300"
                            : "border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-300",
                    ].join(" ");

                    return (
                      <div key={option.key} className={containerClass}>
                        <span className={letterClass}>{option.label}</span>
                        <div className="flex-1">
                          <div className="leading-7 text-slate-700 dark:text-slate-200">
                            <RenderText text={option.text} />
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {isCorrect && (
                              <Badge className="bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-200">
                                پاسخ صحیح
                              </Badge>
                            )}
                            {isSelected && (
                              <Badge className="bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200">
                                انتخاب شما
                              </Badge>
                            )}
                            {isWrongSelected && (
                              <Badge className="bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-200">
                                انتخاب اشتباه
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {answer.question.explanation && (
                  <p className="mt-3 text-muted-foreground text-sm">
                    <span className="font-semibold">توضیح: </span>
                    <RenderText text={answer.question.explanation} />
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}

