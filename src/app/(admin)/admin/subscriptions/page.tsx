import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubscriptionPlansTable } from "@/components/admin/subscription-plans-table";
import { SubscriptionsTable } from "@/components/admin/subscriptions-table";

export default async function SubscriptionsPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const plansData = await db.subscriptionPlan.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Transform null to undefined for the component
  const plans = plansData.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description ?? undefined,
    price: plan.price,
    duration: plan.duration,
    targetRole: plan.targetRole,
    isActive: plan.isActive,
    createdAt: plan.createdAt,
  }));

  const subscriptionsData = await db.subscription.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      plan: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  // Transform null to undefined for the component
  const subscriptions = subscriptionsData.map((sub) => ({
    id: sub.id,
    status: sub.status,
    startDate: sub.startDate,
    endDate: sub.endDate ?? undefined,
    autoRenew: sub.autoRenew,
    user: {
      ...sub.user,
      email: sub.user.email ?? "",
    },
    plan: {
      name: sub.plan.name,
      price: sub.plan.price,
    },
    createdAt: sub.createdAt,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">مدیریت اشتراک‌ها</h1>
          <p className="text-muted-foreground">مدیریت پلن‌ها و اشتراک‌های کاربران</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/subscriptions/manage">
            <Button variant="outline">مدیریت حرفه‌ای اشتراک‌ها</Button>
          </Link>
          <Link href="/admin/subscriptions/new">
            <Button>ایجاد پلن جدید</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>پلن‌های اشتراک</CardTitle>
            <CardDescription>
              مدیریت پلن‌های اشتراک
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionPlansTable plans={plans} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>اشتراک‌های فعال</CardTitle>
            <CardDescription>
              لیست اشتراک‌های کاربران
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionsTable subscriptions={subscriptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

