import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOtpCode, type OtpPurpose } from "@/lib/otp";
import { normalizePhone } from "@/lib/phone";

const allowedPurposes: OtpPurpose[] = ["REGISTER", "LOGIN", "RESET_PASSWORD"];

// Rate limiting: max 3 OTP requests per phone number per 5 minutes
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_REQUESTS_PER_WINDOW = 3;

async function checkRateLimit(phone: string): Promise<{ allowed: boolean; message?: string }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW);

  const recentAttempts = await db.phoneOtp.count({
    where: {
      phone,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  if (recentAttempts >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      message: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً پس از ۵ دقیقه مجدداً تلاش کنید.",
    };
  }

  return { allowed: true };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, purpose } = body as { phone?: string; purpose?: OtpPurpose };

    console.log("[API DEBUG] Received OTP request:", { phone, purpose });

    if (!phone || !purpose || !allowedPurposes.includes(purpose)) {
      console.log("[API DEBUG] Invalid request:", { phone: !!phone, purpose, allowedPurposes });
      return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(String(phone));
    console.log("[API DEBUG] Normalized phone:", normalizedPhone);

    // Check rate limiting
    const rateLimitResult = await checkRateLimit(normalizedPhone);
    if (!rateLimitResult.allowed) {
      console.log("[API DEBUG] Rate limited:", rateLimitResult.message);
      return NextResponse.json({ error: rateLimitResult.message }, { status: 429 });
    }

    if (purpose === "LOGIN" || purpose === "RESET_PASSWORD") {
      const user = await db.user.findUnique({ where: { phone: normalizedPhone } });
      if (!user) {
        console.log("[API DEBUG] User not found for phone:", normalizedPhone);
        return NextResponse.json({ error: "کاربری با این شماره یافت نشد" }, { status: 404 });
      }
    }

    if (purpose === "REGISTER") {
      const existing = await db.user.findUnique({ where: { phone: normalizedPhone } });
      if (existing) {
        console.log("[API DEBUG] User already exists for phone:", normalizedPhone);
        return NextResponse.json({ error: "این شماره موبایل قبلاً استفاده شده است" }, { status: 400 });
      }
    }

    console.log("[API DEBUG] Calling sendOtpCode...");
    const result = await sendOtpCode(normalizedPhone, purpose);
    console.log("[API DEBUG] sendOtpCode result:", result);
    
    if (!result.ok) {
      // Propagate provider status (e.g., 400/401/429) instead of generic 500
      const status = (result as any).statusCode || 500;
      return NextResponse.json({ error: result.message || "ارسال پیامک ناموفق بود" }, { status });
    }

    return NextResponse.json({ message: result.message || "کد ارسال شد" }, { status: (result as any).statusCode || 200 });
  } catch (error) {
    console.error("[API DEBUG] OTP send error:", error);
    return NextResponse.json({ error: "خطا در ارسال کد" }, { status: 500 });
  }
}
