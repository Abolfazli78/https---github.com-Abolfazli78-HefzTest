import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { upgradeSubscription } from "@/lib/subscription-manager";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await request.json();
    
    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const subscription = await upgradeSubscription(session.user.id, planId);
    
    return NextResponse.json({
      success: true,
      subscription,
      message: "Subscription upgraded successfully"
    });
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "خطا در ارتقاء اشتراک" },
      { status: 500 }
    );
  }
}
