import { NextRequest, NextResponse } from "next/server";
import { checkFeatureAccess } from "./subscription-manager";

export interface SubscriptionMiddlewareOptions {
  requiredFeature?: string;
  requiredQuota?: { key: string; value: number };
  redirectTo?: string;
  apiResponse?: boolean;
}

export async function withSubscriptionCheck(
  request: NextRequest,
  userId: string,
  options: SubscriptionMiddlewareOptions = {}
): Promise<NextResponse | null> {
  const { requiredFeature, requiredQuota, redirectTo = "/subscriptions", apiResponse = false } = options;

  // If no feature requirement, allow access
  if (!requiredFeature) {
    return null;
  }

  try {
    const accessCheck = await checkFeatureAccess(userId, requiredFeature, requiredQuota);

    if (!accessCheck.allowed) {
      if (apiResponse) {
        return NextResponse.json(
          { 
            error: accessCheck.reason,
            subscriptionInfo: accessCheck.subscriptionInfo 
          },
          { status: 403 }
        );
      }

      // Redirect to subscriptions page with error message
      const url = new URL(redirectTo, request.url);
      url.searchParams.set("error", accessCheck.reason || "Subscription required");
      return NextResponse.redirect(url);
    }

    return null; // Access granted
  } catch (error) {
    console.error("Subscription middleware error:", error);
    
    if (apiResponse) {
      return NextResponse.json(
        { error: "Error checking subscription" },
        { status: 500 }
      );
    }

    const url = new URL(redirectTo, request.url);
    url.searchParams.set("error", "Subscription check failed");
    return NextResponse.redirect(url);
  }
}

// Feature constants for easy reference
export const FEATURES = {
  // Student features
  BASIC_EXAMS: "basic_exams",
  PERFORMANCE_TRACKING: "performance_tracking",
  LEADERBOARD_ACCESS: "leaderboard_access",
  UNLIMITED_EXAMS: "unlimited_exams",
  ADVANCED_ANALYTICS: "advanced_analytics",
  
  // Teacher features
  EXAM_CREATION: "exam_creation",
  STUDENT_MANAGEMENT: "student_management",
  QUESTION_BANK_ACCESS: "question_bank_access",
  CUSTOM_EXAMS: "custom_exams",
  TICKET_SUPPORT: "ticket_support",
  CUSTOM_THEMES: "custom_themes",
  
  // Institute features
  TEACHER_MANAGEMENT: "teacher_management",
  WHITE_LABEL: "white_label",
  BULK_OPERATIONS: "bulk_operations",
  PRIORITY_SUPPORT: "priority_support",
  API_ACCESS: "api_access",
  UNLIMITED_EVERYTHING: "unlimited_everything",
  DEDICATED_SUPPORT: "dedicated_support",
} as const;

// Quota constants
export const QUOTAS = {
  MAX_EXAMS_PER_MONTH: "maxExamsPerMonth",
  MAX_QUESTIONS_PER_MONTH: "maxQuestionsPerMonth",
  MAX_STUDENTS_ALLOWED: "maxStudentsAllowed",
  MAX_TEACHERS_ALLOWED: "maxTeachersAllowed",
  MAX_CLASSES_ALLOWED: "maxClassesAllowed",
} as const;
