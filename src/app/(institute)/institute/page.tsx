import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    GraduationCap,
    Users,
    TrendingUp,
    BarChart3,
    ArrowUpRight,
    UserPlus,
    ChevronLeft,
    Settings
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getQuotaUsageSummaryForInstitute } from "@/lib/quota-usage";
import { UsageTracker } from "@/components/subscription/usage-tracker";

export default async function InstituteDashboardPage() {
    const session = await getServerSession();

    if (!session) return null;

    const quotaUsage = await getQuotaUsageSummaryForInstitute(session.user.id);

    // eslint-disable-next-line react-hooks/purity
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
        teachers: await db.user.count({ where: { instituteId: session.user.id } }),
        totalStudents: await db.user.count({
            where: {
                teacher: { instituteId: session.user.id }
            }
        }),
        activeExams: await db.examAttempt.count({
            where: {
                user: { teacher: { instituteId: session.user.id } },
                submittedAt: { gte: thirtyDaysAgo }
            }
        }),
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">پنل مدیریت موسسه</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">خوش آمدید، {session.user.name}. نظارت بر عملکرد معلمان و دانش‌آموزان موسسه.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/institute/teachers/add">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]">
                            <UserPlus className="ml-2 h-5 w-5" />
                            افزودن معلم جدید
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="معلمان موسسه"
                    value={stats.teachers}
                    icon={<GraduationCap className="h-6 w-6 text-indigo-500" />}
                    href="/institute/teachers"
                    trend="+۲ معلم جدید"
                    color="indigo"
                />
                <StatCard
                    title="کل دانش‌آموزان"
                    value={stats.totalStudents}
                    icon={<Users className="h-6 w-6 text-blue-500" />}
                    href="/institute/students"
                    trend="+۱۵٪ رشد"
                    color="blue"
                />
                <StatCard
                    title="آزمون‌های ۳۰ روز اخیر"
                    value={stats.activeExams}
                    icon={<BarChart3 className="h-6 w-6 text-emerald-500" />}
                    href="/institute/reports"
                    trend="وضعیت مطلوب"
                    color="emerald"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-0 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl font-black">تحلیل عملکرد موسسه</CardTitle>
                                <CardDescription className="font-medium">مقایسه فعالیت معلمان در ماه جاری</CardDescription>
                            </div>
                            <Badge variant="outline" className="rounded-lg h-8 px-3 border-slate-200 dark:border-slate-800">زنده</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="h-[350px] w-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 mt-4">
                            <div className="text-center space-y-2">
                                <TrendingUp className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
                                <p className="text-sm text-slate-400 font-medium">نمودار تحلیلی به زودی در این بخش نمایش داده می‌شود</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                        <CardHeader className="p-6 pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-black">مصرف اشتراک موسسه</CardTitle>
                                {quotaUsage.planName && (
                                    <Badge variant="outline" className="rounded-lg h-7 px-2 border-slate-200 dark:border-slate-800 text-[10px]">
                                        {quotaUsage.planName}
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="font-medium">
                                {quotaUsage.hasActiveSubscription ? "مجموع مصرف همه معلمان (ماه جاری)" : "برای فعال‌سازی امکانات، پلن تهیه کنید"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            {quotaUsage.hasActiveSubscription ? (
                                <>
                                    <UsageTracker
                                        title="آزمون‌ها"
                                        used={quotaUsage.usage.examsThisMonth}
                                        limit={quotaUsage.quotas.maxExamsPerMonth}
                                    />
                                    <UsageTracker
                                        title="سوالات"
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
                                <Link href="/institute/subscriptions">
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 font-black shadow-lg shadow-indigo-500/20">
                                        ارتقاء پلن
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl overflow-hidden relative">
                        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/10 blur-[60px] rounded-full" />
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-black">مدیریت تیم موسسه</CardTitle>
                            <CardDescription className="text-indigo-100 font-medium">دعوت از ناظران و مدیران</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <p className="text-sm text-indigo-50/80 leading-relaxed mb-6">
                                شما می‌توانید مدیران بخش یا ناظران آموزشی را به تیم مدیریت موسسه اضافه کنید.
                            </p>
                            <Link href="/institute/team">
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
                            <QuickLink href="/institute/teachers" icon={<GraduationCap className="h-5 w-5 text-indigo-500" />} label="لیست معلمان" />
                            <QuickLink href="/institute/reports" icon={<TrendingUp className="h-5 w-5 text-emerald-500" />} label="گزارش‌های جامع" />
                            <QuickLink href="/institute/settings" icon={<Settings className="h-5 w-5 text-slate-500" />} label="تنظیمات موسسه" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, href, trend, color }: { title: string; value: number; icon: React.ReactNode; href: string; trend: string; color: string }) {
    const colorClasses: Record<string, string> = {
        indigo: "from-indigo-500/10 to-indigo-600/5 text-indigo-600 border-indigo-500/10",
        blue: "from-blue-500/10 to-blue-600/5 text-blue-600 border-blue-500/10",
        emerald: "from-emerald-500/10 to-emerald-600/5 text-emerald-600 border-emerald-500/10",
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
