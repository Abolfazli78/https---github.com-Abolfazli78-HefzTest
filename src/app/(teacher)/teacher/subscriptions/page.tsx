"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, CreditCard, Sparkles } from "lucide-react";
import { SubscriptionStatus } from "@/generated";
import { PaymentStatus } from "@/components/payment/payment-status";

type PlanTargetRole = "STUDENT" | "TEACHER" | "INSTITUTE";

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  features?: string;
  targetRole?: PlanTargetRole;
  maxQuestionsPerMonth?: number;
  maxExamsPerMonth?: number;
  maxStudentsAllowed?: number;
  maxClassesAllowed?: number;
}

interface UserSubscription {
  id: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  plan: SubscriptionPlan;
}

const featureLabelMap: Record<string, string> = {
  ticket_support: "تیکت ها",
  exam_creation: "امکان ساخت آزمون",
  student_management: "مدیریت دانش‌آموزان",
  advanced_analytics: "تحلیل پیشرفته",
  custom_questions: "سوالات دلخواه",
  priority_support: "پشتیبانی اولویت‌دار",
  export_data: "خروجی داده‌ها",
  advanced_reports: "گزارشات پیشرفته",
};

function formatFeature(feature: string) {
  return featureLabelMap[feature] ?? feature;
}

function isUnlimited(v?: number) {
  return !v || v <= 0;
}

export default function TeacherSubscriptionsPage() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [plansRes, subscriptionRes] = await Promise.all([
        fetch("/api/subscriptions/plans?targetRole=TEACHER"),
        fetch("/api/subscriptions/current"),
      ]);

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }

      if (subscriptionRes.ok) {
        const subData = await subscriptionRes.json();
        setUserSubscription(subData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!session?.user?.id) {
      setDiscountError("لطفاً ابتدا وارد شوید");
      return;
    }

    try {
      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          discountCode: discountCode || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          setDiscountError("خطا در ایجاد درخواست پرداخت");
        }
      } else {
        const error = await response.json();
        setDiscountError(error.error || "خطا در خرید اشتراک");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setDiscountError("خطا در خرید اشتراک");
    }
  };

  const getStatusLabel = (status: SubscriptionStatus) => {
    const labels = {
      ACTIVE: "فعال",
      EXPIRED: "منقضی شده",
      CANCELLED: "لغو شده",
      PENDING: "در انتظار",
    };
    return labels[status];
  };

  const now = useMemo(() => new Date(), []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2">اشتراک‌های پنل معلم</h1>
          <p className="text-muted-foreground">پلن مناسب خود را انتخاب کنید و ارتقاء دهید</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          اشتراک‌ها فقط برای نقش معلم نمایش داده می‌شوند
        </div>
      </div>

      <PaymentStatus />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">کد تخفیف</CardTitle>
          <CardDescription>در صورت داشتن کد تخفیف، اینجا وارد کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="کد تخفیف"
              value={discountCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDiscountCode(e.target.value);
                setDiscountError("");
              }}
              className="flex-1"
              dir="ltr"
            />
            <Button
              variant="outline"
              onClick={() => {
                setDiscountCode("");
                setDiscountError("");
              }}
            >
              حذف
            </Button>
          </div>
          {discountError && (
            <p className="text-sm text-red-500 mt-2">{discountError}</p>
          )}
        </CardContent>
      </Card>

      {userSubscription && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              اشتراک فعلی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-black text-lg">{userSubscription.plan.name}</p>
                <p className="text-sm text-muted-foreground">
                  {userSubscription.endDate
                    ? `تا ${new Date(userSubscription.endDate).toLocaleDateString("fa-IR")}`
                    : "بدون محدودیت"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="default">{getStatusLabel(userSubscription.status)}</Badge>
                {userSubscription.endDate && (
                  <Badge variant="outline" className="font-bold">
                    {Math.max(
                      0,
                      Math.ceil(
                        (new Date(userSubscription.endDate).getTime() - now.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )}
                    {" "}
                    روز باقی‌مانده
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const features = plan.features ? JSON.parse(plan.features) : [];
          const isCurrentPlan = userSubscription?.plan.id === plan.id;
          const isUpgrade = userSubscription && !isCurrentPlan && plan.price > userSubscription.plan.price;

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${isCurrentPlan ? "border-primary border-2" : ""}`}
            >
              {isCurrentPlan && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary">
                    <Crown className="h-3 w-3 ml-1" />
                    فعال
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-black">{plan.price.toLocaleString("fa-IR")}</span>
                  <span className="text-muted-foreground"> تومان</span>
                  <p className="text-sm text-muted-foreground mt-1">برای {plan.duration} روز</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm font-bold mb-2">سهمیه‌ها</div>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>آزمون در ماه</span>
                      <span className="font-bold text-foreground">{isUnlimited(plan.maxExamsPerMonth) ? "نامحدود" : plan.maxExamsPerMonth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>سوال در ماه</span>
                      <span className="font-bold text-foreground">{isUnlimited(plan.maxQuestionsPerMonth) ? "نامحدود" : plan.maxQuestionsPerMonth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>دانش‌آموزان</span>
                      <span className="font-bold text-foreground">{isUnlimited(plan.maxStudentsAllowed) ? "نامحدود" : plan.maxStudentsAllowed}</span>
                    </div>
                    {plan.maxClassesAllowed !== undefined && (
                      <div className="flex items-center justify-between">
                        <span>کلاس‌ها</span>
                        <span className="font-bold text-foreground">{isUnlimited(plan.maxClassesAllowed) ? "نامحدود" : plan.maxClassesAllowed}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold mb-2">ویژگی‌ها</div>
                  <ul className="space-y-2">
                    {features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{formatFeature(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : "default"}
                  disabled={isCurrentPlan && !isUpgrade}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {isCurrentPlan ? "اشتراک فعلی" : isUpgrade ? "ارتقاء پلن" : "خرید اشتراک"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
