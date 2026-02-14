import { db } from "@/lib/db";
import type { SubscriptionPlan } from "@/generated/client";

export type QuotaKey = Extract<
  keyof SubscriptionPlan,
  | "maxQuestionsPerMonth"
  | "maxExamsPerMonth"
  | "maxStudentsAllowed"
  | "maxTeachersAllowed"
  | "maxClassesAllowed"
>;

export type RequiredQuota = {
  key: QuotaKey;
  used: number;
  requested?: number;
};

export type AccessDenyReason =
  | "UNAUTHORIZED"
  | "NO_ACTIVE_SUBSCRIPTION"
  | "PLAN_ROLE_MISMATCH"
  | "FEATURE_NOT_AVAILABLE"
  | "QUOTA_EXCEEDED";

export type AccessCheckResult =
  | { allowed: true }
  | {
      allowed: false;
      reason: AccessDenyReason;
      message: string;
    };

type PlanTargetRole = "STUDENT" | "TEACHER" | "INSTITUTE";

type UserRole = "ADMIN" | "INSTITUTE" | "TEACHER" | "STUDENT";

function parsePlanFeatures(features: unknown): string[] {
  if (!features) return [];
  if (Array.isArray(features)) return features.filter((v): v is string => typeof v === "string");
  if (typeof features === "string") {
    try {
      const parsed = JSON.parse(features);
      if (Array.isArray(parsed)) return parsed.filter((v): v is string => typeof v === "string");
      return [];
    } catch {
      return [];
    }
  }
  return [];
}

function getEffectiveFeatures(planTargetRole: PlanTargetRole, planFeatures: string[]) {
  const baseStudent = ["advanced_analytics", "exam_creation"];
  const baseTeacher = ["ticket_support", "exam_creation", "student_management"];
  const baseInstitute = ["white_label", "advanced_reports", "teacher_management"];

  const effective = new Set<string>(planFeatures);
  baseStudent.forEach((f) => effective.add(f));
  if (planTargetRole === "TEACHER" || planTargetRole === "INSTITUTE") {
    baseTeacher.forEach((f) => effective.add(f));
  }
  if (planTargetRole === "INSTITUTE") {
    baseInstitute.forEach((f) => effective.add(f));
  }

  return effective;
}

function isUnlimited(limit: number) {
  return !Number.isFinite(limit) || limit <= 0;
}

export async function checkAccess(
  userId: string,
  featureName: string,
  requiredQuota?: RequiredQuota
): Promise<AccessCheckResult> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    return { allowed: false, reason: "UNAUTHORIZED", message: "غیرمجاز" };
  }

  console.log('Access check:', { userId, userRole: user.role, featureName });

  if ((user.role as UserRole) === "ADMIN") {
    return { allowed: true };
  }

  const subscription = await db.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
    },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  console.log('Subscription found:', !!subscription, subscription?.plan?.targetRole, subscription?.plan?.features);

  if (!subscription?.plan) {
    return {
      allowed: false,
      reason: "NO_ACTIVE_SUBSCRIPTION",
      message: "این قابلیت در پلن فعلی شما موجود نیست",
    };
  }

  const plan = subscription.plan;
  const planTargetRole = (plan.targetRole as PlanTargetRole) ?? "STUDENT";
  const userRole = user.role as UserRole;

  console.log('Role comparison:', { planTargetRole, userRole });

  if (planTargetRole !== userRole) {
    // Allow STUDENT users to access TEACHER-targeted plans for exam creation
    if (userRole === "STUDENT" && planTargetRole === "TEACHER" && featureName === "exam_creation") {
      console.log('Allowing STUDENT to use TEACHER plan for exam_creation');
      return { allowed: true };
    }
    console.log('Role mismatch detected');
    return {
      allowed: false,
      reason: "PLAN_ROLE_MISMATCH",
      message: "این قابلیت در پلن فعلی شما موجود نیست",
    };
  }

  const features = getEffectiveFeatures(planTargetRole, parsePlanFeatures(plan.features));
  console.log('Effective features:', Array.from(features));

  if (featureName && !features.has(featureName)) {
    console.log('Feature not found:', featureName);
    return {
      allowed: false,
      reason: "FEATURE_NOT_AVAILABLE",
      message: "این قابلیت در پلن فعلی شما موجود نیست",
    };
  }

  if (requiredQuota) {
    const requested = requiredQuota.requested ?? 0;
    const limit = plan[requiredQuota.key] as number;

    if (!isUnlimited(limit) && requiredQuota.used + requested > limit) {
      return {
        allowed: false,
        reason: "QUOTA_EXCEEDED",
        message: "این قابلیت در پلن فعلی شما موجود نیست",
      };
    }
  }

  return { allowed: true };
}
