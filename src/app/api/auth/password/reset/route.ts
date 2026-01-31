import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp, password } = body as { phone?: string; otp?: string; password?: string };

    if (!phone || !otp || !password) {
      return NextResponse.json({ error: "همه فیلدها الزامی است" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(String(phone));

    const record = await db.phoneOtp.findFirst({
      where: {
        phone: normalizedPhone,
        purpose: "RESET_PASSWORD",
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ error: "کد معتبر نیست" }, { status: 400 });
    }

    const isOtpValid = await bcrypt.compare(String(otp), record.codeHash);
    if (!isOtpValid) {
      return NextResponse.json({ error: "کد معتبر نیست" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { phone: normalizedPhone } });
    if (!user) {
      return NextResponse.json({ error: "کاربری با این شماره یافت نشد" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.$transaction([
      db.phoneOtp.update({
        where: { id: record.id },
        data: { consumedAt: new Date() },
      }),
      db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
    ]);

    return NextResponse.json({ message: "رمز عبور بروزرسانی شد" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "خطا در بازیابی رمز" }, { status: 500 });
  }
}
