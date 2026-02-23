import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const { phone, role } = body as { phone?: string; role?: "STUDENT" | "TEACHER" };

    if (!phone || !role) {
      return NextResponse.json({ error: "شماره موبایل و نقش الزامی است" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(String(phone));

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { phone: normalizedPhone } });
    if (!existingUser) {
      return NextResponse.json({ error: "کاربری با این شماره موبایل ثبت‌نام نکرده است" }, { status: 400 });
    }

    // Check duplicate invitation
    const existingInvitation = await db.invitation.findFirst({
      where: { phone: normalizedPhone, status: "PENDING" },
    });
    if (existingInvitation) {
      return NextResponse.json({ error: "قبلاً برای این شماره دعوت ارسال شده است" }, { status: 400 });
    }

    // Create invitation
    const invitation = await db.invitation.create({
      data: {
        phone: normalizedPhone,
        role,
        senderId: session.user.id,
        receiverId: existingUser.id, // User already exists
      },
    });

    // Create notification for the invited user
    try {
      await createNotification({
        userId: existingUser.id,
        title: "دعوت به تیم",
        message: `شما برای پیوستن به تیم ${role === "TEACHER" ? "معلم" : "دانش‌آموز"} دعوت شدید. برای پذیرش یا رد دعوت به صفحه تیم خود مراجعه کنید.`,
        type: "INFO",
      });
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError);
      // Don't fail the invitation if notification fails
    }

    // Create notification for the inviter
    try {
      await createNotification({
        userId: session.user.id,
        title: "دعوت‌نامه ارسال شد",
        message: `دعوت‌نامه برای ${existingUser.name} (${role === "TEACHER" ? "معلم" : "دانش‌آموز"}) با شماره ${normalizedPhone} با موفقیت ارسال شد. منتظر تأیید کاربر باشید.`,
        type: "SUCCESS",
      });
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError);
      // Don't fail the invitation if notification fails
    }

    return NextResponse.json({ 
      message: "دعوت‌نامه با موفقیت ارسال شد", 
      invitationId: invitation.id,
      userName: existingUser.name
    });
  } catch (error) {
    console.error("Invitation POST error:", error);
    return NextResponse.json({ error: "خطا در ارسال دعوت" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const invitations = await db.invitation.findMany({
      where: { senderId: session.user.id },
      include: { receiver: { select: { id: true, name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Invitation GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت لیست دعوت‌ها" }, { status: 500 });
  }
}
