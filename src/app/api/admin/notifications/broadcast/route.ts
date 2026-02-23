import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const { title, message, type = "INFO", recipientType = "ALL", userId } = body as {
      title?: string;
      message?: string;
      type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "DISCOUNT";
      recipientType?: "ALL" | "TEACHER" | "STUDENT" | "INSTITUTE" | "USER";
      userId?: string;
    };

    if (!title || !message) {
      return NextResponse.json({ error: "عنوان و متن اعلان الزامی است" }, { status: 400 });
    }

    if (recipientType === "USER" && !userId) {
      return NextResponse.json({ error: "انتخاب کاربر الزامی است" }, { status: 400 });
    }

    let users;

    if (recipientType === "USER") {
      // Send to specific user
      users = await db.user.findMany({
        where: {
          id: userId,
          isActive: true,
        },
        select: { id: true },
      });
    } else {
      // Send to users based on role
      const roleFilter = recipientType === "ALL" 
        ? { in: ["STUDENT" as const, "TEACHER" as const, "INSTITUTE" as const] }
        : recipientType as "TEACHER" | "STUDENT" | "INSTITUTE";

      users = await db.user.findMany({
        where: {
          isActive: true,
          role: roleFilter,
        },
        select: { id: true },
      });
    }

    // Create notifications for selected users
    const notifications = users.map((user) =>
      createNotification({
        userId: user.id,
        title,
        message,
        type,
      })
    );

    await Promise.all(notifications);

    return NextResponse.json({
      message: `اعلان برای ${users.length} کاربر ارسال شد`,
      userCount: users.length,
      recipientType,
    });
  } catch (error) {
    console.error("Broadcast notification error:", error);
    return NextResponse.json({ error: "خطا در ارسال اعلان" }, { status: 500 });
  }
}
