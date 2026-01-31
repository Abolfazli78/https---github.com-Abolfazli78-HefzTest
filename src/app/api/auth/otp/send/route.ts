import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOtpCode, type OtpPurpose } from "@/lib/otp";
import { normalizePhone } from "@/lib/phone";

const allowedPurposes: OtpPurpose[] = ["REGISTER", "LOGIN", "RESET_PASSWORD"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, purpose } = body as { phone?: string; purpose?: OtpPurpose };

    if (!phone || !purpose || !allowedPurposes.includes(purpose)) {
      return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(String(phone));

    if (purpose === "LOGIN" || purpose === "RESET_PASSWORD") {
      const user = await db.user.findUnique({ where: { phone: normalizedPhone } });
      if (!user) {
        return NextResponse.json({ error: "کاربری با این شماره یافت نشد" }, { status: 404 });
      }
    }

    if (purpose === "REGISTER") {
      const existing = await db.user.findUnique({ where: { phone: normalizedPhone } });
      if (existing) {
        return NextResponse.json({ error: "این شماره موبایل قبلاً استفاده شده است" }, { status: 400 });
      }
    }

    const result = await sendOtpCode(normalizedPhone, purpose);
    if (!result.ok) {
      return NextResponse.json({ error: result.message || "ارسال پیامک ناموفق بود" }, { status: 500 });
    }

    return NextResponse.json({ message: result.message || "کد ارسال شد" });
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: "خطا در ارسال کد" }, { status: 500 });
  }
}
