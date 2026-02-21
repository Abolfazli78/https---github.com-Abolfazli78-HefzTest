import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendOtpSms } from "@/lib/sms";
import { normalizePhone } from "@/lib/phone";

export type OtpPurpose = "REGISTER" | "LOGIN" | "RESET_PASSWORD";

const OTP_EXPIRY_MINUTES = 2;

export async function sendOtpCode(rawPhone: string, purpose: OtpPurpose) {
  const phone = normalizePhone(rawPhone);
  
  console.log("[OTP DEBUG] Starting OTP process for phone:", phone, "purpose:", purpose);
  
  const method = process.env.MELIPAYAMAK_OTP_METHOD || "dedicated";
  console.log("[OTP DEBUG] Method:", method);
  
  let otp: string;
  let smsResult: any;
  
  if (method === "shared") {
    // For shared method, generate code locally first
    otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("[OTP DEBUG] Generated local code for shared method:", otp);
    smsResult = await sendOtpSms(phone, otp, purpose);
  } else {
    // For dedicated method, call Melipayamak first to get the code
    smsResult = await sendOtpSms(phone, "", purpose);
    if (smsResult.ok && smsResult.code) {
      otp = smsResult.code;
    } else {
      // Fallback to local generation if Melipayamak fails
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("[OTP DEBUG] Fallback to local code:", otp);
    }
  }
  
  if (!smsResult.ok) {
    console.log("[OTP DEBUG] SMS failed:", smsResult.message);
    return { ok: false, message: smsResult.message || "ارسال پیامک ناموفق بود", statusCode: smsResult.statusCode };
  }

  console.log("[OTP DEBUG] Using OTP code:", otp, "from Melipayamak:", !!smsResult.code && !smsResult.mocked);
  
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

  console.log("[OTP DEBUG] OTP saved to database with expiry:", expiresAt);

  return { ok: true, message: smsResult.mocked ? "کد پیامک در لاگ ثبت شد" : "کد ارسال شد", statusCode: 200 };
}
