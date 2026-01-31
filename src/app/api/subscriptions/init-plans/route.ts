import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { createDefaultSubscriptionPlans } from "@/lib/subscription-manager";

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await createDefaultSubscriptionPlans();
    
    return NextResponse.json({ 
      success: true,
      message: "Default subscription plans initialized successfully" 
    });
  } catch (error) {
    console.error("Error initializing subscription plans:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد پلن‌های پیش‌فرض" },
      { status: 500 }
    );
  }
}
