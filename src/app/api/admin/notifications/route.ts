import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    // Get recent notifications with user info
    const notifications = await db.notification.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Calculate stats
    const stats = {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      byType: notifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json({
      notifications,
      stats,
    });
  } catch (error) {
    console.error("Get admin notifications error:", error);
    return NextResponse.json({ error: "خطا در دریافت اعلانات" }, { status: 500 });
  }
}
