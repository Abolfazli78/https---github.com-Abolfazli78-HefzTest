"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Crown, Zap, Users, GraduationCap, Building, Check, X, AlertCircle } from "lucide-react";
import { useSubscription, type SubscriptionInfo } from "@/hooks/use-subscription";
import { FEATURES } from "@/lib/subscription-middleware";

interface SubscriptionDashboardProps {
  showUpgradeButton?: boolean;
  compact?: boolean;
}

type QuotaKey = keyof SubscriptionInfo["quotas"];

type GetQuotaUsage = (quotaKey: QuotaKey) => {
  used: number;
  limit: number;
  percentage: number;
};

interface QuotaDisplayProps {
  quotaKey: QuotaKey;
  label: string;
  icon: React.ReactNode;
  getQuotaUsage: GetQuotaUsage;
  tier: SubscriptionInfo["tier"];
}

interface FeatureListProps {
  features: string[];
}

function QuotaDisplay({ quotaKey, label, icon, getQuotaUsage, tier }: QuotaDisplayProps) {
  const usage = getQuotaUsage(quotaKey);

  if (usage.limit === 0 && tier !== "STUDENT") return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-muted-foreground">
          {usage.limit === -1 ? "نامحدود" : `${usage.used} / ${usage.limit}`}
        </span>
      </div>
      {usage.limit > 0 && <Progress value={usage.percentage} className="h-2" />}
    </div>
  );
}

function FeatureList({ features }: FeatureListProps) {
  const featureTranslations: Record<string, string> = {
    [FEATURES.BASIC_EXAMS]: "آزمون‌های پایه",
    [FEATURES.PERFORMANCE_TRACKING]: "پیگیری عملکرد",
    [FEATURES.LEADERBOARD_ACCESS]: "دسترسی به رده‌بندی",
    [FEATURES.UNLIMITED_EXAMS]: "آزمون نامحدود",
    [FEATURES.ADVANCED_ANALYTICS]: "تحلیل‌های پیشرفته",
    [FEATURES.EXAM_CREATION]: "ایجاد آزمون",
    [FEATURES.STUDENT_MANAGEMENT]: "مدیریت دانش‌آموزان",
    [FEATURES.QUESTION_BANK_ACCESS]: "دسترسی به بانک سوالات",
    [FEATURES.CUSTOM_EXAMS]: "آزمون‌های سفارشی",
    [FEATURES.TICKET_SUPPORT]: "پشتیبانی تیکت",
    [FEATURES.CUSTOM_THEMES]: "پوسته‌های سفارشی",
    [FEATURES.TEACHER_MANAGEMENT]: "مدیریت معلمان",
    [FEATURES.WHITE_LABEL]: "برند سفید",
    [FEATURES.BULK_OPERATIONS]: "عملیات انبوه",
    [FEATURES.PRIORITY_SUPPORT]: "پشتیبانی اولویت‌دار",
    [FEATURES.UNLIMITED_EVERYTHING]: "همه چیز نامحدود",
    [FEATURES.DEDICATED_SUPPORT]: "پشتیبانی اختصاصی",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {features.map((feature) => (
        <div key={feature} className="flex items-center gap-2 text-sm">
          <Check className="h-3 w-3 text-green-500" />
          <span>{featureTranslations[feature] || feature}</span>
        </div>
      ))}
    </div>
  );
}

export function SubscriptionDashboard({ showUpgradeButton = true, compact = false }: SubscriptionDashboardProps) {
  const { subscriptionInfo, loading, error, upgradeSubscription, getQuotaUsage } = useSubscription();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            اشتراک
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !subscriptionInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            خطا در بارگذاری اشتراک
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "STUDENT":
        return <GraduationCap className="h-4 w-4" />;
      case "TEACHER":
        return <Users className="h-4 w-4" />;
      case "INSTITUTE":
        return <Building className="h-4 w-4" />;
      default:
        return <Crown className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "STUDENT":
        return "bg-blue-500";
      case "TEACHER":
        return "bg-purple-500";
      case "INSTITUTE":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getTierIcon(subscriptionInfo.tier)}
            اشتراک {subscriptionInfo.planName || `${subscriptionInfo.tier}`}
          </CardTitle>
          <Badge className={getTierColor(subscriptionInfo.tier)}>
            {subscriptionInfo.tier === "STUDENT" && "دانش‌آموز"}
            {subscriptionInfo.tier === "TEACHER" && "معلم"}
            {subscriptionInfo.tier === "INSTITUTE" && "موسسه"}
          </Badge>
        </div>
        <CardDescription>
          {subscriptionInfo.hasActiveSubscription 
            ? "اشتراک فعال شما" 
            : "شما اشتراک فعالی ندارید"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className={compact ? "space-y-4" : "space-y-6"}>
        {/* Status */}
        <div className="flex items-center gap-2">
          {subscriptionInfo.hasActiveSubscription ? (
            <>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">فعال</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-600">غیرفعال</span>
            </>
          )}
        </div>

        {/* Quotas */}
        {!compact && (
          <div className="space-y-4">
            <h4 className="font-medium">محدودیت‌های ماهانه</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuotaDisplay
                quotaKey="maxExamsPerMonth" 
                label="آزمون" 
                icon={<Zap className="h-4 w-4" />}
                getQuotaUsage={getQuotaUsage}
                tier={subscriptionInfo.tier}
              />
              <QuotaDisplay
                quotaKey="maxQuestionsPerMonth" 
                label="سوال" 
                icon={<AlertCircle className="h-4 w-4" />}
                getQuotaUsage={getQuotaUsage}
                tier={subscriptionInfo.tier}
              />
              {(subscriptionInfo.tier === "TEACHER" || subscriptionInfo.tier === "INSTITUTE") && (
                <QuotaDisplay
                  quotaKey="maxStudentsAllowed" 
                  label="دانش‌آموز" 
                  icon={<Users className="h-4 w-4" />}
                  getQuotaUsage={getQuotaUsage}
                  tier={subscriptionInfo.tier}
                />
              )}
              {subscriptionInfo.tier === "INSTITUTE" && (
                <QuotaDisplay
                  quotaKey="maxTeachersAllowed" 
                  label="معلم" 
                  icon={<GraduationCap className="h-4 w-4" />}
                  getQuotaUsage={getQuotaUsage}
                  tier={subscriptionInfo.tier}
                />
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {!compact && subscriptionInfo.features.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">قابلیت‌های فعال</h4>
            <FeatureList features={subscriptionInfo.features} />
          </div>
        )}

        {/* Upgrade Button */}
        {showUpgradeButton && !subscriptionInfo.hasActiveSubscription && (
          <Button asChild className="w-full">
            <a href="/subscriptions">ارتقاء اشتراک</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
