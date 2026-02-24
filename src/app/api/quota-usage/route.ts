import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getUserSubscriptionInfo } from "@/lib/subscription-manager";

export const dynamic = "force-dynamic";

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

    const info = await getUserSubscriptionInfo(session.user.id);
    const activeSub = await getActiveSubscriptionWithPlan(session.user.id);
    const plan = activeSub?.plan;

    const quotas = {
        maxExamsPerMonth: info.quotas.maxExamsPerMonth ?? plan?.maxExamsPerMonth ?? 0,
        maxQuestionsPerMonth: info.quotas.maxQuestionsPerMonth ?? plan?.maxQuestionsPerMonth ?? 0,
        maxStudentsAllowed: info.quotas.maxStudentsAllowed ?? plan?.maxStudentsAllowed ?? 0,
    };

    const startOfMonth = getStartOfCurrentMonth(new Date());

    // Aggregated usage strategy:
    // - If user دارای قابلیت ساخت آزمون یا شبیه‌ساز فعال است، مصرف را بر اساس آزمون‌های ساخته‌شده + شبیه‌ساز کاربر جمع می‌زنیم
    // - در غیر این صورت (دانش‌آموز بدون این قابلیت‌ها)، مصرف را بر اساس تلاش‌های آزمون (attempts) نمایش می‌دهیم
    const hasCreationFeatures =
        session.user.role !== "STUDENT" ||
        info.features.includes("exam_creation") ||
        info.examSimulatorEnabled === true;

    let examsThisMonth = 0;
    let questionsThisMonth = 0;

    if (hasCreationFeatures) {
        // Exams created by user
        const [createdExamsCount, createdExamsQuestions, createdUserExamsCount, createdUserExamsQuestions] =
            await Promise.all([
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
                db.userExam.count({
                    where: {
                        userId: session.user.id,
                        createdAt: { gte: startOfMonth },
                    },
                }),
                db.userExam
                    .aggregate({
                        where: {
                            userId: session.user.id,
                            createdAt: { gte: startOfMonth },
                        },
                        _sum: { totalQuestions: true },
                    })
                    .then((agg) => agg._sum.totalQuestions ?? 0),
            ]);

        examsThisMonth = createdExamsCount + createdUserExamsCount;
        questionsThisMonth = createdExamsQuestions + createdUserExamsQuestions;
    } else {
        // Student usage: attempts
        const [attemptsCount, attemptsQuestions] = await Promise.all([
            db.examAttempt.count({
                where: {
                    userId: session.user.id,
                    startedAt: { gte: startOfMonth },
                },
            }),
            db.examAttempt
                .aggregate({
                    where: {
                        userId: session.user.id,
                        startedAt: { gte: startOfMonth },
                    },
                    _sum: { totalQuestions: true },
                })
                .then((agg) => agg._sum.totalQuestions ?? 0),
        ]);
        examsThisMonth = attemptsCount;
        questionsThisMonth = attemptsQuestions;
    }

    const json = {
        scope: "USER",
        hasActiveSubscription: !!activeSub,
        planName: plan?.name ?? null,
        quotas,
        usage: {
            examsThisMonth,
            questionsThisMonth,
            studentsCount: 0,
        },
    };

    return NextResponse.json(json, {
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, private",
        },
    });
}
