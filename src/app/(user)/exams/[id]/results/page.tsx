import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle2, XCircle, Circle, Trophy } from "lucide-react";

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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
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
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">بازگشت به صفحه اصلی</Button>
            </Link>
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
                <p className="arabic-text mb-3">{answer.question.questionText}</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">پاسخ شما: </span>
                    <span className="arabic-text">
                      {answer.selectedAnswer === "A" && "أ) " + answer.question.optionA}
                      {answer.selectedAnswer === "B" && "ب) " + answer.question.optionB}
                      {answer.selectedAnswer === "C" && "ج) " + answer.question.optionC}
                      {answer.selectedAnswer === "D" && "د) " + answer.question.optionD}
                      {!answer.selectedAnswer && "پاسخ نداده‌اید"}
                    </span>
                  </p>
                  {!answer.isCorrect && (
                    <p>
                      <span className="font-semibold">پاسخ صحیح: </span>
                      <span className="arabic-text">
                        {answer.question.correctAnswer === "A" && "أ) " + answer.question.optionA}
                        {answer.question.correctAnswer === "B" && "ب) " + answer.question.optionB}
                        {answer.question.correctAnswer === "C" && "ج) " + answer.question.optionC}
                        {answer.question.correctAnswer === "D" && "د) " + answer.question.optionD}
                      </span>
                    </p>
                  )}
                  {answer.question.explanation && (
                    <p className="mt-2 text-muted-foreground arabic-text">
                      <span className="font-semibold">توضیح: </span>
                      {answer.question.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

