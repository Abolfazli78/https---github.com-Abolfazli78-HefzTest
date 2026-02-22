"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HefzButton } from "@/components/ui/hefz-button";
import {
  BookOpen,
  Clock,
  Award,
  Users,
  CheckCircle,
  Shield,
  Building,
  GraduationCap,
  PenTool,
  TrendingUp,
  Star,
  HelpCircle,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [stats, setStats] = React.useState<{ users: number; exams: number; questions: number }>({ users: 5000, exams: 50000, questions: 10000 });
  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch('/api/stats');
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
    return () => { cancelled = true; clearInterval(id); };
  }, []);
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden">
      {/* Hero Section */}
      
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute inset-0 opacity-20 blur-3xl -z-10" style={{ background: 'radial-gradient(60% 60% at 70% 20%, rgba(30,41,59,0.25), transparent 60%), radial-gradient(50% 50% at 20% 80%, rgba(16,185,129,0.18), transparent 60%)' }} />
        </div>
        {/* Technical grid overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,rgba(2,6,23,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="text-center md:text-right mb-12">
                <h1 className="text-[3rem] font-extrabold tracking-tight mb-4 text-primary opacity-100 leading-[1.5] max-w-2xl mx-auto md:mx-0">
                  سنجش&#160;محفوظات و موفقیت در آزمون های رسمی حفظ قرآن
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 md:mb-14 max-w-2xl mx-auto md:ml-auto leading-relaxed">
                  ویژه حافظان قرآن برای رشد مستمر، معلمان برای طراحی سریع و تصحیح خودکار، و موسسات برای مدیریت مقیاس‌پذیر با هویت سازمانی.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link href={isLoggedIn ? "/dashboard" : "/register"}>
                    <HefzButton variant="accent" size="lg" className="relative text-lg hover:scale-105 transition-transform duration-300">
                      {isLoggedIn ? "ورود به داشبورد" : "همین حالا ثبت نام کنید"}
                    </HefzButton>
                  </Link>

                  <Link href="#pricing">
                    <HefzButton
                      variant="ghost"
                      size="lg"
                      className="text-lg border-2 border-accent text-accent hover:bg-transparent hover:text-accent focus:ring-accent hover:scale-105 transition-transform duration-300"
                    >
                      پلن های اشتراک
                    </HefzButton>
                  </Link>
                </div>
              </div>
              <div className="md:pt-2">
                <DashboardPreview />
              </div>
            </div>
          </motion.div>
{/* Testimonials */}
<section className="mt-20 md:mt-24 py-16 md:py-20 overflow-hidden">
  <div className="container mx-auto px-4 text-center mb-10">
    <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">تجربه کاربران</h2>
    <p className="text-slate-500 text-sm md:text-base leading-relaxed">گفتار کسانی که با این پلتفرم در وقت خود صرفه‌جویی کردند</p>
  </div>
  
  <div className="relative flex overflow-hidden" dir="rtl">
    <div 
      className="flex" 
      style={{
        display: 'flex',
        width: 'max-content',
        animation: 'marquee-final 40s linear infinite',
        gap: '40px' // فاصله مستقیم و اجباری بین کپسول‌ها
      }}
    >
      {/* سری اول */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, index) => (
        <div key={`original-${index}`} className="testimonial-capsule">
          <TestimonialCard index={i} />
        </div>
      ))}
      {/* سری دوم */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, index) => (
        <div key={`duplicate-${index}`} className="testimonial-capsule">
          <TestimonialCard index={i} />
        </div>
      ))}
    </div>

    <style jsx global>{`
      @keyframes marquee-final {
        0% { transform: translateX(0); }
        100% { transform: translateX(calc(50% + 20px)); } 
      }
      
      .testimonial-capsule {
        width: 350px !important;    /* عرض ثابت و استاندارد */
        min-width: 350px !important; /* اجازه کوچک شدن نمی‌دهد */
        flex-shrink: 0 !important;   /* اجازه مچاله شدن نمی‌دهد */
        display: block !important;
      }

      /* اجبار متن به شکستن و دو خطی شدن */
      .testimonial-capsule p, 
      .testimonial-capsule span,
      .testimonial-capsule div {
        white-space: normal !important; 
        line-height: 1.6 !important;
        word-break: break-word !important;
      }

      /* اطمینان از اینکه خود کارت کل عرض کپسول رو می‌گیره */
      .testimonial-capsule > div {
        width: 100% !important;
      }
    `}</style>
  </div>
</section>
          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-20"
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">آمارهای کلیدی پلتفرم</h2>
              <p className="mt-2 text-sm md:text-base text-slate-500 leading-relaxed">به‌صورت واقعی و به‌روزرسانی‌شده از عملکرد و میزان استفاده</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {[
                { value: "+۱۰,۰۰۰", label: "سوال فعال", tone: "from-secondary/10 to-accent/10" },
                { value: "+۵,۰۰۰", label: "کاربر فعال", tone: "from-accent/10 to-secondary/10" },
                { value: "+۵۰,۰۰۰", label: "آزمون برگزار شده", tone: "from-secondary/10 to-transparent" },
                { value: "٪۹۸", label: "رضایت کاربران", tone: "from-accent/10 to-transparent" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 md:p-7"
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.tone} opacity-80`} />
                  <div className="relative text-center">
                    <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{item.value}</div>
                    <div className="mt-2 text-xs md:text-sm text-slate-500 leading-relaxed">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Role-based Features (Bento) */}
      <section className="relative py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="pointer-events-none absolute -z-10 inset-0">
          <div className="absolute -top-10 left-10 w-64 h-64 bg-secondary/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-20 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />
        </div>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 dark:text-white tracking-tight">طراحی شده برای همه نقش‌ها</h2>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">دانش‌آموزان، معلمان و موسسات هر یک تجربه‌ای اختصاصی و حرفه‌ای دریافت می‌کنند.</p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <RoleCard
                icon={<TrendingUp className="h-8 w-8 text-accent" />}
                title="دانش‌آموزان"
                points={["نمودار پیشرفت", "گزارش نمرات", "محدودیت سوالات"]}
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <RoleCard
                icon={<PenTool className="h-8 w-8 text-secondary" />}
                title="معلمان"
                points={["طراحی آزمون هوشمند", "مدیریت کلاس", "گزارشات گروهی"]}
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <RoleCard
                icon={<Building className="h-8 w-8 text-secondary" />}
                title="موسسات"
                points={["برندینگ اختصاصی", "مدیریت اساتید", "پنل مانیتورینگ"]}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Iconic Feature Grid (Detailed Boxes) */}
      <section id="faq" className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">امکانات کلیدی پلتفرم</h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">ترکیبی از سادگی استفاده و قدرت حرفه‌ای</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <IconFeature icon={<BookOpen className="h-7 w-7 text-primary" />} title="آزمون‌های شخصی‌سازی شده" desc="ایجاد آزمون بر اساس جزء، سوره یا صفحات دلخواه." />
            <IconFeature icon={<Clock className="h-7 w-7 text-primary" />} title="تحلیل زمان پاسخ" desc="اندازه‌گیری و بهینه‌سازی زمان پاسخگویی." />
            <IconFeature icon={<Award className="h-7 w-7 text-primary" />} title="گزارش‌های پیشرفته" desc="نمودارها و آمار دقیق برای تصمیم‌گیری بهتر." />
            <IconFeature icon={<Shield className="h-7 w-7 text-primary" />} title="بانک سوالات استاندارد" desc="دسترسی به هزاران سوال معتبر و به‌روز." />
            <IconFeature icon={<Users className="h-7 w-7 text-primary" />} title="رده‌بندی و رقابت" desc="جدول برترین‌ها و رقابت سالم بین کاربران." />
            <IconFeature icon={<CheckCircle className="h-7 w-7 text-accent" />} title="تصحیح خودکار" desc="نتیجه آنی به همراه گزارش دقیق خطاها." />
            <IconFeature icon={<Star className="h-7 w-7 text-primary" />} title="امنیت و پشتیبان‌گیری" desc="نگهداری امن داده‌ها و نسخه‌های پشتیبان." />
            <IconFeature icon={<GraduationCap className="h-7 w-7 text-primary" />} title="یکپارچگی آموزشی" desc="هماهنگی با فرایندهای آموزشی موسسات." />
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-16 md:py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">اعتماد شده توسط موسسات آموزشی</h2>
            <p className="mt-2 text-sm md:text-base text-slate-500 leading-relaxed">مراکز آموزشی که برای سنجش و آزمون به ما اعتماد کرده‌اند</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {['المهدی','الکوثر','نور','المبین','حکمت','طه'].map((name, i) => (
              <div
                key={i}
                className="relative h-14 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 flex items-center justify-center bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="pointer-events-none absolute -z-10 inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10 opacity-70" />
                <span className="relative text-xs md:text-sm font-semibold tracking-wider text-slate-700 dark:text-slate-200">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-16 md:py-20">
        <div className="pointer-events-none absolute -z-10 inset-0">
          <div className="absolute -top-10 right-10 w-64 h-64 bg-secondary/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-accent/10 blur-3xl rounded-full" />
          <div className="absolute inset-0 opacity-20 blur-3xl -z-10" style={{ background: 'radial-gradient(60% 60% at 80% 20%, rgba(30,41,59,0.25), transparent 60%), radial-gradient(50% 50% at 20% 80%, rgba(16,185,129,0.18), transparent 60%)' }} />
        </div>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">پلن‌های اشتراک</h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">امکانات حرفه‌ای با قیمت منصفانه برای هر سطح</p>
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
              <PriceCard title="محبوب" audience="ویژه دبیران و مشاوران" price="۱۹۹٬۰۰۰" highlight cta="شروع اشتراک" features={["تمام امکانات پایه", "تست‌های نامحدود", "تحلیل پیشرفته", "پشتیبانی تیکت"]} />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
              <PriceCard title="سازمانی" audience="قدرتمند برای مراکز آموزشی" price="تماس بگیرید" cta="درخواست دمو" features={["پنل موسسه و چند معلم", "دامنه و برندینگ اختصاصی", "سهمیه نامحدود", "پشتیبانی ویژه"]} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">سوالات پرتکرار</h2>
            <p className="text-sm md:text-base text-slate-500 leading-relaxed">پاسخ به رایج‌ترین سوالات کاربران</p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {[
              { q: "آیا می‌توانم رایگان شروع کنم؟", a: "بله، پلن رایگان برای شروع و آشنایی با امکانات در دسترس است." },
              { q: "آیا امکان ساخت آزمون سفارشی وجود دارد؟", a: "بله، می‌توانید بر اساس جزء، سوره یا صفحات دلخواه تست بسازید." },
              { q: "آیا موسسات پنل اختصاصی دارند؟", a: "بله، پنل سازمانی با مدیریت متمرکز و برندسازی ارائه می‌شود." },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 p-6 bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white text-lg">{item.q}</span>
                  <HelpCircle className="h-6 w-6 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
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
              <Image src="/LOGO.jpg" alt="تست حفظ" width={160} height={48} className="h-10 w-auto" />
              <span className="sr-only">تست حفظ</span>
            </div>
            <p className="text-slate-400 text-sm">نرم‌افزاری سبک، سریع و به‌شدت قدرتمند برای سنجش و ارزیابی هوشمند.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-white">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="/features">امکانات</Link></li>
              <li><Link href="/pricing">قیمت‌گذاری</Link></li>
              <li><Link href="/demo">دمو</Link></li>
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
              <li><Link href="/about">درباره ما</Link></li>
              <li><Link href="/legal/privacy">حریم خصوصی</Link></li>
              <li><Link href="/legal/terms">قوانین و شرایط</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 text-xs text-slate-500">© {new Date().getFullYear()} تمامی حقوق محفوظ است.</div>
      </footer>
      {/* Floating WhatsApp/Support Button */}
      <Link href="https://wa.me/989393615821" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 group">
        <span className="relative inline-flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-white shadow-lg hover:bg-accent/90 transition-colors">
          <span className="absolute -z-10 inset-0 rounded-full animate-ping bg-accent/40 group-hover:bg-accent/30" />
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
    <div className="p-8 rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="mb-6 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-accent/5 to-secondary/5 ring-1 ring-inset ring-secondary/20 shadow-sm">
        {icon}
      </div>
      <h3 className="font-bold mb-3 text-lg tracking-tight">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
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
      className="relative h-[260px] md:h-[340px] w-full"
    >
      <div
        className="absolute inset-0"
        style={{ transform: "rotateY(-8deg) translateZ(0)" }}
      >
        <div className="h-full w-full flex items-center">
          <TestCardPreview />
        </div>
      </div>
    </motion.div>
  );
}

function TestCardPreview() {
  return (
    <div className="w-full rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/85 dark:bg-white/5 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-accent/15 to-secondary/10 ring-1 ring-inset ring-secondary/15 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <div className="text-sm text-slate-500">نمونه آزمون</div>
              <div className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">آزمون جزء ۳۰</div>
            </div>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent font-semibold">فعال</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300 mb-5">
          <div className="rounded-2xl bg-slate-50/80 dark:bg-white/5 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3 py-2">
            <div className="text-slate-500">تعداد سوال</div>
            <div className="font-bold">۲۰ سوال</div>
          </div>
          <div className="rounded-2xl bg-slate-50/80 dark:bg-white/5 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3 py-2">
            <div className="text-slate-500">زمان</div>
            <div className="font-bold">۱۵ دقیقه</div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50/80 dark:bg-white/5 ring-1 ring-slate-200/60 dark:ring-slate-800 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>پیشرفت نمونه</span>
            <span className="font-semibold">۶۷٪</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-accent to-accent/80" />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500">آماده برای شروع</span>
        <Link href="/demo">
          <HefzButton size="sm" className="rounded-full shadow-md hover:shadow-lg transition-all duration-300">شروع</HefzButton>
        </Link>
      </div>
    </div>
  );
}

function PriceCard({
  title,
  price,
  features,
  cta,
  highlight,
  audience,
}: {
  title: string;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  audience?: string;
}) {
  return (
    <div
      className={`p-8 rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
        highlight ? "ring-accent" : ""
      }`}
    >
      {highlight && <div className="mb-6 text-sm font-bold text-secondary tracking-wide">پیشنهاد ویژه</div>}
      <h3 className="font-bold text-2xl mb-3 tracking-tight">{title}</h3>
      {audience && <div className="text-sm text-slate-500 mb-4 leading-relaxed">{audience}</div>}
      <div className="text-5xl font-extrabold mb-6 tracking-tight">{price}</div>
      <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-accent" />
            {f}
          </li>
        ))}
      </ul>
      <HefzButton
        variant={highlight ? "primary" : "ghost"}
        className={`rounded-full w-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${highlight ? "text-white" : ""}`}
      >
        {cta}
      </HefzButton>
    </div>
  );
}

function TestimonialCard({ index }: { index: number }) {
  const testimonials = [
    { name: "علی رضایی", org: "موسسه نور", text: "سرعت و دقت در تصحیح آزمون‌ها فوق‌العاده است. زمان ما برای مدیریت کلاس‌ها نصف شده." },
    { name: "فاطمه محمدی", org: "موسسه المهدی", text: "گزارش‌های تحلیلی و نمودارهای پیشرفت به ما در برنامه‌ریزی درسی کمک بزرگی کرده است." },
    { name: "حسین اکبری", org: "موسسه الکوثر", text: "بانک سوالات غنی و امکان طراحی آزمون سفارشی، فرایند آموزش را برای ما متحول کرده." },
    { name: "زهرا حسینی", org: "موسسه حکمت", text: "پشتیبانی عالی و رابط کاربری ساده باعث شد بلافاصله با سیستم کار کنیم." },
    { name: "مهدی احمدی", org: "موسسه طه", text: "امکان مدیریت چند معلم و دانش‌آموز در یک پنل، کار ما را به عنوان مدیر بسیار ساده کرده." },
    { name: "سارا رضایی", org: "موسسه مبین", text: "آزمون‌های استاندارد و هماهنگ با سرفصل‌های رسمی حفظ، بهترین انتخاب برای ما بود." }
  ];
  
  const testimonial = testimonials[index % 6];
  
  return (
    <div className="min-w-[280px] md:min-w-[360px] p-8 rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center shadow-sm">
          <div className="h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
            {testimonial.name.charAt(0)}
          </div>
        </div>
        <div>
          <div className="font-semibold text-lg tracking-tight">{testimonial.name}</div>
          <div className="text-xs text-slate-500">{testimonial.org}</div>
        </div>
      </div>
      <blockquote className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        «{testimonial.text}»
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
      className={`relative overflow-hidden group p-8 rounded-3xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className ?? ""}`}
      style={{ backgroundImage: `radial-gradient(400px circle at ${spot.x}% ${spot.y}%, rgba(99,102,241,0.08), transparent 40%)` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm">
        {points.map((p, i) => (
          <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" />{p}</li>
        ))}
      </ul>
    </div>
  );
}

function CounterItem({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur text-center">
      <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
        <AnimatedCounter to={value} />{suffix}
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
      <path
        d={"M 0 80 " + points.map((p, i) => `L ${i * 10} ${100 - p}`).join(" ")}
        fill="none"
        stroke="rgb(79,70,229)"
        strokeWidth="2"
      />
      <path
        d={`M 0 100 ${points.map((p, i) => `L ${i * 10} ${100 - p}`).join(" ")} L 230 100 Z`}
        fill="url(#g)"
      />
    </svg>
  );
}
