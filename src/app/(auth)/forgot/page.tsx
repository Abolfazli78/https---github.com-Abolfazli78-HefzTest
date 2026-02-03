"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const forgotSchema = z.object({
  phone: z.string().min(10, "شماره موبایل معتبر نیست"),
  otp: z.string().min(4, "کد یکبار مصرف را وارد کنید"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSendOtp = async (phone: string) => {
    setIsLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ارسال کد ناموفق بود");
      } else {
        setInfo(data.message || "کد ارسال شد");
        setCountdown(120);
      }
    } catch {
      setError("خطا در ارسال کد");
    } finally {
      setIsLoading(false);
    }
  };

  // countdown effect
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          otp: data.otp,
          password: data.password,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "بازیابی رمز عبور ناموفق بود");
        setIsLoading(false);
        return;
      }
      router.push("/login?reset=true");
    } catch {
      setError("خطا در بازیابی رمز عبور");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">بازیابی رمز عبور</CardTitle>
          <CardDescription className="text-base">
            کد یکبار مصرف را دریافت و رمز جدید را تنظیم کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="space-y-2">
              <Label htmlFor="phone">شماره موبایل</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09123456789"
                {...register("phone")}
                className="w-full"
                dir="ltr"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">کد یکبار مصرف</Label>
              <div className="flex gap-2">
                <Input
                  id="otp"
                  type="text"
                  placeholder="------"
                  {...register("otp")}
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onSendOtp((document.getElementById("phone") as HTMLInputElement)?.value || "")}
                  disabled={isLoading || countdown > 0}
                >
                  {countdown > 0 ? `${countdown} ثانیه` : "ارسال کد"}
                </Button>
              </div>
              {errors.otp && (
                <p className="text-sm text-red-500">{errors.otp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور جدید</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "در حال بروزرسانی..." : "تغییر رمز عبور"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">بازگشت به </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                ورود
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
