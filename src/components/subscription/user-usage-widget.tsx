"use client";

import { useState, useEffect } from "react";
import { UsageTracker } from "./usage-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface QuotaUsage {
  hasActiveSubscription: boolean;
  planName?: string;
  quotas: {
    maxExamsPerMonth: number;
    maxQuestionsPerMonth: number;
    maxStudentsAllowed?: number;
  };
  usage: {
    examsThisMonth: number;
    questionsThisMonth: number;
    studentsCount?: number;
  };
}

export function UserUsageWidget() {
  const [quotaUsage, setQuotaUsage] = useState<QuotaUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/quota-usage");
        if (res.ok) {
          const data = await res.json();
          setQuotaUsage(data);
        }
      } catch (err) {
        console.error("Failed to fetch quota usage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading || !quotaUsage) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm">اشتراک</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!quotaUsage.hasActiveSubscription ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">بدون اشتراک فعال</div>
              <div className="text-xs text-muted-foreground">برای دسترسی به امکانات بیشتر ارتقاء دهید</div>
            </div>
            <Link href="/subscriptions">
              <Button size="sm">ارتقاء</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">پلن</div>
              <div className="text-xs font-semibold">{quotaUsage.planName || "-"}</div>
            </div>
            <UsageTracker
              title="آزمون‌ها (این ماه)"
              used={quotaUsage.usage.examsThisMonth}
              limit={quotaUsage.quotas.maxExamsPerMonth}
            />
            <UsageTracker
              title="سوالات (این ماه)"
              used={quotaUsage.usage.questionsThisMonth}
              limit={quotaUsage.quotas.maxQuestionsPerMonth}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
