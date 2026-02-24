import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getUserSubscriptionInfo } from "@/lib/subscription-manager";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const info = await getUserSubscriptionInfo(session.user.id);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [examsThisMonth, questionsAgg] = await Promise.all([
      db.userExam.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: startOfMonth },
        },
      }),
      db.userExam.aggregate({
        where: {
          userId: session.user.id,
          createdAt: { gte: startOfMonth },
        },
        _sum: { totalQuestions: true },
      }),
    ]);
    const questionsThisMonth = questionsAgg._sum.totalQuestions ?? 0;

    const maxExamsPerMonth = info.quotas.maxExamsPerMonth ?? 0;
    const maxQuestionsPerMonth = info.quotas.maxQuestionsPerMonth ?? 0;

    const isUnlimitedExams = !Number.isFinite(maxExamsPerMonth) || maxExamsPerMonth <= 0;
    const isUnlimitedQuestions = !Number.isFinite(maxQuestionsPerMonth) || maxQuestionsPerMonth <= 0;

    const remainingExams = isUnlimitedExams ? -1 : Math.max(0, maxExamsPerMonth - examsThisMonth);
    const remainingQuestions = isUnlimitedQuestions ? -1 : Math.max(0, maxQuestionsPerMonth - questionsThisMonth);

    return NextResponse.json({
      examSimulatorEnabled: info.examSimulatorEnabled,
      quotas: {
        maxExamsPerMonth,
        maxQuestionsPerMonth,
      },
      usage: {
        examsThisMonth,
        questionsThisMonth,
      },
      remaining: {
        exams: remainingExams,
        questions: remainingQuestions,
      },
    });
  } catch (error) {
    console.error("User exam quota error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سهمیه" },
      { status: 500 }
    );
  }
}
