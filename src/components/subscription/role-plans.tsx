"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Users, GraduationCap, Building, Star } from "lucide-react";
import { useSession } from "next-auth/react";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  targetRole: string;
  features: string[];
  maxExamsPerMonth: number;
  maxQuestionsPerMonth: number;
  maxStudentsAllowed: number;
  maxTeachersAllowed: number;
  maxClassesAllowed: number;
}

interface RolePlansProps {
  currentRole?: string;
  onUpgrade?: (planId: string) => void;
  currentSubscription?: any;
}

export function RolePlans({ currentRole, onUpgrade, currentSubscription }: RolePlansProps) {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Only show plans for the current user's role - no role switching
  const userRole = currentRole || session?.user?.role || "STUDENT";

  useEffect(() => {
    fetchPlans();
  }, [userRole]);

  const fetchPlans = async () => {
    try {
      console.log('Fetching plans for role:', userRole);
      const response = await fetch(`/api/subscriptions/plans?targetRole=${userRole}`);
      if (!response.ok) throw new Error("Failed to fetch plans");
      const data = await response.json();
      console.log('Received plans:', data);
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "STUDENT":
        return <GraduationCap className="h-5 w-5" />;
      case "TEACHER":
        return <Users className="h-5 w-5" />;
      case "INSTITUTE":
        return <Building className="h-5 w-5" />;
      default:
        return <Crown className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "STUDENT":
        return "border-blue-500 bg-blue-50";
      case "TEACHER":
        return "border-purple-500 bg-purple-50";
      case "INSTITUTE":
        return "border-orange-500 bg-orange-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return `${price.toLocaleString("fa-IR")} تومان`;
  };

  const formatLimit = (limit: number) => {
    if (limit <= 0) return "نامحدود";
    return limit.toLocaleString("fa-IR");
  };

  const PlanCard = ({ plan, isPopular = false }: { plan: Plan; isPopular?: boolean }) => {
    const features = plan.features && typeof plan.features === 'string' ? JSON.parse(plan.features) : [];
    
    return (
      <Card className={`relative ${isPopular ? "border-2 border-primary" : ""}`}>
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">
              <Star className="h-3 w-3 ml-1" />
              محبوب‌ترین
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-4">
            <div className="text-3xl font-bold">
              {formatPrice(plan.price)}
            </div>
            <div className="text-sm text-muted-foreground">
              هر {plan.duration} روز
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quotas */}
          <div className="space-y-3">
            <h4 className="font-medium">محدودیت‌ها</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>آزمون در ماه</span>
                <span className="font-medium">{formatLimit(plan.maxExamsPerMonth)}</span>
              </div>
              <div className="flex justify-between">
                <span>سوال در ماه</span>
                <span className="font-medium">{formatLimit(plan.maxQuestionsPerMonth)}</span>
              </div>
              {plan.maxStudentsAllowed > 0 && (
                <div className="flex justify-between">
                  <span>دانش‌آموز</span>
                  <span className="font-medium">{formatLimit(plan.maxStudentsAllowed)}</span>
                </div>
              )}
              {plan.maxTeachersAllowed > 0 && (
                <div className="flex justify-between">
                  <span>معلم</span>
                  <span className="font-medium">{formatLimit(plan.maxTeachersAllowed)}</span>
                </div>
              )}
              {plan.maxClassesAllowed > 0 && (
                <div className="flex justify-between">
                  <span>کلاس</span>
                  <span className="font-medium">{formatLimit(plan.maxClassesAllowed)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">قابلیت‌ها</h4>
              <div className="space-y-2">
                {features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calculate button state */}
          {(() => {
            const isCurrentPlan = currentSubscription?.plan?.id === plan.id;
            const isUpgrade = currentSubscription && !isCurrentPlan && plan.price > currentSubscription.plan.price;
            const isDowngrade = currentSubscription && !isCurrentPlan && plan.price < currentSubscription.plan.price;
            
            return (
              <Button 
                className="w-full" 
                onClick={() => onUpgrade?.(plan.id)}
                disabled={!session || isCurrentPlan}
                variant={isCurrentPlan ? "outline" : "default"}
              >
                {isCurrentPlan ? "اشتراک فعلی" : isUpgrade ? "ارتقاء پلن" : isDowngrade ? "تغییر پلن" : "انتخاب پلن"}
              </Button>
            );
          })()}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Role Header */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getRoleColor(userRole)}`}>
          {getRoleIcon(userRole)}
          <span className="font-medium">
            {userRole === "STUDENT" && "پلن‌های دانش‌آموز"}
            {userRole === "TEACHER" && "پلن‌های معلم"}
            {userRole === "INSTITUTE" && "پلن‌های موسسه"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          فقط پلن‌های مربوط به نقش شما نمایش داده می‌شود
        </p>
      </div>

      {/* Plans Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse">در حال بارگذاری پلن‌ها...</div>
          </div>
        ) : (
          <>
            {plans.length > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {plans.length} پلن برای نقش شما موجود است
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  isPopular={index === 1} // Middle plan is popular
                />
              ))}
            </div>
          </>
        )}
      </div>

      {plans.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">پلنی برای این نقش یافت نشد</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
