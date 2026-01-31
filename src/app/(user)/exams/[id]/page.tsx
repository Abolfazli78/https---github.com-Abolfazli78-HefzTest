import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { canUserAccessExam } from "@/lib/exam-access";
import { parseDescription } from "@/lib/exam-utils";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, FileText, AlertCircle } from "lucide-react";

export default async function ExamDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const exam = await db.exam.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: { questions: true },
      },
    },
  });

  if (!exam || !exam.isActive) {
    redirect("/dashboard");
  }

  // Check if user has access to this exam
  const hasAccess = await canUserAccessExam(session.user.id, exam.id);
  if (!hasAccess) {
    redirect("/exams");
  }

  // Check if user has an active attempt
  const activeAttempt = await db.examAttempt.findFirst({
    where: {
      userId: session.user.id,
      examId: exam.id,
      status: "IN_PROGRESS",
    },
  });

  if (activeAttempt) {
    redirect(`/exams/${exam.id}/take`);
  }

  // Check if user has completed this exam before
  const completedAttempt = await db.examAttempt.findFirst({
    where: {
      userId: session.user.id,
      examId: exam.id,
      status: "COMPLETED",
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{exam.title}</CardTitle>
          {(() => {
            const cleanDescription = parseDescription(exam.description);
            return cleanDescription !== "بدون توضیحات" ? (
              <CardDescription className="arabic-text text-base">
                {cleanDescription}
              </CardDescription>
            ) : null;
          })()}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">مدت زمان</p>
                <p className="font-semibold">{exam.duration} دقیقه</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">تعداد سوالات</p>
                <p className="font-semibold">{exam.questionCount} سوال</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="space-y-1">
                <p className="font-semibold text-blue-900 dark:text-blue-100">دستورالعمل‌های مهم:</p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>آزمون محدود به زمان است، مطمئن شوید قبل از اتمام زمان آن را تکمیل کنید</li>
                  <li>پاسخ‌های شما به صورت خودکار ذخیره می‌شوند</li>
                  <li>پس از اتمام زمان، آزمون به صورت خودکار ارسال می‌شود</li>
                  <li>نمی‌توانید به سوالات قبلی برگردید</li>
                </ul>
              </div>
            </div>
          </div>

          {completedAttempt && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                شما قبلاً این آزمون را انجام داده‌اید.
              </p>
              <Link href={`/exams/${exam.id}/results?attempt=${completedAttempt.id}`}>
                <Button variant="outline" size="sm">
                  مشاهده نتیجه قبلی
                </Button>
              </Link>
            </div>
          )}

          <div className="flex gap-4">
            {!completedAttempt && (
              <Link href={`/exams/${exam.id}/take`} className="flex-1">
                <Button className="w-full" size="lg">
                  شروع آزمون
                </Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                بازگشت
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

