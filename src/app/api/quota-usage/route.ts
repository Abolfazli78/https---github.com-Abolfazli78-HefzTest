import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

function getStartOfCurrentMonth(now: Date) {
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

async function getActiveSubscriptionWithPlan(userId: string) {
    return db.subscription.findFirst({
        where: {
            userId,
            status: "ACTIVE",
            OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
        },
        include: { plan: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function GET() {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const activeSub = await getActiveSubscriptionWithPlan(session.user.id);
    const plan = activeSub?.plan;

    const quotas = {
        maxExamsPerMonth: plan?.maxExamsPerMonth ?? 0,
        maxQuestionsPerMonth: plan?.maxQuestionsPerMonth ?? 0,
        maxStudentsAllowed: plan?.maxStudentsAllowed ?? 0,
    };

    const startOfMonth = getStartOfCurrentMonth(new Date());

    const [examsThisMonth, questionsThisMonth] =
        session.user.role === "STUDENT"
            ? await Promise.all([
                  db.examAttempt.count({
                      where: {
                          userId: session.user.id,
                          startedAt: { gte: startOfMonth },
                      },
                  }),
                  db.examAttempt.aggregate({
                      where: {
                          userId: session.user.id,
                          startedAt: { gte: startOfMonth },
                      },
                      _sum: { totalQuestions: true },
                  }).then((agg) => agg._sum.totalQuestions ?? 0),
              ])
            : await Promise.all([
                  db.exam.count({
                      where: {
                          createdAt: { gte: startOfMonth },
                          createdById: session.user.id,
                      },
                  }),
                  db.exam
                      .aggregate({
                          where: {
                              createdAt: { gte: startOfMonth },
                              createdById: session.user.id,
                          },
                          _sum: { questionCount: true },
                      })
                      .then((agg) => agg._sum.questionCount ?? 0),
              ]);

    return NextResponse.json({
        scope: "USER",
        hasActiveSubscription: !!activeSub,
        planName: plan?.name ?? null,
        quotas,
        usage: {
            examsThisMonth,
            questionsThisMonth,
            studentsCount: 0,
        },
    });
}
