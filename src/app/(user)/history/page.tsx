import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";

export default async function HistoryPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const attempts = await db.examAttempt.findMany({
    where: { userId: session.user.id },
    include: {
      exam: true,
    },
    orderBy: { startedAt: "desc" },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">سوابق آزمون‌ها</h1>
        <p className="text-muted-foreground">مشاهده تمام آزمون‌های قبلی شما</p>
      </div>

      {attempts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            لا توجد محاولات سابقة
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => {
            const percentage =
              attempt.score !== null
                ? Math.round((attempt.score / attempt.totalQuestions) * 100)
                : 0;

            return (
              <Card key={attempt.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {attempt.exam.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span>
                          {new Date(attempt.startedAt).toLocaleDateString("fa-IR")}
                        </span>
                        {attempt.timeSpent && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {Math.floor(attempt.timeSpent / 60)} دقیقه
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {attempt.status === "COMPLETED" && attempt.score !== null && (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              <span className="font-semibold">
                                {attempt.score} / {attempt.totalQuestions}
                              </span>
                            </div>
                            <Badge variant="default">{percentage}%</Badge>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-green-600">
                                ✓ {attempt.correctAnswers}
                              </span>
                              <span className="text-red-600">
                                ✗ {attempt.wrongAnswers}
                              </span>
                              {attempt.unanswered > 0 && (
                                <span className="text-muted-foreground">
                                  ○ {attempt.unanswered}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                        {attempt.status === "IN_PROGRESS" && (
                          <Badge variant="secondary">قيد التنفيذ</Badge>
                        )}
                        {attempt.status === "EXPIRED" && (
                          <Badge variant="destructive">منتهي</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {attempt.status === "COMPLETED" && (
                        <Link href={`/exams/${attempt.examId}/results`}>
                          <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                            مشاهده نتیجه
                          </Badge>
                        </Link>
                      )}
                      {attempt.status === "IN_PROGRESS" && (
                        <Link href={`/exams/${attempt.examId}/take`}>
                          <Badge variant="default" className="cursor-pointer">
                            ادامه
                          </Badge>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

