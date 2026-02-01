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
import { User as UserIcon, GraduationCap, School, Mail, Lock, User, Phone, Shield, CheckCircle, ArrowLeft, Sparkles, Zap } from "lucide-react";
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
      setError("لطفاً تمام فیلدهای الزامی را correctly وارد کنید");
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Main Card */}
          <Card className="backdrop-blur-xl bg-white/90 border border-gray-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <CardHeader className="space-y-6 text-center pb-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-600 via-gray-600 to-slate-600"></div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-slate-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold text-gray-800">
                  به خانواده ما خوش آمدید
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  حساب کاربری خود را بسازید و به دنیای آموزش قدم بگذارید
                </CardDescription>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center space-x-4 space-x-reverse">
                <div className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    currentStep >= 1 ? "bg-gradient-to-r from-slate-600 to-gray-700 text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
                  </div>
                  <span className="mr-2 text-sm text-gray-600">اطلاعات پایه</span>
                </div>
                <div className={cn(
                  "w-12 h-0.5 transition-all",
                  currentStep >= 2 ? "bg-gradient-to-r from-slate-600 to-gray-700" : "bg-gray-300"
                )}></div>
                <div className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    currentStep >= 2 ? "bg-gradient-to-r from-slate-600 to-gray-700 text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : "2"}
                  </div>
                  <span className="mr-2 text-sm text-gray-600">تأیید</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                  {info && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Alert className="border-green-200 bg-green-50 text-green-800">
                        <AlertDescription>{info}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Role Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <Label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-slate-600" />
                    نوع حساب کاربری خود را انتخاب کنید
                  </Label>
                  <RadioGroup
                    value={selectedRole}
                    onValueChange={(value) => setValue("role", value as "STUDENT" | "TEACHER" | "INSTITUTE")}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    {[
                      { value: "STUDENT", icon: UserIcon, label: "دانش‌آموز", desc: "آموزش و یادگیری" },
                      { value: "TEACHER", icon: GraduationCap, label: "معلم", desc: "آموزش و تدریس" },
                      { value: "INSTITUTE", icon: School, label: "مدیر موسسه", desc: "مدیریت آموزشگاه" }
                    ].map((role, index) => (
                      <motion.div
                        key={role.value}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <div>
                          <RadioGroupItem value={role.value} id={role.value} className="peer sr-only" />
                          <Label
                            htmlFor={role.value}
                            className={cn(
                              "flex flex-col items-center justify-between rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300",
                              "bg-white border-gray-200 hover:bg-gray-50 hover:border-slate-400",
                              "peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-slate-50 peer-data-[state=checked]:to-gray-50 peer-data-[state=checked]:border-slate-500 peer-data-[state=checked]:shadow-lg peer-data-[state=checked]:shadow-slate-200"
                            )}
                          >
                            <role.icon className="mb-3 h-8 w-8 text-gray-500 peer-data-[state=checked]:text-slate-700" />
                            <span className="text-base font-medium text-gray-700 peer-data-[state=checked]:text-slate-800">{role.label}</span>
                            <span className="text-xs text-gray-500 mt-1">{role.desc}</span>
                          </Label>
                        </div>
                      </motion.div>
                    ))}
                  </RadioGroup>
                  {errors.role && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-600 flex items-center gap-1"
                    >
                      {errors.role.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-600" />
                        نام کامل
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="نام کامل خود را وارد کنید"
                        {...register("name")}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500/20"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-600"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-600" />
                        ایمیل (اختیاری)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        {...register("email")}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500/20"
                        dir="ltr"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-600"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-600" />
                      شماره موبایل
                    </Label>
                    <PhoneInputSimple
                      value={watchedPhone || ""}
                      onChange={handlePhoneChange}
                    />
                    <input
                      type="hidden"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-600"
                      >
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* Password Fields */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-600" />
                      رمز عبور
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500/20"
                    />
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-600"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-600" />
                      تأیید رمز عبور
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500/20"
                    />
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-600"
                      >
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </div>
                </motion.div>

                {/* OTP Verification */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <Label htmlFor="otp" className="text-gray-700 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-600" />
                    کد ارسال شده
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="------"
                      {...register("otp")}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500/20 flex-1"
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onSendOtp}
                      disabled={isLoading || countdown > 0 || !watchedPhone || watchedPhone.length < 10}
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-slate-500 transition-all duration-300"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                          در حال ارسال...
                        </span>
                      ) : countdown > 0 ? (
                        `${countdown} ثانیه`
                      ) : (
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          ارسال کد
                        </span>
                      )}
                    </Button>
                  </div>
                  {errors.otp && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-600"
                    >
                      {errors.otp.message}
                    </motion.p>
                  )}
                  {isOtpSent && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-green-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      کد با موفقیت به شماره شما ارسال شد
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-slate-700 to-gray-800 hover:from-slate-800 hover:to-gray-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isLoading || !canSubmit}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        در حال ایجاد حساب...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        ایجاد حساب کاربری
                      </span>
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <span>قبلاً حساب دارید؟ </span>
                    <Link href="/login" className="text-slate-700 hover:text-slate-900 font-medium underline underline-offset-4 transition-colors">
                      وارد شوید
                    </Link>
                  </div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
