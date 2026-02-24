"use client";

import { useState, useEffect } from "react";
import { UsageTracker } from "./usage-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    let aborted = false;
    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/quota-usage", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!aborted) setQuotaUsage(data);
        }
      } catch (err) {
        console.error("Failed to fetch quota usage:", err);
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    fetchUsage();
    // Invalidate on custom event from mutations
    const onUpdated = () => fetchUsage();
    window.addEventListener("subscription:updated", onUpdated);
    return () => {
      aborted = true;
      window.removeEventListener("subscription:updated", onUpdated);
    };
  }, []);

  // Refetch on route changes (e.g., after navigation)
  useEffect(() => {
    const refetch = async () => {
      try {
        const res = await fetch("/api/quota-usage", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setQuotaUsage(data);
        }
      } catch {}
    };
    if (pathname) refetch();
  }, [pathname]);

  if (loading || !quotaUsage) {
    return null;
  }

  return (
    <Card className="mb-4 rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">اشتراک</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!quotaUsage.hasActiveSubscription ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">بدون اشتراک فعال</div>
              <div className="text-xs text-muted-foreground">برای دسترسی به امکانات بیشتر ارتقاء دهید</div>
            </div>
            <Link href="/subscriptions">
              <Button size="sm" className="rounded-lg px-4">ارتقاء</Button>
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
