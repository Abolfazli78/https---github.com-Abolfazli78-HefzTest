import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { getUserSubscriptionInfo, checkFeatureAccess } from "@/lib/subscription-manager";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptionInfo = await getUserSubscriptionInfo(session.user.id);
    
    return NextResponse.json(subscriptionInfo);
  } catch (error) {
    console.error("Error fetching subscription info:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات اشتراک" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { feature, requestedQuota } = await request.json();
    
    if (!feature) {
      return NextResponse.json(
        { error: "Feature name is required" },
        { status: 400 }
      );
    }

    const accessCheck = await checkFeatureAccess(
      session.user.id,
      feature,
      requestedQuota
    );

    return NextResponse.json(accessCheck);
  } catch (error) {
    console.error("Error checking feature access:", error);
    return NextResponse.json(
      { error: "خطا در بررسی دسترسی" },
      { status: 500 }
    );
  }
}
