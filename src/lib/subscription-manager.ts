import { db } from "@/lib/db";
import type { User, Subscription, SubscriptionPlan } from "@/generated/client";
import { checkAccess } from "./access";

export type RoleTier = "STUDENT" | "TEACHER" | "INSTITUTE";

export interface TierFeatures {
  student: {
    base: string[];
    quotas: {
      maxExamsPerMonth: number;
      maxQuestionsPerMonth: number;
      maxStudentsAllowed: number;
      maxTeachersAllowed: number;
      maxClassesAllowed: number;
    };
  };
  teacher: {
    base: string[];
    quotas: {
      maxExamsPerMonth: number;
      maxQuestionsPerMonth: number;
      maxStudentsAllowed: number;
      maxTeachersAllowed: number;
      maxClassesAllowed: number;
    };
  };
  institute: {
    base: string[];
    quotas: {
      maxExamsPerMonth: number;
      maxQuestionsPerMonth: number;
      maxStudentsAllowed: number;
      maxTeachersAllowed: number;
      maxClassesAllowed: number;
    };
  };
}

export const TIER_FEATURES: TierFeatures = {
  student: {
    base: ["basic_exams", "performance_tracking", "leaderboard_access"],
    quotas: {
      maxExamsPerMonth: 10,
      maxQuestionsPerMonth: 500,
      maxStudentsAllowed: 0,
      maxTeachersAllowed: 0,
      maxClassesAllowed: 0,
    },
  },
  teacher: {
    base: [
      "exam_creation",
      "student_management", 
      "basic_analytics",
      "question_bank_access",
      "custom_exams",
      "ticket_support"
    ],
    quotas: {
      maxExamsPerMonth: 50,
      maxQuestionsPerMonth: 2000,
      maxStudentsAllowed: 50,
      maxTeachersAllowed: 0,
      maxClassesAllowed: 5,
    },
  },
  institute: {
    base: [
      "exam_creation",
      "student_management",
      "teacher_management",
      "advanced_analytics",
      "question_bank_access",
      "custom_exams",
      "white_label",
      "bulk_operations",
      "priority_support",
      "api_access"
    ],
    quotas: {
      maxExamsPerMonth: 500,
      maxQuestionsPerMonth: 10000,
      maxStudentsAllowed: 500,
      maxTeachersAllowed: 50,
      maxClassesAllowed: 50,
    },
  },
};

export interface SubscriptionInfo {
  hasActiveSubscription: boolean;
  subscription?: Subscription & { plan: SubscriptionPlan };
  tier: RoleTier;
  features: string[];
  quotas: {
    maxExamsPerMonth: number;
    maxQuestionsPerMonth: number;
    maxStudentsAllowed: number;
    maxTeachersAllowed: number;
    maxClassesAllowed: number;
  };
  usage: {
    examsThisMonth: number;
    questionsThisMonth: number;
    studentsCount: number;
    teachersCount: number;
    classesCount: number;
  };
}

export async function getUserSubscriptionInfo(userId: string): Promise<SubscriptionInfo> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const tier = user.role as RoleTier;
  
  // Get active subscription
  const activeSubscription = await db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
    },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  const hasActiveSubscription = !!activeSubscription;
  const plan = activeSubscription?.plan;

  // Get tier features
  const tierConfig = TIER_FEATURES[tier.toLowerCase() as keyof TierFeatures];
  let features = new Set(tierConfig.base);

  // Add plan-specific features
  if (plan?.features) {
    try {
      const planFeatures = JSON.parse(plan.features);
      if (Array.isArray(planFeatures)) {
        planFeatures.forEach((f: unknown) => {
          if (typeof f === 'string') {
            features.add(f);
          }
        });
      }
    } catch (e) {
      console.warn("Invalid features JSON in plan:", plan.features);
    }
  }

  // Get quotas from plan or use tier defaults
  const quotas = {
    maxExamsPerMonth: plan?.maxExamsPerMonth ?? tierConfig.quotas.maxExamsPerMonth,
    maxQuestionsPerMonth: plan?.maxQuestionsPerMonth ?? tierConfig.quotas.maxQuestionsPerMonth,
    maxStudentsAllowed: plan?.maxStudentsAllowed ?? tierConfig.quotas.maxStudentsAllowed,
    maxTeachersAllowed: plan?.maxTeachersAllowed ?? tierConfig.quotas.maxTeachersAllowed,
    maxClassesAllowed: plan?.maxClassesAllowed ?? tierConfig.quotas.maxClassesAllowed,
  };

  // Get current usage
  const usage = await getCurrentUsage(userId, tier);

  return {
    hasActiveSubscription,
    subscription: activeSubscription || undefined,
    tier,
    features: Array.from(features),
    quotas,
    usage,
  };
}

async function getCurrentUsage(userId: string, tier: RoleTier) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const baseUsage = {
    examsThisMonth: 0,
    questionsThisMonth: 0,
    studentsCount: 0,
    teachersCount: 0,
    classesCount: 0,
  };

  if (tier === "STUDENT") {
    // Student usage: exam attempts and questions answered
    const [examsThisMonth, questionsAgg] = await Promise.all([
      db.examAttempt.count({
        where: {
          userId,
          startedAt: { gte: startOfMonth },
        },
      }),
      db.examAttempt.aggregate({
        where: {
          userId,
          startedAt: { gte: startOfMonth },
        },
        _sum: { totalQuestions: true },
      }),
    ]);

    return {
      ...baseUsage,
      examsThisMonth,
      questionsThisMonth: questionsAgg._sum.totalQuestions ?? 0,
    };
  } else if (tier === "TEACHER") {
    // Teacher usage: exams created, students managed
    const [examsThisMonth, questionsAgg, studentsCount] = await Promise.all([
      db.exam.count({
        where: {
          createdById: userId,
          createdAt: { gte: startOfMonth },
        },
      }),
      db.exam.aggregate({
        where: {
          createdById: userId,
          createdAt: { gte: startOfMonth },
        },
        _sum: { questionCount: true },
      }),
      db.user.count({
        where: {
          teacherId: userId,
          isActive: true,
        },
      }),
    ]);

    return {
      ...baseUsage,
      examsThisMonth,
      questionsThisMonth: questionsAgg._sum.questionCount ?? 0,
      studentsCount,
    };
  } else if (tier === "INSTITUTE") {
    // Institute usage: exams created, students and teachers managed
    const [examsThisMonth, questionsAgg, studentsCount, teachersCount] = await Promise.all([
      db.exam.count({
        where: {
          createdById: userId,
          createdAt: { gte: startOfMonth },
        },
      }),
      db.exam.aggregate({
        where: {
          createdById: userId,
          createdAt: { gte: startOfMonth },
        },
        _sum: { questionCount: true },
      }),
      db.user.count({
        where: {
          instituteId: userId,
          isActive: true,
        },
      }),
      db.user.count({
        where: {
          instituteId: userId,
          role: "TEACHER",
          isActive: true,
        },
      }),
    ]);

    return {
      ...baseUsage,
      examsThisMonth,
      questionsThisMonth: questionsAgg._sum.questionCount ?? 0,
      studentsCount,
      teachersCount,
    };
  }

  return baseUsage;
}

export async function checkFeatureAccess(
  userId: string,
  feature: string,
  requestedQuota?: { key: string; value: number }
): Promise<{ allowed: boolean; reason?: string; subscriptionInfo?: SubscriptionInfo }> {
  try {
    const subscriptionInfo = await getUserSubscriptionInfo(userId);
    
    // Check if feature is available
    if (!subscriptionInfo.features.includes(feature)) {
      return {
        allowed: false,
        reason: `Feature "${feature}" not available in your subscription tier`,
        subscriptionInfo,
      };
    }

    // Check quota limits if requested
    if (requestedQuota) {
      const quotaKey = requestedQuota.key as keyof typeof subscriptionInfo.quotas;
      const currentUsage = (subscriptionInfo.usage as any)[quotaKey.replace('max', '').toLowerCase()] || 0;
      const limit = subscriptionInfo.quotas[quotaKey];
      
      if (limit > 0 && currentUsage + requestedQuota.value > limit) {
        return {
          allowed: false,
          reason: `Quota exceeded for ${requestedQuota.key}. Current: ${currentUsage}, Limit: ${limit}`,
          subscriptionInfo,
        };
      }
    }

    return { allowed: true, subscriptionInfo };
  } catch (error) {
    console.error("Error checking feature access:", error);
    return { allowed: false, reason: "Error checking access" };
  }
}

export async function createDefaultSubscriptionPlans() {
  const plans = [
    // Student Plans
    {
      name: "دانش‌آموز رایگان",
      description: "دسترسی به آزمون‌های پایه و tracking عملکرد",
      price: 0,
      duration: 30,
      targetRole: "STUDENT" as const,
      features: JSON.stringify(TIER_FEATURES.student.base),
      ...TIER_FEATURES.student.quotas,
    },
    {
      name: "دانش‌آموز پرمیوم",
      description: "دسترسی نامحدود به آزمون‌ها و تحلیل‌های پیشرفته",
      price: 9.99,
      duration: 30,
      targetRole: "STUDENT" as const,
      features: JSON.stringify([...TIER_FEATURES.student.base, "unlimited_exams", "advanced_analytics", "ticket_support"]),
      maxExamsPerMonth: -1, // Unlimited
      maxQuestionsPerMonth: -1, // Unlimited
      maxStudentsAllowed: 0,
      maxTeachersAllowed: 0,
      maxClassesAllowed: 0,
    },
    // Teacher Plans
    {
      name: "معلم استاندارد",
      description: "ایجاد آزمون و مدیریت دانش‌آموزان",
      price: 29.99,
      duration: 30,
      targetRole: "TEACHER" as const,
      features: JSON.stringify(TIER_FEATURES.teacher.base),
      ...TIER_FEATURES.teacher.quotas,
    },
    {
      name: "معلم پرمیوم",
      description: "ظرفیت بالا و ابزارهای پیشرفته",
      price: 59.99,
      duration: 30,
      targetRole: "TEACHER" as const,
      features: JSON.stringify([...TIER_FEATURES.teacher.base, "advanced_analytics", "custom_themes"]),
      maxExamsPerMonth: 200,
      maxQuestionsPerMonth: 5000,
      maxStudentsAllowed: 200,
      maxTeachersAllowed: 0,
      maxClassesAllowed: 20,
    },
    // Institute Plans
    {
      name: "موسسه استاندارد",
      description: "مدیریت کامل معلمان و دانش‌آموزان",
      price: 199.99,
      duration: 30,
      targetRole: "INSTITUTE" as const,
      features: JSON.stringify(TIER_FEATURES.institute.base),
      ...TIER_FEATURES.institute.quotas,
    },
    {
      name: "موسسه پیشرفته",
      description: "ظرفیت نامحدود و امکانات سفارشی",
      price: 499.99,
      duration: 30,
      targetRole: "INSTITUTE" as const,
      features: JSON.stringify([...TIER_FEATURES.institute.base, "unlimited_everything", "dedicated_support"]),
      maxExamsPerMonth: -1, // Unlimited
      maxQuestionsPerMonth: -1, // Unlimited
      maxStudentsAllowed: -1, // Unlimited
      maxTeachersAllowed: -1, // Unlimited
      maxClassesAllowed: -1, // Unlimited
    },
  ];

  for (const planData of plans) {
    const existing = await db.subscriptionPlan.findFirst({
      where: { name: planData.name, targetRole: planData.targetRole },
    });

    if (!existing) {
      await db.subscriptionPlan.create({ data: planData });
      console.log(`Created default plan: ${planData.name}`);
    }
  }
}

export async function upgradeSubscription(userId: string, planId: string) {
  const plan = await db.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  // Deactivate existing subscriptions
  await db.subscription.updateMany({
    where: {
      userId,
      status: "ACTIVE",
    },
    data: {
      status: "EXPIRED",
      endDate: new Date(),
    },
  });

  // Create new subscription
  const subscription = await db.subscription.create({
    data: {
      userId,
      planId,
      status: "ACTIVE",
      startDate: new Date(),
      endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
    },
    include: { plan: true },
  });

  return subscription;
}
