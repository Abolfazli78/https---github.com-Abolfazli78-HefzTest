"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User as UserIcon, GraduationCap, School, Mail, Lock, User, Phone, CheckCircle, Sparkles, Zap } from "lucide-react";
// import Image from "next/image";
import { PhoneInputSimple } from "@/components/ui/phone-input-simple";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  phone: z.string().min(10, "شماره موبایل معتبر نیست"),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  confirmPassword: z.string(),
  otp: z.string().min(4, "کد ارسال شده را وارد کنید"),
  role: z.enum(["STUDENT", "TEACHER", "INSTITUTE"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمزهای عبور مطابقت ندارند",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
    },
    mode: "onChange",
  });

  const selectedRole = watch("role");
  const watchedPhone = watch("phone");

  // Handle countdown timer with proper cleanup
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown]);

  // Update phone in form when phone input changes
  const handlePhoneChange = (phone: string) => {
    setValue("phone", phone);
    trigger("phone");
  };

  const onSubmit = async (data: RegisterForm) => {
    if (!isValid) {
      setError("لطفاً تمام فیلدهای الزامی را درست وارد کنید");
      return;
    }

    setIsLoading(true);
    setError("");
    setInfo("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          password: data.password,
          otp: data.otp,
          role: data.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "خطا در ایجاد حساب کاربری");
      } else {
        router.push("/login?registered=true");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("خطا در ایجاد حساب کاربری");
    } finally {
      setIsLoading(false);
    }
  };

  const onSendOtp = async () => {
    const phone = watchedPhone;
    
    if (!phone || phone.length < 10) {
      setError("شماره موبایل معتبر نیست");
      return;
    }

    // Validate phone before sending OTP
    const isPhoneValid = await trigger("phone");
    if (!isPhoneValid) {
      setError("شماره موبایل معتبر نیست");
      return;
    }

    setIsLoading(true);
    setError("");
    setInfo("");
    
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "REGISTER" }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "ارسال کد ناموفق بود");
      } else {
        setInfo(data.message || "کد با موفقیت ارسال شد");
        setIsOtpSent(true);
        setCountdown(120);
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("OTP send error:", error);
      setError("خطا در ارسال کد");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is ready for submission
  const canSubmit = isValid && watchedPhone && isOtpSent;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[520px] h-[520px] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />
        <div
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(60% 60% at 70% 20%, rgba(13,61,56,0.18), transparent 60%), radial-gradient(50% 50% at 20% 80%, rgba(16,185,129,0.14), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(2,6,23,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.045)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-[480px]"
        >
          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border-0 ring-1 ring-slate-200/70 dark:ring-slate-800 shadow-[0_20px_60px_rgba(2,6,23,0.10)] rounded-2xl overflow-hidden">
            <CardHeader className="p-8 sm:p-10 pb-6 text-center">
              <div className="mx-auto size-16 rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200/70 dark:ring-slate-800 shadow-sm flex items-center justify-center">
                <img src="/logo.png" alt="تست حفظ" className="h-14 object-contain" />
              </div>

              <div className="mt-5 space-y-2">
                <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                  ساخت حساب کاربری
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  ثبت‌نام سریع و امن، با تایید شماره موبایل
                </CardDescription>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                <div
                  className={cn(
                    "h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors",
                    currentStep >= 1
                      ? "bg-primary/5 text-primary ring-1 ring-primary/15"
                      : "bg-muted text-muted-foreground ring-1 ring-border"
                  )}
                >
                  <span className="size-5 rounded-full bg-white dark:bg-slate-900 ring-1 ring-border flex items-center justify-center text-[11px] font-bold">
                    {currentStep > 1 ? <CheckCircle className="size-3.5 text-accent" /> : "۱"}
                  </span>
                  اطلاعات
                </div>
                <div className="h-px w-8 bg-slate-200 dark:bg-slate-800" />
                <div
                  className={cn(
                    "h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors",
                    currentStep >= 2
                      ? "bg-primary/5 text-primary ring-1 ring-primary/15"
                      : "bg-muted text-muted-foreground ring-1 ring-border"
                  )}
                >
                  <span className="size-5 rounded-full bg-white dark:bg-slate-900 ring-1 ring-border flex items-center justify-center text-[11px] font-bold">
                    {currentStep > 2 ? <CheckCircle className="size-3.5 text-accent" /> : "۲"}
                  </span>
                  تایید
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 sm:px-10 pb-8 sm:pb-10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert className="border-destructive/20 bg-destructive/5 text-foreground">
                        <AlertDescription className="text-destructive/90">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                  {info && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert className="border-accent/20 bg-accent/5 text-foreground">
                        <AlertDescription className="text-primary">
                          {info}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.25, ease: "easeOut" }}
                  className="space-y-3"
                >
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    نوع حساب
                  </div>
                  <RadioGroup
                    value={selectedRole}
                    onValueChange={(value) =>
                      setValue("role", value as "STUDENT" | "TEACHER" | "INSTITUTE")
                    }
                    className="grid grid-cols-3 gap-2 rounded-xl bg-muted/60 p-2 ring-1 ring-border"
                  >
                    {[
                      { value: "STUDENT", icon: UserIcon, label: "دانش‌آموز" },
                      { value: "TEACHER", icon: GraduationCap, label: "معلم" },
                      { value: "INSTITUTE", icon: School, label: "موسسه" },
                    ].map((role) => (
                      <div key={role.value}>
                        <RadioGroupItem value={role.value} id={role.value} className="peer sr-only" />
                        <Label
                          htmlFor={role.value}
                          className={cn(
                            "h-10 rounded-lg px-3 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200",
                            "text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground",
                            "peer-data-[state=checked]:bg-white dark:peer-data-[state=checked]:bg-slate-900 peer-data-[state=checked]:text-primary",
                            "peer-data-[state=checked]:shadow-sm peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary/15"
                          )}
                        >
                          <role.icon className="size-4" />
                          {role.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.role && (
                    <div className="text-xs text-destructive/90">
                      {errors.role.message}
                    </div>
                  )}
                </motion.div>

                <div className="h-px bg-slate-200/70 dark:bg-slate-800/80" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.25, ease: "easeOut" }}
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder=" "
                      aria-invalid={!!errors.name}
                      {...register("name")}
                      className={cn(
                        "peer h-12 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur border-border",
                        "pr-10 text-foreground placeholder:text-transparent",
                        "focus-visible:ring-accent/20 focus-visible:border-accent",
                        !errors.name && "aria-[invalid=false]:border-border"
                      )}
                    />
                    <User className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Label
                      htmlFor="name"
                      className={cn(
                        "pointer-events-none absolute right-10 transition-all duration-200",
                        "text-slate-500 peer-focus:text-primary",
                        "top-1/2 -translate-y-1/2 text-sm peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs",
                        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
                        "peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-xs"
                      )}
                    >
                      نام کامل
                    </Label>
                    {errors.name && (
                      <div className="mt-1 text-xs text-destructive/90">
                        {errors.name.message}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder=" "
                      aria-invalid={!!errors.email}
                      {...register("email")}
                      className={cn(
                        "peer h-12 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur border-border",
                        "pr-10 text-foreground placeholder:text-transparent",
                        "focus-visible:ring-accent/20 focus-visible:border-accent"
                      )}
                      dir="ltr"
                    />
                    <Mail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Label
                      htmlFor="email"
                      className={cn(
                        "pointer-events-none absolute right-10 transition-all duration-200",
                        "text-slate-500 peer-focus:text-primary",
                        "top-1/2 -translate-y-1/2 text-sm peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs",
                        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
                        "peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-xs"
                      )}
                    >
                      ایمیل (اختیاری)
                    </Label>
                    {errors.email && (
                      <div className="mt-1 text-xs text-destructive/90">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Phone className="size-4 text-slate-400" />
                      شماره موبایل
                    </div>
                    <PhoneInputSimple value={watchedPhone || ""} onChange={handlePhoneChange} showCountrySelect={false} label="" />
                    <input type="hidden" {...register("phone")} />
                    {errors.phone && (
                      <div className="text-xs text-destructive/90">
                        {errors.phone.message}
                      </div>
                    )}
                  </div>
                </motion.div>

                <div className="h-px bg-slate-200/70 dark:bg-slate-800/80" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.25, ease: "easeOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder=" "
                      aria-invalid={!!errors.password}
                      {...register("password")}
                      className={cn(
                        "peer h-12 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur border-border",
                        "pr-10 text-foreground placeholder:text-transparent",
                        "focus-visible:ring-accent/20 focus-visible:border-accent"
                      )}
                    />
                    <Lock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Label
                      htmlFor="password"
                      className={cn(
                        "pointer-events-none absolute right-10 transition-all duration-200",
                        "text-slate-500 peer-focus:text-primary",
                        "top-1/2 -translate-y-1/2 text-sm peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs",
                        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
                        "peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-xs"
                      )}
                    >
                      رمز عبور
                    </Label>
                    {errors.password && (
                      <div className="mt-1 text-xs text-destructive/90">
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder=" "
                      aria-invalid={!!errors.confirmPassword}
                      {...register("confirmPassword")}
                      className={cn(
                        "peer h-12 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur border-border",
                        "pr-10 text-foreground placeholder:text-transparent",
                        "focus-visible:ring-accent/20 focus-visible:border-accent"
                      )}
                    />
                    <Lock className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Label
                      htmlFor="confirmPassword"
                      className={cn(
                        "pointer-events-none absolute right-10 transition-all duration-200",
                        "text-slate-500 peer-focus:text-primary",
                        "top-1/2 -translate-y-1/2 text-sm peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs",
                        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm",
                        "peer-[&:not(:placeholder-shown)]:top-3 peer-[&:not(:placeholder-shown)]:-translate-y-0 peer-[&:not(:placeholder-shown)]:text-xs"
                      )}
                    >
                      تکرار رمز
                    </Label>
                    {errors.confirmPassword && (
                      <div className="mt-1 text-xs text-destructive/90">
                        {errors.confirmPassword.message}
                      </div>
                    )}
                  </div>
                </motion.div>

                <div className="h-px bg-slate-200/70 dark:bg-slate-800/80" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.25, ease: "easeOut" }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Zap className="size-4 text-slate-400" />
                      کد تایید
                    </div>
                    {countdown > 0 && (
                      <div className="text-xs text-muted-foreground">
                        ارسال مجدد تا {countdown} ثانیه
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="کد ۴ رقمی"
                      aria-invalid={!!errors.otp}
                      {...register("otp")}
                      className={cn(
                        "h-12 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur border-border",
                        "text-center tracking-[0.45em] font-semibold",
                        "focus-visible:ring-accent/20 focus-visible:border-accent"
                      )}
                      maxLength={6}
                      dir="ltr"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onSendOtp}
                      disabled={isLoading || countdown > 0 || !watchedPhone || watchedPhone.length < 10}
                      className={cn(
                        "h-12 rounded-xl px-5 font-semibold transition-all duration-200",
                        "border-primary/20 bg-white/60 hover:bg-white hover:border-primary/30",
                        "disabled:opacity-60"
                      )}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          در حال ارسال
                        </span>
                      ) : countdown > 0 ? (
                        `${countdown} ثانیه`
                      ) : (
                        <span className="flex items-center gap-2">
                          <Zap className="size-4" />
                          ارسال کد
                        </span>
                      )}
                    </Button>
                  </div>

                  {errors.otp && (
                    <div className="text-xs text-destructive/90">
                      {errors.otp.message}
                    </div>
                  )}
                  {isOtpSent && !errors.otp && (
                    <div className="text-xs text-primary flex items-center gap-2">
                      <CheckCircle className="size-4 text-accent" />
                      کد با موفقیت ارسال شد
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.25, ease: "easeOut" }}
                  className="space-y-4 pt-1"
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !canSubmit}
                    className={cn(
                      "w-full h-12 rounded-xl text-base font-bold",
                      "bg-primary text-primary-foreground hover:bg-primary/95",
                      "shadow-[0_14px_28px_rgba(13,61,56,0.20)] hover:shadow-[0_18px_36px_rgba(13,61,56,0.24)]",
                      "transition-all duration-200 hover:-translate-y-0.5 disabled:hover:translate-y-0"
                    )}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        در حال ایجاد حساب
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="size-5" />
                        ایجاد حساب کاربری
                      </span>
                    )}
                  </Button>

                  <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                    <span>قبلاً حساب دارید؟ </span>
                    <Link
                      href="/login"
                      className="text-primary hover:text-primary/90 font-semibold underline underline-offset-4 transition-colors"
                    >
                      وارد شوید
                    </Link>
                  </div>

                  <div className="text-center text-xs text-muted-foreground leading-relaxed">
                    با ثبت‌نام،{" "}
                    <Link href="/legal/terms" className="text-primary hover:underline underline-offset-4">
                      قوانین
                    </Link>{" "}
                    و{" "}
                    <Link href="/legal/privacy" className="text-primary hover:underline underline-offset-4">
                      حریم خصوصی
                    </Link>{" "}
                    را می‌پذیرید.
                  </div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
