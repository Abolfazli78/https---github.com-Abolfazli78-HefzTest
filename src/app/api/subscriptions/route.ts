import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { SubscriptionStatus } from "@/generated";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "شناسه پلن الزامی است" },
        { status: 400 }
      );
    }

    const plan = await db.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: "پلن موجود نیست" },
        { status: 404 }
      );
    }

    // Check if user has active subscription
    const activeSubscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (activeSubscription) {
      return NextResponse.json(
        { error: "شما قبلاً اشتراک فعال دارید" },
        { status: 400 }
      );
    }

    // Create subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        status: SubscriptionStatus.PENDING,
        startDate,
        endDate,
      },
    });

    // Create payment record
    const payment = await db.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: plan.price,
        status: "PENDING",
      },
    });

    // In a real implementation, you would redirect to payment gateway
    // For now, we'll simulate successful payment
    // TODO: Integrate with payment gateway (e.g., Zarinpal, IDPay)

    // Simulate payment success (remove this in production)
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
      },
    });

    await db.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
      },
    });

    return NextResponse.json({
      message: "اشتراک با موفقیت فعال شد",
      subscription,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد اشتراک" },
      { status: 500 }
    );
  }
}

