"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Award,
  Users,
  CheckCircle,
  ArrowLeft,
  Shield,
  Building,
  GraduationCap,
  PenTool,
  TrendingUp,
  Star,
  HelpCircle,
  Mail,
} from "lucide-react";
import { MessageCircle } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { HomeSeoSections } from "@/components/seo/home-seo-sections-fixed";

export default function HomePageClient() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [stats, setStats] = React.useState<{ users: number; exams: number; questions: number }>({ users: 5000, exams: 50000, questions: 10000 });

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch("/api/stats");
        if (!r.ok) return;
        const d = await r.json();
        if (!cancelled && d) {
          setStats({
            users: Number(d.users) || 5000,
            exams: Number(d.exams) || 50000,
            questions: Number(d.questions) || 10000,
          });
        }
      } catch {}
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      <h1 className="sr-only">سامانه آزمون آنلاین حفظ قرآن و مدیریت آموزشی موسسات</h1>
      <HomeSeoSections />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
          <div
            className="absolute inset-0 opacity-20 blur-3xl -z-10"
            style={{
              background:
                "radial-gradient(60% 60% at 70% 20%, rgba(13,61,56,0.25), transparent 60%), radial-gradient(50% 50% at 20% 80%, rgba(16,185,129,0.18), transparent 60%)",
            }}
          />
        </div>
        {/* Technical grid overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,rgba(2,6,23,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-right">
                <Badge
                  variant="outline"
                  className="mb-6 px-4 py-1 border-primary/20 bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary dark:border-primary/30"
                >
                  ✨ پلتفرم آزمون آنلاین حفظ و ترجمه قرآن کریم
                </Badge>
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6" style={{ color: '#0D3D38' }}>
                  سنجش محفوظات و موفقیت در آزمون های رسمی حفظ قرآن
                </h2>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl md:ml-auto leading-relaxed">
                  ویژه حافظان قرآن برای رشد مستمر، معلمان برای طراحی سریع و تصحیح خودکار، و موسسات برای مدیریت مقیاس‌پذیر با هویت سازمانی.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:justify-start justify-center">
                  <Link href={isLoggedIn ? "/dashboard" : "/register"}>
                    <Button
                      size="lg"
                      className="relative overflow-hidden text-lg px-8 h-12 rounded-full bg-highlight hover:bg-[#C18C35] text-highlight-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 ring-1 ring-white/20 shadow-inner"
                    >
                      {isLoggedIn ? "ورود به داشبورد" : "همین حالا رایگان شروع کنید"}
                      {!isLoggedIn && (
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute inset-0"
                          initial={{ x: "-150%" }}
                          animate={{ x: ["-150%", "150%"] }}
                          transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
                          style={{
                            background:
                              "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                          }}
                        />
                      )}
                    </Button>
                  </Link>
                  <Link href="/demo">
                    {/* <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 h-12 rounded-full border-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-inner"
                    >
                      دموی سیستم
                    </Button> */}
                  </Link>
                </div>
                <div className="mt-8 text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-4 md:justify-start justify-center">
                  <span>بیش از ۱۰,۰۰۰ آزمون برگزار شده</span>
                  <span className="hidden md:inline">|</span>
                  <span>۵۰۰+ موسسه فعال</span>
                </div>
              </div>
              <DashboardPreview />
            </div>
          </motion.div>

          {/* UI Preview: Show, Don't Just Tell */}
          <section className="mt-14 md:mt-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <motion.div
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur p-5 shadow-xl"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <h3 className="font-bold mb-3">گزارش عملکرد زنده</h3>
                <GraphPreview />
              </motion.div>
              <motion.div
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur p-5 shadow-xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <h3 className="font-bold mb-3">نمونه کارت آزمون</h3>
                <TestCardPreview />
              </motion.div>
            </motion.div>
          </section>

          {/* Testimonials */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">تجربه کاربران</h2>
                <p className="text-slate-500">گفتار کسانی که با این پلتفرم در وقت خود صرفه‌جویی کردند</p>
              </div>
              <div className="overflow-hidden">
                <motion.div className="flex gap-6" animate={{ x: [0, -600] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <TestimonialCard key={i} />
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">+۱۰,۰۰۰</div>
              <div className="text-sm text-slate-500">سوال فعال</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">+۵,۰۰۰</div>
              <div className="text-sm text-slate-500">کاربر فعال</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">+۵۰,۰۰۰</div>
              <div className="text-sm text-slate-500">آزمون برگزار شده</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">٪۹۸</div>
              <div className="text-sm text-slate-500">رضایت کاربران</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Role-based Features (Bento) */}
      <section className="relative py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="pointer-events-none absolute -z-10 inset-0">
          <div className="absolute -top-10 left-10 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-purple-400/10 blur-3xl rounded-full" />
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-white">طراحی شده برای همه نقش‌ها</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">دانش‌آموزان، معلمان و موسسات هر یک تجربه‌ای اختصاصی و حرفه‌ای دریافت می‌کنند.</p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <RoleCard icon={<TrendingUp className="h-10 w-10 text-emerald-600" />} title="دانش‌آموزان" points={["نمودار پیشرفت", "گزارش نمرات", "محدودیت سوالات"]} />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <RoleCard icon={<PenTool className="h-10 w-10 text-primary" />} title="معلمان" points={["طراحی آزمون هوشمند", "مدیریت کلاس", "گزارشات گروهی"]} />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <RoleCard icon={<Building className="h-10 w-10 text-purple-600" />} title="موسسات" points={["برندینگ اختصاصی", "مدیریت اساتید", "پنل مانیتورینگ"]} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Iconic Feature Grid (Detailed Boxes) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">امکانات کلیدی پلتفرم</h2>
            <p className="text-slate-500">ترکیبی از سادگی استفاده و قدرت حرفه‌ای</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <IconFeature icon={<BookOpen className="h-6 w-6 text-primary" />} title="آزمون‌های شخصی‌سازی شده" desc="ایجاد آزمون بر اساس جزء، سوره یا صفحات دلخواه." />
            <IconFeature icon={<Clock className="h-6 w-6 text-primary" />} title="تحلیل زمان پاسخ" desc="اندازه‌گیری و بهینه‌سازی زمان پاسخگویی." />
            <IconFeature icon={<Award className="h-6 w-6 text-primary" />} title="گزارش‌های پیشرفته" desc="نمودارها و آمار دقیق برای تصمیم‌گیری بهتر." />
            <IconFeature icon={<Shield className="h-6 w-6 text-primary" />} title="بانک سوالات استاندارد" desc="دسترسی به هزاران سوال معتبر و به‌روز." />
            <IconFeature icon={<Users className="h-6 w-6 text-primary" />} title="رده‌بندی و رقابت" desc="جدول برترین‌ها و رقابت سالم بین کاربران." />
            <IconFeature icon={<CheckCircle className="h-6 w-6 text-accent" />} title="تصحیح خودکار" desc="نتیجه آنی به همراه گزارش دقیق خطاها." />
            <IconFeature icon={<Star className="h-6 w-6 text-primary" />} title="امنیت و پشتیبان‌گیری" desc="نگهداری امن داده‌ها و نسخه‌های پشتیبان." />
            <IconFeature icon={<GraduationCap className="h-6 w-6 text-primary" />} title="یکپارچگی آموزشی" desc="هماهنگی با فرایندهای آموزشی موسسات." />
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-14 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center text-slate-500 text-sm mb-6">اعتماد شده توسط موسسات آموزشی</div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center opacity-80 grayscale">
            {["المهدی", "الکوثر", "نور", "المبین", "حکمت", "طه"].map((name, i) => (
              <div
                key={i}
                className="h-12 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50/60 dark:bg-white/5"
              >
                <span className="text-xs md:text-sm font-semibold tracking-wider">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Counters */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <CounterItem label="سوال فعال" value={stats.questions} suffix="+" />
            <CounterItem label="کاربر فعال" value={stats.users} suffix="+" />
            <CounterItem label="تست برگزار شده" value={stats.exams} suffix="+" />
            <CounterItem label="رضایت" value={98} suffix="٪" />
          </div>
        </div>
      </section>

      {/* Comparison Strip */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur px-4 py-3 text-center">⚡ سرعت بالا</div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur px-4 py-3 text-center">🔒 امنیت داده‌ها</div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur px-4 py-3 text-center">📊 تحلیل دقیق</div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur px-4 py-3 text-center">🎧 پشتیبانی ۲۴/۷</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-20">
        <div className="pointer-events-none absolute -z-10 inset-0">
          <div className="absolute -top-10 right-10 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-emerald-400/10 blur-3xl rounded-full" />
          <div
            className="absolute inset-0 opacity-20 blur-3xl -z-10"
            style={{
              background:
                "radial-gradient(60% 60% at 80% 20%, rgba(79,70,229,0.25), transparent 60%), radial-gradient(50% 50% at 20% 80%, rgba(45,212,191,0.18), transparent 60%)",
            }}
          />
        </div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">پلن‌های اشتراک</h2>
            <p className="text-slate-500">امکانات حرفه‌ای با قیمت منصفانه برای هر سطح</p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
            className="grid gap-6 md:grid-cols-3"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
              <PriceCard title="رایگان" audience="مناسب برای مطالعه فردی" price="۰" cta="شروع رایگان" features={["دسترسی به تست‌های پایه", "ردیابی عملکرد محدود", "۱۰۰ سوال/ماه"]} />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
              <PriceCard
                title="محبوب"
                audience="ویژه دبیران و مشاوران"
                price="۱۹۹٬۰۰۰"
                highlight
                cta="شروع اشتراک"
                features={["تمام امکانات پایه", "تست‌های نامحدود", "تحلیل پیشرفته", "پشتیبانی تیکت"]}
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
              <PriceCard
                title="سازمانی"
                audience="قدرتمند برای مراکز آموزشی"
                price="تماس بگیرید"
                cta="درخواست دمو"
                features={["پنل موسسه و چند معلم", "دامنه و برندینگ اختصاصی", "سهمیه نامحدود", "پشتیبانی ویژه"]}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">سوالات پرتکرار</h2>
            <p className="text-slate-500">پاسخ به رایج‌ترین سوالات کاربران</p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {[
              { q: "آیا می‌توانم رایگان شروع کنم؟", a: "بله، پلن رایگان برای شروع و آشنایی با امکانات در دسترس است." },
              { q: "آیا امکان ساخت آزمون سفارشی وجود دارد؟", a: "بله، می‌توانید بر اساس جزء، سوره یا صفحات دلخواه تست بسازید." },
              { q: "آیا موسسات پنل اختصاصی دارند؟", a: "بله، پنل سازمانی با مدیریت متمرکز و برندسازی ارائه می‌شود." },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white/70 dark:bg-white/5 backdrop-blur"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">{item.q}</span>
                  <HelpCircle className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-3 text-slate-600 dark:text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t bg-slate-950 text-slate-300">
        <div className="container mx-auto px-4 grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">آ</span>
              </div>
              <span className="text-xl font-bold">تست حفظ</span>
            </div>
            <p className="text-slate-400 text-sm">نرم‌افزاری سبک، سریع و به‌شدت قدرتمند برای سنجش و ارزیابی هوشمند.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link href="/features">امکانات</Link>
              </li>
              <li>
                <Link href="/pricing">قیمت‌گذاری</Link>
              </li>
              <li>
                <Link href="/demo">دمو</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white">Roles</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>دانش‌آموزان</li>
              <li>معلمان</li>
              <li>موسسات</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white">Company & Legal</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link href="/about">درباره ما</Link>
              </li>
              <li>
                <Link href="/legal/privacy">حریم خصوصی</Link>
              </li>
              <li>
                <Link href="/legal/terms">قوانین و شرایط</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 text-xs text-slate-500">© {new Date().getFullYear()} تمامی حقوق محفوظ است.</div>
      </footer>
      {/* Floating WhatsApp/Support Button */}
      <Link href="https://wa.me/989393615821" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 group">
        <span className="relative inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors">
          <span className="absolute -z-10 inset-0 rounded-full animate-ping bg-emerald-500/40 group-hover:bg-emerald-500/30" />
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">پشتیبانی</span>
          <span className="pointer-events-none absolute -top-10 right-1/2 translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity shadow">
            ارتباط با پشتیبانی در واتس‌اپ
          </span>
        </span>
      </Link>
    </div>
  );
}

function IconFeature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur shadow-sm hover:shadow-lg transition-all">
      <div className="mb-4 inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 ring-1 ring-inset ring-indigo-200/60">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{desc}</p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ rotateX: 0 }}
      animate={{ rotateX: [0, 6, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      style={{ perspective: 1200 }}
      className="relative h-[300px] md:h-[420px] w-full"
    >
      <div className="absolute inset-0 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-white/10 shadow-2xl backdrop-blur-xl" style={{ transform: "rotateY(-8deg) translateZ(0)" }}>
        <div className="h-full w-full p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/90 dark:bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold">نمودار عملکرد</h4>
              <span className="text-xs text-slate-500">۷ روز اخیر</span>
            </div>
            <GraphPreview />
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/90 dark:bg-white/5">
            <h4 className="font-bold mb-3">دانش‌آموزان اخیر</h4>
            <ul className="space-y-2 text-sm">
              {["مهدی رضایی", "فاطمه امینی", "زهرا احمدی", "حسین نظری"].map((n, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-primary/20" />
                    {n}
                  </span>
                  <span className="text-xs text-slate-500">+{(i + 1) * 3} امتیاز</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/90 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h4 className="font-bold">آخرین آزمون: جزء ۲۷</h4>
              </div>
              <Button size="sm" className="rounded-full">
                مشاهده
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCard() {
  return (
    <div className="min-w-[280px] md:min-w-[360px] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-white/5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
        <div>
          <div className="font-semibold">کاربر حرفه‌ای</div>
          <div className="text-xs text-slate-500">موسسه المبین</div>
        </div>
      </div>
      <blockquote className="text-sm leading-6 text-slate-700 dark:text-slate-300">
        «این پلتفرم فرایند طراحی و برگزاری آزمون را برای ما ۳ برابر سریع‌تر کرد و گزارش‌ها بی‌نظیرند.»
      </blockquote>
    </div>
  );
}

function RoleCard({ icon, title, points, className }: { icon: React.ReactNode; title: string; points: string[]; className?: string }) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const [spot, setSpot] = React.useState({ x: 50, y: 50 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpot({ x, y });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      className={`relative overflow-hidden group p-8 rounded-2xl border bg-white/70 dark:bg-white/5 dark:border-slate-800/50 border-slate-200 shadow-sm backdrop-blur-lg transition-all hover:shadow-xl hover:-translate-y-1 ${className ?? ""}`}
      style={{ backgroundImage: `radial-gradient(400px circle at ${spot.x}% ${spot.y}%, rgba(99,102,241,0.12), transparent 40%)` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary flex items-center justify-center">{icon}</div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
        {points.map((p, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CounterItem({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur text-center">
      <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
        <AnimatedCounter to={value} />
        {suffix}
      </div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function AnimatedCounter({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    let start: number | null = null;
    const from = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [to, duration]);
  return <span dir="ltr">{val.toLocaleString("fa-IR")}</span>;
}

function PriceCard({ title, audience, price, features, highlight, cta }: { title: string; audience?: string; price: string; features: string[]; highlight?: boolean; cta: string }) {
  const content = (
    <div className="p-8 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-lg">
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      {audience && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300">
            {audience}
          </span>
        </div>
      )}
      <div className="text-3xl font-extrabold mb-4">
        {price}
        {price !== "تماس بگیرید" && <span className="text-sm font-normal text-slate-500"> تومان/ماه</span>}
      </div>
      <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            {f}
          </li>
        ))}
      </ul>
      <Button className={`rounded-full ${highlight ? "bg-highlight hover:bg-[#C18C35] text-highlight-foreground" : "bg-slate-900 hover:bg-slate-800"} w-full shadow-inner`}>
        {cta}
      </Button>
    </div>
  );

  if (!highlight) {
    return <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800">{content}</div>;
  }

  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 shadow-[0_0_0_1px_rgba(99,102,241,.4),0_0_35px_8px_rgba(99,102,241,.15)] overflow-hidden">
      <span className="absolute -top-3 right-4 px-3 py-1 text-xs rounded-full bg-highlight text-highlight-foreground">محبوب</span>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ backgroundPositionX: "0%" }}
        animate={{ backgroundPositionX: ["0%", "200%"] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
        style={{
          background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />
      {content}
    </div>
  );
}

function GraphPreview() {
  const points = Array.from({ length: 24 }).map((_, i) => 30 + Math.round(20 * Math.sin(i / 2) + Math.random() * 8));
  return (
    <svg viewBox="0 0 240 100" className="w-full h-32">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(79,70,229,.5)" />
          <stop offset="100%" stopColor="rgba(79,70,229,0)" />
        </linearGradient>
      </defs>
      <path d={"M 0 80 " + points.map((p, i) => `L ${i * 10} ${100 - p}`).join(" ")} fill="none" stroke="rgb(79,70,229)" strokeWidth="2" />
      <path d={`M 0 100 ${points.map((p, i) => `L ${i * 10} ${100 - p}`).join(" ")} L 230 100 Z`} fill="url(#g)" />
    </svg>
  );
}

function TestCardPreview() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white/80 dark:bg-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-semibold">آزمون تشخیصی جزء ۳۰</span>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          زمان‌دار
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">مدت</div>
          <div className="font-bold">۲۰ دقیقه</div>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">تعداد سوال</div>
          <div className="font-bold">۳۰</div>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-center">
          <div className="text-xs text-slate-500">درجه سختی</div>
          <div className="font-bold">متوسط</div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button asChild size="sm" className="rounded-full">
          <Link href="/demo/take">شروع</Link>
        </Button>
      </div>
    </div>
  );
}
