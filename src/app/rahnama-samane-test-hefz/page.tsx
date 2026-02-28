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
      <div className="container mx-auto px-4 py-10 md:py-14">
        <header className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold leading-relaxed text-slate-900 dark:text-white">
            راهنمای استفاده از سامانه تست حفظ
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
            این صفحه به منظور راهنمایی کاربران در استفاده صحیح از امکانات سامانه تست حفظ تهیه شده است. لطفاً پیش از شروع آزمون، مراحل زیر را مطالعه فرمایید.
          </p>
        </header>

        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <Info className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">معرفی کوتاه</h2>
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-white/5 p-6 md:p-8">
            <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
              سامانه تست حفظ یک محیط آموزشی رسمی برای طراحی آزمون، اجرای شبیه‌ساز و تحلیل عملکرد است. در ادامه مراحل کلیدی استفاده از سامانه به صورت دقیق ارائه می‌شود.
            </p>
          </div>
        </section>

        <section className="mt-12 space-y-8">
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">ثبت‌نام و ورود</h2>
          </div>

          <RegisterGallery />

          <LoginGallery />
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">ساخت آزمون دلخواه</h2>
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-white/5 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              <h3 className="text-lg font-semibold">ایجاد آزمون تمرینی</h3>
            </div>
            {/* گالری مراحل ساخت آزمون */}
            <CreateExamGallery />
            <ol className="mt-5 space-y-2 list-decimal pr-5 text-slate-700 dark:text-slate-300">
              <li>انتخاب محدوده محفوظات</li>
              <li>انتخاب سال سوالات</li>
              <li>تعیین تعداد سوال</li>
              <li>تعیین زمان آزمون</li>
              <li>انتخاب گزینه «شروع آزمون»</li>
            </ol>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
              کاربران می‌توانند با تنظیم موارد فوق، آزمونی متناسب با نیاز خود ایجاد نمایند. پس از پایان آزمون، پاسخ‌ها به صورت خودکار تصحیح خواهد شد.
            </p>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <PlayCircle className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">شبیه‌ساز آزمون رسمی</h2>
          </div>
          <SimulatorGallery />
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">مشاهده کارنامه و تحلیل عملکرد</h2>
          </div>
          <ResultsGallery />
        </section>

        <section className="mt-12 space-y-8">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">امکانات ویژه معلمان و مدیران</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-white/5 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-lg font-semibold">پنل معلمان</h3>
              </div>
              <ul className="mt-5 space-y-2 text-slate-700 dark:text-slate-300">
                <li>ایجاد کلاس</li>
                <li>افزودن قرآن‌آموز</li>
                <li>طراحی آزمون</li>
                <li>مشاهده نتایج</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-white/5 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-lg font-semibold">پنل مدیر مؤسسه</h3>
              </div>
              <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 h-48 md:h-64 flex items-center justify-center text-sm text-slate-400">
                محل درج تصویر پنل مدیریت
              </div>
              <ul className="mt-5 space-y-2 text-slate-700 dark:text-slate-300">
                <li>مدیریت کلاس‌ها</li>
                <li>مشاهده عملکرد هر کلاس</li>
                <li>مقایسه کلاس‌ها</li>
                <li>طراحی آزمون اختصاصی</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">راهنمای پنل معلمان: افزودن قرآن‌آموز</h2>
          </div>
          <TeacherAddStudentGallery />
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">گزارش عملکرد دانش‌آموزان برای معلم</h2>
          </div>
          <TeacherReportGallery />
        </section>

        <section className="mt-12 space-y-6">
          <div className="rounded-3xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 p-6 md:p-8">
            <p className="text-sm md:text-base leading-8 text-amber-900 dark:text-amber-200">
              سامانه تست حفظ صرفاً ابزار تمرینی و شبیه‌ساز آزمون است و جایگزین ثبت‌نام آزمون رسمی اعطای مدرک نمی‌باشد.
            </p>
          </div>
          <div className="flex justify-center">
            <Button asChild className="h-12 px-10 rounded-2xl text-base">
              <Link href="/exams">شروع آزمون</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
