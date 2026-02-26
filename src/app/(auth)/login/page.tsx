"use client";

import { useEffect, useState } from "react";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInputSimple } from "@/components/ui/phone-input-simple";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
// import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const cb = searchParams.get("callbackUrl");
    if (cb && cb.includes("/login")) {
      router.replace("/login");
    }
  }, [searchParams, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone) {
      setError("شماره موبایل الزامی است");
      return;
    }

    if (mode === "password" && !password) {
      setError("رمز عبور الزامی است");
      return;
    }

    if (mode === "otp" && !otp) {
      setError("کد یکبار مصرف الزامی است");
      return;
    }

    setIsLoading(true);
    setError("");
    setInfo("");

    try {
      const submitData: { phone: string; password?: string; otp?: string } = { phone };

      if (mode === "password") {
        submitData.password = password;
      } else if (mode === "otp") {
        submitData.otp = otp;
      }

      const result = (await signIn("credentials", {
        ...submitData,
        redirect: false,
      })) as SignInResponse | undefined;

      if (result?.error) {
        setError("اطلاعات ورود صحیح نیست");
        setIsLoading(false);
      } else {
        const cb = searchParams.get("callbackUrl");
        const target = cb && !cb.includes("/login") ? cb : "/dashboard";
        router.push(target);
        router.refresh();
      }
    } catch {
      setError("خطا در ورود به سیستم");
      setIsLoading(false);
    }
  };

  const onSendOtp = async (phone: string) => {
    setIsLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "LOGIN" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ارسال کد ناموفق بود");
      } else {
        setInfo(data.message || "کد ارسال شد");
      }
    } catch {
      setError("خطا در ارسال کد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src="/logo.png" alt="تست حفظ" className="h-16 object-contain" width={64} height={64} />
          </div>
          <CardTitle className="text-3xl font-bold">ورود</CardTitle>
          <CardDescription className="text-base">
            اطلاعات خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {info && (
              <Alert>
                <AlertDescription>{info}</AlertDescription>
              </Alert>
            )}

            <PhoneInputSimple
              value={phone}
              onChange={setPhone}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant={mode === "password" ? "default" : "outline"}
                onClick={() => setMode("password")}
                className="flex-1"
              >
                ورود با رمز
              </Button>
              <Button
                type="button"
                variant={mode === "otp" ? "default" : "outline"}
                onClick={() => setMode("otp")}
                className="flex-1"
              >
                ورود با کد
              </Button>
            </div>

            {mode === "password" ? (
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="otp">کد یکبار مصرف</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="------"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSendOtp(phone)}
                  >
                    ارسال کد
                  </Button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "در حال ورود..." : "ورود"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">حساب کاربری ندارید؟ </span>
              <Link href="/register" className="text-accent hover:underline font-medium">
                ایجاد حساب جدید
              </Link>
            </div>
            <div className="text-center text-sm">
              <Link href="/forgot" className="text-accent hover:underline font-medium">
                فراموشی رمز عبور
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

