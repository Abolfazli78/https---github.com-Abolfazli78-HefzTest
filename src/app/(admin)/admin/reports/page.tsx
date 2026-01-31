import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportsCharts } from "../../../../components/admin/reports-charts";

export default async function ReportsPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const totalUsers = await db.user.count();
  const activeUsers = await db.user.count({ where: { isActive: true } });
  const totalExams = await db.exam.count();
  const activeExams = await db.exam.count({ where: { isActive: true } });
  const totalQuestions = await db.question.count();
  const totalAttempts = await db.examAttempt.count();
  const completedAttempts = await db.examAttempt.count({
    where: { status: "COMPLETED" },
  });

  // Exam participation data
  const examStats = await db.exam.findMany({
    include: {
      _count: {
        select: { examAttempts: true },
      },
    },
    orderBy: {
      examAttempts: {
        _count: "desc",
      },
    },
    take: 10,
  });

  const examData = examStats.map((exam) => ({
    name: exam.title.length > 20 ? exam.title.substring(0, 20) + "..." : exam.title,
    attempts: exam._count.examAttempts,
  }));

  // Status distribution
  const statusData = [
    { name: "تکمیل شده", value: completedAttempts },
    { name: "در حال انجام", value: await db.examAttempt.count({ where: { status: "IN_PROGRESS" } }) },
    { name: "منقضی شده", value: await db.examAttempt.count({ where: { status: "EXPIRED" } }) },
  ];

  // Juz Distribution
  const juzStats = await db.exam.groupBy({
    by: ['juz'],
    _count: {
      id: true
    },
    where: {
      juz: { not: null }
    }
  });
  const juzData = juzStats.map(item => ({ name: `جزء ${item.juz}`, count: item._count.id }));

  // Year Distribution
  const yearStats = await db.exam.groupBy({
    by: ['year'],
    _count: {
      id: true
    },
    where: {
      year: { not: null }
    }
  });
  const yearData = yearStats.map(item => ({ name: String(item.year), count: item._count.id }));

  // Topic Distribution (Memorization vs Concepts)
  // We'll check the title or description for keywords if we don't have a specific field,
  // but the schema has 'topic' in Question. For Exam, we might need to check questions.
  // Let's assume for now we can filter by selectionMode or just mock if not available.
  // Actually, let's count questions by topic as a proxy.
  const memorizationCount = await db.question.count({ where: { topic: { contains: 'حفظ' } } });
  const conceptsCount = await db.question.count({ where: { topic: { contains: 'مفاهیم' } } });
  const topicData = [
    { name: 'حفظ', count: memorizationCount },
    { name: 'مفاهیم', count: conceptsCount }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">گزارش‌ها و آمار</h1>
          <p className="text-muted-foreground">آمار و تحلیل عملکرد سیستم</p>
        </div>
        <div className="flex gap-2">
          <a href="/api/reports/export?type=attempts">
            <Button variant="outline">خروجی Excel - آزمون‌ها</Button>
          </a>
          <a href="/api/reports/export?type=users">
            <Button variant="outline">خروجی Excel - کاربران</Button>
          </a>
          <a href="/api/reports/export?type=exams">
            <Button variant="outline">خروجی Excel - آزمون‌ها</Button>
          </a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>کاربران کل</CardDescription>
            <CardTitle className="text-3xl">{totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {activeUsers} کاربر فعال
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>آزمون‌ها</CardDescription>
            <CardTitle className="text-3xl">{totalExams}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {activeExams} آزمون فعال
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>سوالات</CardDescription>
            <CardTitle className="text-3xl">{totalQuestions}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">سوال در بانک</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>آزمون‌های انجام شده</CardDescription>
            <CardTitle className="text-3xl">{totalAttempts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {completedAttempts} آزمون تکمیل شده
            </p>
          </CardContent>
        </Card>
      </div>

      <ReportsCharts
        examData={examData}
        statusData={statusData}
        juzData={juzData}
        yearData={yearData}
        topicData={topicData}
      />
    </div>
  );
}

