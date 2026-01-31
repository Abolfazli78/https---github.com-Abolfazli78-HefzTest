"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface SubscriptionInfo {
  hasActiveSubscription: boolean;
  tier: "STUDENT" | "TEACHER" | "INSTITUTE";
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
  planName?: string;
  subscription?: any;
}

export function useSubscription() {
  const { data: session } = useSession();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const fetchSubscriptionInfo = async () => {
      try {
        const response = await fetch("/api/subscriptions/info");
        if (!response.ok) {
          throw new Error("Failed to fetch subscription info");
        }
        const data = await response.json();
        setSubscriptionInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, [session]);

  const checkFeatureAccess = async (feature: string, requestedQuota?: { key: string; value: number }) => {
    try {
      const response = await fetch("/api/subscriptions/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature, requestedQuota }),
      });

      if (!response.ok) {
        throw new Error("Failed to check feature access");
      }

      return await response.json();
    } catch (err) {
      console.error("Error checking feature access:", err);
      return { allowed: false, reason: "Error checking access" };
    }
  };

  const upgradeSubscription = async (planId: string) => {
    try {
      const response = await fetch("/api/subscriptions/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upgrade subscription");
      }

      const result = await response.json();
      
      // Refresh subscription info after upgrade
      if (result.success) {
        const infoResponse = await fetch("/api/subscriptions/info");
        if (infoResponse.ok) {
          const updatedInfo = await infoResponse.json();
          setSubscriptionInfo(updatedInfo);
        }
      }

      return result;
    } catch (err) {
      console.error("Error upgrading subscription:", err);
      throw err;
    }
  };

  const getQuotaUsage = (quotaKey: keyof SubscriptionInfo["quotas"]) => {
    if (!subscriptionInfo) return { used: 0, limit: 0, percentage: 0 };

    const limit = subscriptionInfo.quotas[quotaKey];
    const usageKey = quotaKey.replace('max', '').toLowerCase() as keyof SubscriptionInfo["usage"];
    const used = subscriptionInfo.usage[usageKey] || 0;

    // Handle unlimited quotas (-1)
    if (limit <= 0) {
      return { used, limit: -1, percentage: 0 };
    }

    return {
      used,
      limit,
      percentage: Math.min((used / limit) * 100, 100),
    };
  };

  const hasFeature = (feature: string) => {
    return subscriptionInfo?.features.includes(feature) || false;
  };

  const canCreateExam = () => hasFeature("exam_creation");
  const canManageStudents = () => hasFeature("student_management");
  const canManageTeachers = () => hasFeature("teacher_management");
  const hasUnlimitedExams = () => hasFeature("unlimited_exams") || getQuotaUsage("maxExamsPerMonth").limit === -1;

  return {
    subscriptionInfo,
    loading,
    error,
    checkFeatureAccess,
    upgradeSubscription,
    getQuotaUsage,
    hasFeature,
    canCreateExam,
    canManageStudents,
    canManageTeachers,
    hasUnlimitedExams,
  };
}
