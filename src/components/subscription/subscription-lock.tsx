"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SubscriptionLockProps {
  feature: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export function SubscriptionLock({
  feature,
  title = "قابلیت پرمیوم",
  description = "این قابلیت فقط برای کاربران با اشتراک فعال در دسترس است",
  icon = <Lock className="h-8 w-8" />,
  compact = false,
  className = ""
}: SubscriptionLockProps) {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.pathname + window.location.search);
  }, []);

  const subscriptionUrl = currentUrl ? `/subscriptions?redirect_url=${encodeURIComponent(currentUrl)}` : "/subscriptions";
  // Always show the lock - parent component will handle conditional rendering
  if (compact) {
    return (
      <Card className={`border-orange-200 bg-orange-50 ${className}`}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="text-orange-600">{icon}</div>
            <div>
              <p className="font-medium text-orange-900">{title}</p>
              <p className="text-sm text-orange-700">{description}</p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
            <Link href={subscriptionUrl}>
              ارتقاء اشتراک
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-orange-200 bg-orange-50 ${className}`}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            {icon}
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-orange-900">
            <Crown className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-orange-700">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {/* Current Status */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-orange-900">برای دسترسی به این قابلیت:</p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="destructive">نیاز به اشتراک فعال</Badge>
            </div>
          </div>

          {/* Feature Benefits */}
          <div className="space-y-3">
            <h4 className="font-medium text-orange-900">با ارتقاء اشتراک به این قابلیت‌ها دسترسی پیدا کنید:</h4>
            <div className="grid gap-2 text-sm text-orange-800">
              {feature === "custom_exams" && (
                <>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>ایجاد آزمون‌های دلخواه با تنظیمات پیشرفته</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>انتخاب محدوده دقیق سوالات از قرآن</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>تنظیم سطح دشواری و موضوعات دلخواه</span>
                  </div>
                </>
              )}
              {feature === "exam_creation" && (
                <>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>ایجاد آزمون‌های نامحدود</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>دسترسی به بانک سوالات کامل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>تحلیل نتایج پیشرفته</span>
                  </div>
                </>
              )}
              {feature === "student_management" && (
                <>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>مدیریت نامحدود دانش‌آموزان</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>پیگیری پیشرفت فردی دانش‌آموزان</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>گزارشات دقیق و تحلیلی</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="space-y-4">
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <Link href={subscriptionUrl}>
                <Crown className="mr-2 h-4 w-4" />
                مشاهده پلن‌های اشتراک
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
            
            <p className="text-xs text-orange-700">
              با ارتقاء اشتراک، به تمام قابلیت‌های پرمیوم دسترسی خواهید داشت
            </p>
          </div>
        </CardContent>
      </Card>
  );
}
