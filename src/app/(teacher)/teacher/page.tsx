import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    BookOpen,
    TrendingUp,
    PlusCircle,
    ArrowUpRight,
    UserPlus,
    BarChart3,
    Settings,
    ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getQuotaUsageSummaryForTeacher } from "@/lib/quota-usage";
import { UsageTracker } from "@/components/subscription/usage-tracker";

export default async function TeacherDashboardPage() {
    const session = await getServerSession();

    if (!session) return null;

    // eslint-disable-next-line react-hooks/purity
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
        students: await db.user.count({ where: { teacherId: session.user.id } }),
        exams: await db.exam.count({ where: { createdById: session.user.id } }),
        recentAttempts: await db.examAttempt.count({
            where: {
                user: { teacherId: session.user.id },
                submittedAt: { gte: sevenDaysAgo }
            }
        }),
    };

    const quotaUsage = await getQuotaUsageSummaryForTeacher(session.user.id);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">پنل مدیریت معلم</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">خوش آمدید، {session.user.name}. بیایید نگاهی به وضعیت کلاس‌های شما بیندازیم.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/teacher/exams/new">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                            <PlusCircle className="ml-2 h-5 w-5" />
                            طراحی آزمون جدید
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="دانش‌آموزان من"
                    value={stats.students}
                    icon={<Users className="h-6 w-6 text-blue-500" />}
                    href="/teacher/students"
                    trend="+۱۲٪ این ماه"
                    color="blue"
                />
                <StatCard
                    title="آزمون‌های فعال"
                    value={stats.exams}
                    icon={<BookOpen className="h-6 w-6 text-emerald-500" />}
                    href="/teacher/exams"
                    trend="+۳ آزمون جدید"
                    color="emerald"
                />
                <StatCard
                    title="شرکت‌کنندگان اخیر"
                    value={stats.recentAttempts}
                    icon={<TrendingUp className="h-6 w-6 text-amber-500" />}
                    href="/teacher/reports"
                    trend="۷ روز گذشته"
                    color="amber"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl font-black">نمودار پیشرفت تحصیلی</CardTitle>
                                <CardDescription className="font-medium">میانگین نمرات در ۳۰ روز اخیر</CardDescription>
                            </div>
                            <Badge variant="outline" className="rounded-lg h-8 px-3 border-slate-200 dark:border-slate-800">ماهانه</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="h-[300px] w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
                            <div className="text-center space-y-2">
                                <BarChart3 className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                                <p className="text-sm text-slate-400 font-medium">نمودار آماری به زودی در این بخش نمایش داده می‌شود</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                        <CardHeader className="p-6 pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-black">اشتراک</CardTitle>
                                {quotaUsage.planName && (
                                    <Badge variant="outline" className="rounded-lg h-7 px-2 border-slate-200 dark:border-slate-800 text-[10px]">
                                        {quotaUsage.planName}
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="font-medium">
                                {quotaUsage.hasActiveSubscription ? "مصرف ماه جاری" : "برای فعال‌سازی امکانات، پلن تهیه کنید"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            {quotaUsage.hasActiveSubscription ? (
                                <>
                                    <UsageTracker
                                        title="آزمون‌ها (این ماه)"
                                        used={quotaUsage.usage.examsThisMonth}
                                        limit={quotaUsage.quotas.maxExamsPerMonth}
                                    />
                                    <UsageTracker
                                        title="سوالات (این ماه)"
                                        used={quotaUsage.usage.questionsThisMonth}
                                        limit={quotaUsage.quotas.maxQuestionsPerMonth}
                                    />
                                    <UsageTracker
                                        title="دانش‌آموزان"
                                        used={quotaUsage.usage.studentsCount}
                                        limit={quotaUsage.quotas.maxStudentsAllowed}
                                    />
                                </>
                            ) : (
                                <Link href="/teacher/subscriptions">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 font-black shadow-lg shadow-emerald-500/20">
                                        ارتقاء پلن
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl overflow-hidden relative">
                        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/10 blur-[60px] rounded-full" />
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-black">مدیریت تیم</CardTitle>
                            <CardDescription className="text-indigo-100 font-medium">دعوت از دستیاران و همکاران</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <p className="text-sm text-indigo-50/80 leading-relaxed mb-6">
                                شما می‌توانید معلمان دیگر یا دستیاران آموزشی خود را به تیم اضافه کنید تا در مدیریت آزمون‌ها به شما کمک کنند.
                            </p>
                            <Link href="/teacher/team">
                                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl h-12 font-black shadow-xl">
                                    <UserPlus className="ml-2 h-5 w-5" />
                                    مدیریت اعضای تیم
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-lg font-black">دسترسی سریع</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2 grid gap-3">
                            <QuickLink href="/teacher/students" icon={<Users className="h-5 w-5 text-blue-500" />} label="لیست دانش‌آموزان" />
                            <QuickLink href="/teacher/reports" icon={<TrendingUp className="h-5 w-5 text-amber-500" />} label="گزارش نمرات" />
                            <QuickLink href="/teacher/settings" icon={<Settings className="h-5 w-5 text-slate-500" />} label="تنظیمات حساب" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, href, trend, color }: { title: string; value: number; icon: React.ReactNode; href: string; trend: string; color: string }) {
    const colorClasses: Record<string, string> = {
        blue: "from-blue-500/10 to-blue-600/5 text-blue-600 border-blue-500/10",
        emerald: "from-emerald-500/10 to-emerald-600/5 text-emerald-600 border-emerald-500/10",
        amber: "from-amber-500/10 to-amber-600/5 text-amber-600 border-amber-500/10",
    };

    return (
        <Link href={href}>
            <Card className="group relative overflow-hidden border-0 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-900 rounded-3xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity", colorClasses[color])} />
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                    <CardTitle className="text-sm font-black text-slate-500 dark:text-slate-400">{title}</CardTitle>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm">
                        {icon}
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-4xl font-black tracking-tighter">{value.toLocaleString("fa-IR")}</div>
                    <div className="flex items-center justify-between mt-4">
                        <Badge variant="secondary" className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold border-0">{trend}</Badge>
                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href}>
            <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                        {icon}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
                </div>
                <ChevronLeft className="h-4 w-4 text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </div>
        </Link>
    );
}
