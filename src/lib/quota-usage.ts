import { db } from "@/lib/db";

export type QuotaUsageSummary = {
    scope: "TEACHER" | "INSTITUTE";
    hasActiveSubscription: boolean;
    planName: string | null;
    quotas: {
        maxExamsPerMonth: number;
        maxQuestionsPerMonth: number;
        maxStudentsAllowed: number;
    };
    usage: {
        examsThisMonth: number;
        questionsThisMonth: number;
        studentsCount: number;
    };
};

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
        include: {
            plan: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getQuotaUsageSummaryForTeacher(teacherId: string): Promise<QuotaUsageSummary> {
    const activeSub = await getActiveSubscriptionWithPlan(teacherId);

    const plan = activeSub?.plan;

    const quotas = {
        maxExamsPerMonth: plan?.maxExamsPerMonth ?? 0,
        maxQuestionsPerMonth: plan?.maxQuestionsPerMonth ?? 0,
        maxStudentsAllowed: plan?.maxStudentsAllowed ?? 0,
    };

    const startOfMonth = getStartOfCurrentMonth(new Date());

    const examWhere = {
        createdAt: { gte: startOfMonth },
        createdById: teacherId,
    };

    const [examsThisMonth, questionsAgg, studentsCount] = await Promise.all([
        db.exam.count({ where: examWhere }),
        db.exam.aggregate({ where: examWhere, _sum: { questionCount: true } }),
        db.user.count({
            where: {
                teacherId,
            },
        }),
    ]);

    return {
        scope: "TEACHER",
        hasActiveSubscription: !!activeSub,
        planName: plan?.name ?? null,
        quotas,
        usage: {
            examsThisMonth,
            questionsThisMonth: questionsAgg._sum.questionCount ?? 0,
            studentsCount,
        },
    };
}

export async function getQuotaUsageSummaryForInstitute(instituteId: string): Promise<QuotaUsageSummary> {
    const activeSub = await getActiveSubscriptionWithPlan(instituteId);
    const plan = activeSub?.plan;

    const quotas = {
        maxExamsPerMonth: plan?.maxExamsPerMonth ?? 0,
        maxQuestionsPerMonth: plan?.maxQuestionsPerMonth ?? 0,
        maxStudentsAllowed: plan?.maxStudentsAllowed ?? 0,
    };

    const startOfMonth = getStartOfCurrentMonth(new Date());

    const examWhere = {
        createdAt: { gte: startOfMonth },
        createdBy: { instituteId },
    };

    const [examsThisMonth, questionsAgg, studentsCount] = await Promise.all([
        db.exam.count({ where: examWhere }),
        db.exam.aggregate({ where: examWhere, _sum: { questionCount: true } }),
        db.user.count({
            where: {
                teacher: { instituteId },
            },
        }),
    ]);

    return {
        scope: "INSTITUTE",
        hasActiveSubscription: !!activeSub,
        planName: plan?.name ?? null,
        quotas,
        usage: {
            examsThisMonth,
            questionsThisMonth: questionsAgg._sum.questionCount ?? 0,
            studentsCount,
        },
    };
}
