import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPerformanceChart } from "../../../../../components/admin/user-performance-chart";
import { SubscriptionStatus } from "@prisma/client";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    include: {
      subscriptions: {
        include: {
          plan: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      examAttempts: {
        include: {
          exam: true,
        },
        orderBy: { startedAt: "desc" },
        take: 10,
      },
      _count: {
        select: { examAttempts: true, supportTickets: true },
      },
    },
  });

  if (!user) {
    redirect("/admin/users");
  }

  const activeSub = user.subscriptions.find(
    (s) => s.status === SubscriptionStatus.ACTIVE
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-muted-foreground">جزئیات کاربر</p>
        </div>
        <Link href="/admin/users">
          <Button variant="outline">بازگشت</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>اشتراک کاربر</CardTitle>
                <CardDescription>وضعیت و تاریخچه اشتراک‌ها</CardDescription>
              </div>
              <Link href="/admin/subscriptions/manage">
                <Button variant="outline">مدیریت اشتراک‌ها</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border p-4 bg-muted/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">اشتراک فعال</p>
                  <p className="font-semibold">
                    {activeSub ? activeSub.plan.name : "ندارد"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={activeSub ? "default" : "secondary"}>
                    {activeSub ? "فعال" : "بدون اشتراک"}
                  </Badge>
                  {activeSub?.endDate && (
                    <Badge variant="outline">
                      تا {new Date(activeSub.endDate).toLocaleDateString("fa-IR")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {user.subscriptions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">آخرین اشتراک‌ها</p>
                <div className="space-y-2">
                  {user.subscriptions.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{s.plan.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(s.createdAt).toLocaleDateString("fa-IR")} · {s.plan.price.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={s.status === "ACTIVE" ? "default" : "secondary"}>
                          {s.status}
                        </Badge>
                        {s.endDate ? (
                          <Badge variant="outline">
                            پایان {new Date(s.endDate).toLocaleDateString("fa-IR")}
                          </Badge>
                        ) : (
                          <Badge variant="outline">-</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">هیچ اشتراکی برای این کاربر ثبت نشده است.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>اطلاعات کاربر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">نام</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ایمیل</p>
                <p className="font-semibold" dir="ltr">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نقش</p>
                <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                  {user.role === "ADMIN" ? "مدیر" : "کاربر"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">وضعیت</p>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تاریخ ثبت‌نام</p>
                <p className="font-semibold">
                  {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آمار و عملکرد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">تعداد آزمون‌ها</p>
                <p className="text-3xl font-bold">{user._count.examAttempts}</p>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">تعداد تیکت‌ها</p>
                <p className="text-3xl font-bold">{user._count.supportTickets}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4 text-muted-foreground">روند نمرات اخیر</h4>
              <UserPerformanceChart
                data={user.examAttempts
                  .filter(a => a.status === "COMPLETED" && a.score !== null)
                  .reverse()
                  .map(a => ({
                    date: new Date(a.startedAt).toLocaleDateString("fa-IR", { month: 'short', day: 'numeric' }),
                    score: a.score || 0
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {user.examAttempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>آزمون‌های اخیر</CardTitle>
              <CardDescription>
                آخرین {user.examAttempts.length} آزمون
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.examAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{attempt.exam.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(attempt.startedAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                    <div className="text-left">
                      {attempt.score !== null && (
                        <p className="font-bold">
                          {attempt.score} / {attempt.totalQuestions}
                        </p>
                      )}
                      <Badge
                        variant={
                          attempt.status === "COMPLETED"
                            ? "default"
                            : attempt.status === "IN_PROGRESS"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {attempt.status === "COMPLETED"
                          ? "تکمیل شده"
                          : attempt.status === "IN_PROGRESS"
                            ? "در حال انجام"
                            : "منقضی شده"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

