import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendOtpSms } from "@/lib/sms";
import { normalizePhone } from "@/lib/phone";

export type OtpPurpose = "REGISTER" | "LOGIN" | "RESET_PASSWORD";

const OTP_EXPIRY_MINUTES = 2;

export async function sendOtpCode(rawPhone: string, purpose: OtpPurpose) {
  const phone = normalizePhone(rawPhone);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await db.phoneOtp.create({
    data: {
      phone,
      codeHash,
      purpose,
      expiresAt,
    },
  });

  const smsResult = await sendOtpSms(phone, otp, purpose);
  if (!smsResult.ok) {
    return { ok: false, message: smsResult.message || "ارسال پیامک ناموفق بود" };
  }

  return { ok: true, message: smsResult.mocked ? "کد پیامک در لاگ ثبت شد" : "کد ارسال شد" };
}
