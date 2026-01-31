export interface SmsSendResult {
  ok: boolean;
  message?: string;
  mocked?: boolean;
}

export async function sendOtpSms(phone: string, otp: string, purpose: string): Promise<SmsSendResult> {
  const username = process.env.MELIPAYAMAK_USERNAME;
  const password = process.env.MELIPAYAMAK_PASSWORD;
  const sender = process.env.MELIPAYAMAK_SENDER;

  if (!username || !password || !sender) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[SMS MOCK] OTP for ${phone} (${purpose}): ${otp}`);
      return { ok: true, mocked: true, message: "SMS mock logged" };
    }
    return { ok: false, message: "SMS credentials not configured" };
  }

  // TODO: Replace with melipayamak API call when credentials are available.
  // Placeholder: return failure to avoid silent SMS drops in production.
  return { ok: false, message: "SMS provider not wired" };
}
