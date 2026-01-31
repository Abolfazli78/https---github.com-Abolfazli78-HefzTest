import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp, purpose } = body as { phone?: string; otp?: string; purpose?: "REGISTER" | "LOGIN" | "RESET_PASSWORD" };

    if (!phone || !otp || !purpose) {
      return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(String(phone));

    const record = await db.phoneOtp.findFirst({
      where: {
        phone: normalizedPhone,
        purpose,
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

    await db.phoneOtp.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });

    return NextResponse.json({ message: "کد تأیید شد" });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: "خطا در بررسی کد" }, { status: 500 });
  }
}
