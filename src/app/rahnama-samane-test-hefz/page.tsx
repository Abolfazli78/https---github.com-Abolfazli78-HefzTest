import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateExamGallery } from "@/components/guide/create-exam-gallery";
import { SimulatorGallery } from "@/components/guide/simulator-gallery";
import { RegisterGallery } from "@/components/guide/register-gallery";
import { LoginGallery } from "@/components/guide/login-gallery";
import { ResultsGallery } from "@/components/guide/results-gallery";
import { TeacherAddStudentGallery } from "@/components/guide/teacher-add-student-gallery";
import { TeacherReportGallery } from "@/components/guide/teacher-report-gallery";
import {
  Info,
  UserPlus,
  LogIn,
  ClipboardCheck,
  PlayCircle,
  ListChecks,
  Award,
  Users,
  GraduationCap,
  Settings,
} from "lucide-react";

export const metadata: Metadata = {
  title: "راهنمای استفاده از سامانه تست حفظ",
  description:
    "راهنمای رسمی و مرحله‌به‌مرحله برای استفاده از امکانات سامانه تست حفظ، شامل ثبت‌نام، ساخت آزمون، شبیه‌ساز رسمی و تحلیل نتایج.",
  alternates: {
    canonical: "https://hefztest.ir/rahnama-samane-test-hefz",
  },
};

export default function Page() {
  return (
    <main className="bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      <div
        className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14 pb-24 sm:pb-12"
        dir="rtl"
      >
        <header className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-relaxed text-slate-900 dark:text-white">
            راهنمای استفاده از سامانه تست حفظ
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-7 sm:leading-8 text-slate-700 dark:text-slate-300">
            این صفحه به منظور راهنمایی کاربران در استفاده صحیح از امکانات سامانه تست حفظ تهیه شده است. لطفاً پیش از شروع آزمون، مراحل زیر را مطالعه فرمایید.
          </p>
        </header>

        <section className="mt-10 sm:mt-12 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Info className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">معرفی کوتاه</h2>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-white/5 p-5 sm:p-6 md:p-8">
            <p className="text-sm sm:text-base leading-7 sm:leading-8 text-slate-700 dark:text-slate-300">
              سامانه تست حفظ یک محیط آموزشی رسمی برای طراحی آزمون، اجرای شبیه‌ساز و تحلیل عملکرد است. در ادامه مراحل کلیدی استفاده از سامانه به صورت دقیق ارائه می‌شود.
            </p>
          </div>
        </section>

        <section className="mt-10 sm:mt-12 space-y-6 sm:space-y-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">ثبت‌نام و ورود</h2>
          </div>

          <RegisterGallery />

          <LoginGallery />
        </section>

        <section className="mt-10 sm:mt-12 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <ClipboardCheck className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">ساخت آزمون دلخواه</h2>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-white/5 p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
              <h3 className="text-base sm:text-lg font-semibold">ایجاد آزمون تمرینی</h3>
            </div>
            <CreateExamGallery />
            <ol className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 list-decimal pr-5 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
              <li>انتخاب محدوده محفوظات</li>
              <li>انتخاب سال سوالات</li>
              <li>تعیین تعداد سوال</li>
              <li>تعیین زمان آزمون</li>
              <li>انتخاب گزینه «شروع آزمون»</li>
            </ol>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base leading-7 text-slate-600 dark:text-slate-400">
              کاربران می‌توانند با تنظیم موارد فوق، آزمونی متناسب با نیاز خود ایجاد نمایند. پس از پایان آزمون، پاسخ‌ها به صورت خودکار تصحیح خواهد شد.
            </p>
          </div>
        </section>

        <section className="mt-10 sm:mt-12 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <PlayCircle className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">شبیه‌ساز آزمون رسمی</h2>
          </div>
          <SimulatorGallery />
        </section>

        <section className="mt-10 sm:mt-12 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <ListChecks className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">مشاهده کارنامه و تحلیل عملکرد</h2>
          </div>
          <ResultsGallery />
        </section>

        <section className="mt-10 sm:mt-12 space-y-6 sm:space-y-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">امکانات ویژه معلمان و مدیران</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-white/5 p-5 sm:p-6 md:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-base sm:text-lg font-semibold">پنل معلمان</h3>
              </div>
              <ul className="mt-2 space-y-1.5 sm:space-y-2 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                <li>ایجاد کلاس</li>
                <li>افزودن قرآن‌آموز</li>
                <li>طراحی آزمون</li>
                <li>مشاهده نتایج</li>
              </ul>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-white/5 p-5 sm:p-6 md:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-base sm:text-lg font-semibold">پنل مدیر مؤسسه</h3>
              </div>
              <div className="mt-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/40 min-h-[12rem] sm:min-h-[14rem] md:min-h-[16rem] flex items-center justify-center text-xs sm:text-sm text-slate-400">
                محل درج تصویر پنل مدیریت
              </div>
              <ul className="mt-3 space-y-1.5 sm:space-y-2 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                <li>مدیریت کلاس‌ها</li>
                <li>مشاهده عملکرد هر کلاس</li>
                <li>مقایسه کلاس‌ها</li>
                <li>طراحی آزمون اختصاصی</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10 sm:mt-12 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">راهنمای پنل معلمان: افزودن قرآن‌آموز</h2>
          </div>
          <TeacherAddStudentGallery />
        </section>

        <section className="mt-10 sm:mt-12 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <ListChecks className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">گزارش عملکرد دانش‌آموزان برای معلم</h2>
          </div>
          <TeacherReportGallery />
        </section>

        <section className="mt-10 sm:mt-12 space-y-5 sm:space-y-6">
          <div className="rounded-2xl sm:rounded-3xl border border-amber-200 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/30 p-5 sm:p-6 md:p-8">
            <p className="text-xs sm:text-sm md:text-base leading-7 sm:leading-8 text-amber-900 dark:text-amber-200">
              سامانه تست حفظ صرفاً ابزار تمرینی و شبیه‌ساز آزمون است و جایگزین ثبت‌نام آزمون رسمی اعطای مدرک نمی‌باشد.
            </p>
          </div>
          <div className="flex justify-center">
            <Button asChild className="h-12 px-8 sm:px-10 rounded-2xl text-base">
              <Link href="/exams">شروع آزمون</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
