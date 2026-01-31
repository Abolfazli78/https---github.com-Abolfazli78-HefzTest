import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone, otp } = body;

    if (!name || !phone || !password || !otp) {
      return NextResponse.json(
        { error: "همه فیلدها الزامی است" },
        { status: 400 }
      );
    }

    const normalizedPhone = String(phone).trim();
    const normalizedEmail = email ? String(email).trim().toLowerCase() : null;

    // Check if user already exists
    const existingPhone = await db.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: "این شماره موبایل قبلاً استفاده شده است" },
        { status: 400 }
      );
    }

    if (normalizedEmail) {
      const existingEmail = await db.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "این ایمیل قبلاً استفاده شده است" },
          { status: 400 }
        );
      }
    }

    const otpRecord = await db.phoneOtp.findFirst({
      where: {
        phone: normalizedPhone,
        purpose: "REGISTER",
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "کد تأیید معتبر نیست" },
        { status: 400 }
      );
    }

    const isOtpValid = await bcrypt.compare(String(otp), otpRecord.codeHash);
    if (!isOtpValid) {
      return NextResponse.json(
        { error: "کد تأیید معتبر نیست" },
        { status: 400 }
      );
    }

    await db.phoneOtp.update({
      where: { id: otpRecord.id },
      data: { consumedAt: new Date() },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check for pending invitation
    const pendingInvite = await db.invitation.findFirst({
      where: {
        phone: normalizedPhone,
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
    });

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        role: role || "STUDENT",
        phoneVerifiedAt: new Date(),
        parentId: pendingInvite?.senderId || null,
        teacherId: pendingInvite?.role === "STUDENT" ? pendingInvite.senderId : null,
        instituteId: pendingInvite?.role === "TEACHER" ? pendingInvite.senderId : null,
      },
    });

    // If there was an invite, mark it as accepted
    if (pendingInvite) {
      await db.invitation.update({
        where: { id: pendingInvite.id },
        data: {
          status: "ACCEPTED",
          receiverId: user.id
        },
      });

      // Create notification for the inviter
      try {
        await createNotification({
          userId: pendingInvite.senderId,
          title: "دعوت‌نامه پذیرفته شد",
          message: `${name} (${role === "TEACHER" ? "معلم" : "دانش‌آموز"}) دعوت‌نامه شما را پذیرفت و به تیم شما پیوست.`,
          type: "SUCCESS",
        });
      } catch (notificationError) {
        console.error("Failed to create notification:", notificationError);
        // Don't fail the registration if notification fails
      }
    }

    return NextResponse.json(
      { message: "حساب کاربری با موفقیت ایجاد شد", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد حساب کاربری" },
      { status: 500 }
    );
  }
}

