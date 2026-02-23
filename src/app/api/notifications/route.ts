import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserNotifications, getUnreadNotificationCount } from "@/lib/notifications";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const notifications = await getUserNotifications(session.user.id);
    const unreadCount = await getUnreadNotificationCount(session.user.id);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "خطا در دریافت اعلانات" }, { status: 500 });
  }
}
