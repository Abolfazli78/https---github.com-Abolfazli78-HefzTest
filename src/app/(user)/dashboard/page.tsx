import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getAccessibleExams } from "@/lib/exam-access";
import { UserRole } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExamCard } from "@/components/user/exam-card";
import { InvitationsList } from "@/components/user/invitations-list";
import { UserUsageWidget } from "@/components/subscription/user-usage-widget";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // Redirect based on role
  if (session.user.role === "ADMIN") {
    redirect("/admin");
  } else if (session.user.role === "TEACHER") {
    redirect("/teacher");
  } else if (session.user.role === "INSTITUTE") {
    redirect("/institute");
  }

  // Only load exams that this user is allowed to see (own + teacher/institute/admin according to hierarchy)
  const accessibleExams = await getAccessibleExams(
    session.user.id,
    session.user.role as UserRole
  );

  // Limit to last 6 exams for the "suggested exams" section
  const activeExams = accessibleExams.slice(0, 6).map((exam) => ({
    id: exam.id,
    title: exam.title,
    description: exam.description ?? undefined,
    duration: exam.duration,
    questionCount: exam.questionCount,
    accessLevel: exam.accessLevel,
  }));

  const recentAttempts = await db.examAttempt.findMany({
    where: { userId: session.user.id },
    include: {
      exam: true,
    },
    orderBy: { startedAt: "desc" },
    take: 5,
  });

  const totalAttempts = await db.examAttempt.count({ where: { userId: session.user.id } });
  const completedAttemptsCount = await db.examAttempt.count({ where: { userId: session.user.id, status: "COMPLETED" } });
  const avgScore = await db.examAttempt.aggregate({
    where: { userId: session.user.id, status: "COMPLETED" },
    _avg: { score: true }
  });

  const activeSubscription = await db.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
    },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">خوش آمدید، {session.user.name}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">خلاصه فعالیت‌ها و آزمون‌های شما</p>
      </div>

      <UserUsageWidget />

      <div className="grid gap-6 lg:gap-8 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardDescription className="text-blue-100 text-sm">کل آزمون‌ها</CardDescription>
            <CardTitle className="text-3xl sm:text-4xl">{totalAttempts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-100">{completedAttemptsCount} آزمون تکمیل شده</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardDescription className="text-emerald-100 text-sm">میانگین نمرات</CardDescription>
            <CardTitle className="text-3xl sm:text-4xl">
              {avgScore._avg.score ? Math.round(avgScore._avg.score) : 0}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-100">عملکرد کلی شما</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardDescription className="text-amber-100 text-sm">اشتراک فعال</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">
              {activeSubscription?.plan?.name ? activeSubscription.plan.name : "رایگان"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSubscription ? (
              activeSubscription.endDate ? (
                <p className="text-sm text-amber-100">
                  تا {new Date(activeSubscription.endDate).toLocaleDateString("fa-IR")}
                </p>
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
            <h2 className="text-xl sm:text-2xl font-bold">آزمون‌های پیشنهادی</h2>
            <Link href="/exams">
              <Button variant="outline" size="sm" className="rounded-full px-4">مشاهده همه</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {activeExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
          {activeExams.length === 0 && (
            <Card className="bg-muted/50 border-dashed rounded-2xl">
              <CardContent className="py-12 text-center text-muted-foreground">
                در حال حاضر آزمونی در دسترس نیست
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <InvitationsList />
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold">فعالیت‌های اخیر</h2>
            <Link href="/history">
              <Button variant="outline" size="sm" className="rounded-full px-4">تاریخچه</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentAttempts.length > 0 ? (
              recentAttempts.map((attempt) => (
                <Card key={attempt.id} className="rounded-2xl border-border/60 hover:shadow-md transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm line-clamp-1">{attempt.exam.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attempt.startedAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                      <div className="text-left">
                        {attempt.score !== null ? (
                          <div className="text-lg font-bold text-primary">
                            {attempt.score}%
                          </div>
                        ) : (
                          <div className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                            در حال انجام
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-muted/50 border-dashed rounded-2xl">
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

