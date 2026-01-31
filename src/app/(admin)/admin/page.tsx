import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    BookOpen,
    HelpCircle,
    TrendingUp,
    AlertCircle,
    ArrowLeft,
    GraduationCap,
    School,
    PlusCircle,
    Settings,
    Tag
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const stats = {
        users: await db.user.count({ where: { role: "STUDENT" } }),
        teachers: await db.user.count({ where: { role: "TEACHER" } }),
        institutes: await db.user.count({ where: { role: "INSTITUTE" } }),
        exams: await db.exam.count(),
        questions: await db.question.count(),
        pendingTickets: await db.supportTicket.count({ where: { status: "NEW" } }),
        discountCodes: await db.discountCode.count({ where: { isActive: true } }),
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">پنل مدیریت</h1>
                <p className="text-muted-foreground">خوش آمدید، {session.user.name}. در اینجا خلاصه‌ای از وضعیت سیستم را مشاهده می‌کنید.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <StatCard
                    title="دانش‌آموزان"
                    value={stats.users}
                    icon={<Users className="h-6 w-6 text-blue-500" />}
                    href="/admin/users?role=STUDENT"
                />
                <StatCard
                    title="معلمان"
                    value={stats.teachers}
                    icon={<GraduationCap className="h-6 w-6 text-emerald-500" />}
                    href="/admin/users?role=TEACHER"
                />
                <StatCard
                    title="موسسات"
                    value={stats.institutes}
                    icon={<School className="h-6 w-6 text-indigo-500" />}
                    href="/admin/users?role=INSTITUTE"
                />
                <StatCard
                    title="آزمون‌ها"
                    value={stats.exams}
                    icon={<BookOpen className="h-6 w-6 text-amber-500" />}
                    href="/admin/exams"
                />
                <StatCard
                    title="سوالات"
                    value={stats.questions}
                    icon={<HelpCircle className="h-6 w-6 text-rose-500" />}
                    href="/admin/questions"
                />
                <StatCard
                    title="تیکت‌ها"
                    value={stats.pendingTickets}
                    icon={<AlertCircle className="h-6 w-6 text-slate-500" />}
                    href="/admin/tickets"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="کدهای تخفیف فعال"
                    value={stats.discountCodes}
                    icon={<Tag className="h-6 w-6 text-purple-500" />}
                    href="/admin/discount-codes"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>دسترسی سریع</CardTitle>
                        <CardDescription>عملیات‌های پرکاربرد مدیریت</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <Link href="/admin/questions/new">
                            <Button className="w-full justify-start h-12" variant="outline">
                                <PlusCircle className="ml-2 h-4 w-4" />
                                افزودن سوال جدید
                            </Button>
                        </Link>
                        <Link href="/admin/exams/new">
                            <Button className="w-full justify-start h-12" variant="outline">
                                <PlusCircle className="ml-2 h-4 w-4" />
                                ساخت آزمون جدید
                            </Button>
                        </Link>
                        <Link href="/admin/reports">
                            <Button className="w-full justify-start h-12" variant="outline">
                                <TrendingUp className="ml-2 h-4 w-4" />
                                مشاهده گزارش‌های دقیق
                            </Button>
                        </Link>
                        <Link href="/admin/settings">
                            <Button className="w-full justify-start h-12" variant="outline">
                                <Settings className="ml-2 h-4 w-4" />
                                تنظیمات سیستم
                            </Button>
                        </Link>
                        <Link href="/admin/discount-codes">
                            <Button className="w-full justify-start h-12" variant="outline">
                                <Tag className="ml-2 h-4 w-4" />
                                مدیریت کدهای تخفیف
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>آخرین فعالیت‌ها</CardTitle>
                        <CardDescription>به زودی...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
                        در حال توسعه بخش لاگ فعالیت‌ها
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, href }: { title: string; value: number; icon: React.ReactNode; href: string }) {
    return (
        <Link href={href}>
            <Card className="hover:shadow-md transition-all cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="flex items-center text-xs text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        مشاهده جزئیات
                        <ArrowLeft className="mr-1 h-3 w-3" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
