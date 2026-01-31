import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOtpCode } from "@/lib/otp";
import { normalizePhone } from "@/lib/phone";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body as { phone?: string };

    if (!phone) {
      return NextResponse.json({ error: "شماره موبایل الزامی است" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(String(phone));
    const user = await db.user.findUnique({ where: { phone: normalizedPhone } });
    if (!user) {
      return NextResponse.json({ error: "کاربری با این شماره یافت نشد" }, { status: 404 });
    }

    const result = await sendOtpCode(normalizedPhone, "RESET_PASSWORD");
    if (!result.ok) {
      return NextResponse.json({ error: result.message || "ارسال پیامک ناموفق بود" }, { status: 500 });
    }

    return NextResponse.json({ message: result.message || "کد ارسال شد" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "خطا در ارسال کد" }, { status: 500 });
  }
}
