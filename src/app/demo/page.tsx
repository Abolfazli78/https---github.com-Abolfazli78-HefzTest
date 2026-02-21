import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExamCard } from "@/components/user/exam-card";
import { InvitationsList } from "@/components/user/invitations-list";
import { UserUsageWidget } from "@/components/subscription/user-usage-widget";

export default async function DemoDashboardPage() {
  const activeExamsData = await db.exam.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const activeExams = activeExamsData.map((exam) => ({
    id: exam.id,
    title: exam.title,
    description: exam.description ?? undefined,
    duration: exam.duration,
    questionCount: exam.questionCount,
    accessLevel: exam.accessLevel,
  }));

  const totalAttempts = 0;
  const completedAttemptsCount = 0;
  const avgScore = { _avg: { score: null as number | null } };
  const activeSubscription: any = null;

  const recentAttempts: any[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">خوش آمدید، کاربر مهمان</h1>
        <p className="text-muted-foreground">خلاصه فعالیت‌ها و آزمون‌های شما</p>
      </div>

      <UserUsageWidget />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-100">کل آزمون‌ها</CardDescription>
            <CardTitle className="text-4xl">{totalAttempts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-100">{completedAttemptsCount} آزمون تکمیل شده</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-100">میانگین نمرات</CardDescription>
            <CardTitle className="text-4xl">{avgScore._avg.score ? Math.round(avgScore._avg.score) : 0}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-100">عملکرد کلی شما</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-amber-100">اشتراک فعال</CardDescription>
            <CardTitle className="text-2xl">{activeSubscription?.plan?.name ? activeSubscription.plan.name : "رایگان"}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeSubscription ? (
              activeSubscription.endDate ? (
                <p className="text-sm text-amber-100">تا {new Date(activeSubscription.endDate).toLocaleDateString("fa-IR")}</p>
              ) : (
                <p className="text-sm text-amber-100">بدون محدودیت</p>
              )
            ) : (
              <Link href="/subscriptions" className="text-sm text-amber-100 underline">ارتقاء حساب</Link>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">آزمون‌های پیشنهادی</h2>
            <Link href="/exams">
              <Button variant="ghost" size="sm">مشاهده همه</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {activeExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
          {activeExams.length === 0 && (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                در حال حاضر آزمونی در دسترس نیست
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <InvitationsList />

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">فعالیت‌های اخیر</h2>
            <Link href="/history">
              <Button variant="ghost" size="sm">تاریخچه</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentAttempts.length > 0 ? (
              recentAttempts.map((attempt) => (
                <Card key={attempt.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm line-clamp-1">{attempt.exam.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attempt.startedAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                      <div className="text-left">
                        {attempt.score !== null ? (
                          <div className="text-lg font-bold text-primary">{attempt.score}%</div>
                        ) : (
                          <div className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">در حال انجام</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground text-sm">
                  هنوز آزمونی شرکت نکرده‌اید
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
