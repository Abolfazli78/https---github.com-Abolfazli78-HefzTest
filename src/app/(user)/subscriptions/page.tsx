"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, CreditCard, Sparkles } from "lucide-react";
import { SubscriptionStatus } from "@/generated";
import { PaymentStatus } from "@/components/payment/payment-status";
import { RolePlans } from "@/components/subscription/role-plans";
import { useSubscription } from "@/hooks/use-subscription";

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  features?: string;
  targetRole?: string;
  maxQuestionsPerMonth?: number;
  maxStudentsAllowed?: number;
  maxExamsPerMonth?: number;
  maxTeachersAllowed?: number;
  maxClassesAllowed?: number;
}

interface UserSubscription {
  id: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  plan: SubscriptionPlan;
}

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const { subscriptionInfo, upgradeSubscription, loading } = useSubscription();
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");

  const getStatusLabel = (status: SubscriptionStatus) => {
    const labels = {
      ACTIVE: "فعال",
      EXPIRED: "منقضی شده",
      CANCELLED: "لغو شده",
      PENDING: "در انتظار",
    };
    return labels[status];
  };

  const handleSubscribe = async (planId: string) => {
    if (!session?.user?.id) {
      alert("لطفاً ابتدا وارد شوید");
      return;
    }

    // If user has active subscription, use upgrade API
    if (subscriptionInfo?.hasActiveSubscription) {
      try {
        await upgradeSubscription(planId);
        alert("اشتراک شما با موفقیت ارتقاء یافت!");
        // The hook will automatically refresh the subscription info
      } catch (error) {
        console.error("Upgrade error:", error);
        alert(error instanceof Error ? error.message : "خطا در ارتقاء اشتراک");
      }
      return;
    }

    // For new subscriptions, use payment API
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
          // Redirect to ZarinPal payment gateway
          window.location.href = data.url;
        } else {
          alert("خطا در ایجاد درخواست پرداخت");
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

  const handleUpgrade = async (planId: string) => {
    try {
      await upgradeSubscription(planId);
    } catch (error) {
      console.error("Upgrade error:", error);
      alert(error instanceof Error ? error.message : "خطا در ارتقاء اشتراک");
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-black mb-2">اشتراک‌ها</h1>
          <p className="text-muted-foreground">انتخاب و خرید اشتراک</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          پلن‌ها مطابق نقش کاربری شما نمایش داده می‌شوند
        </div>
      </div>

      <PaymentStatus />

      {/* Current Subscription */}
      {subscriptionInfo?.hasActiveSubscription && (
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
                <p className="font-black text-lg">{subscriptionInfo.planName || "پلن فعلی"}</p>
                <p className="text-sm text-muted-foreground">
                  {subscriptionInfo.subscription?.endDate
                    ? `تا ${new Date(subscriptionInfo.subscription.endDate).toLocaleDateString("fa-IR")}`
                    : "بدون محدودیت"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">{getStatusLabel(subscriptionInfo.subscription?.status as SubscriptionStatus || "ACTIVE")}</Badge>
                <Button variant="outline" size="sm">
                  ارتقاء
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discount Code */}
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

      {/* Role-Based Plans */}
      <RolePlans 
        currentRole={session?.user?.role}
        onUpgrade={handleSubscribe}
        currentSubscription={subscriptionInfo?.subscription}
      />
    </div>
  );
}

