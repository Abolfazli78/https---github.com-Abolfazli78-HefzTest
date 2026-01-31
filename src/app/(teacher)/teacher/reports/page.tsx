"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Award, Clock, AlertCircle, DollarSign, CreditCard } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
    id: string;
    name: string;
    email: string;
}

interface ExamAttempt {
    id: string;
    score: number | null;
    submittedAt: string;
    timeSpent: number | null;
    user: {
        name: string;
    };
    exam: {
        title: string;
    };
}

interface Payment {
    id: string;
    amount: number;
    status: string;
    paidAt: string | null;
    subscription: {
        user: {
            name: string;
            email: string;
        };
        plan: {
            name: string;
        };
    };
}

interface Subscription {
    id: string;
    status: string;
    startDate: string;
    endDate: string | null;
    user: {
        name: string;
    };
    plan: {
        name: string;
        price: number;
    };
}

interface ReportStats {
    avgScore: number;
    totalAttempts: number;
    totalStudents: number;
}

export default function TeacherReportsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [stats, setStats] = useState<ReportStats>({ avgScore: 0, totalAttempts: 0, totalStudents: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchReportData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [studentsRes, attemptsRes, paymentsRes, subscriptionsRes] = await Promise.all([
                    fetch("/api/organization/members"),
                    fetch("/api/teacher/reports/attempts"),
                    fetch("/api/teacher/reports/payments"),
                    fetch("/api/teacher/reports/subscriptions")
                ]);

                if (!isMounted) return;

                const studentsData = studentsRes.ok ? await studentsRes.json() : [];
                const attemptsData = attemptsRes.ok ? await attemptsRes.json() : [];
                const paymentsData = paymentsRes.ok ? await paymentsRes.json() : [];
                const subscriptionsData = subscriptionsRes.ok ? await subscriptionsRes.json() : [];

                setStudents(studentsData);
                setAttempts(attemptsData);
                setPayments(paymentsData);
                setSubscriptions(subscriptionsData);

                // Calculate statistics
                const completedAttempts = attemptsData.filter((a: ExamAttempt) => a.score !== null);
                const avgScore = completedAttempts.length > 0
                    ? completedAttempts.reduce((sum: number, a: ExamAttempt) => sum + (a.score || 0), 0) / completedAttempts.length
                    : 0;

                setStats({
                    avgScore: Math.round(avgScore),
                    totalAttempts: completedAttempts.length,
                    totalStudents: studentsData.length
                });
            } catch (error) {
                console.error("Error fetching report data:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchReportData();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">گزارش عملکرد دانش‌آموزان</h1>
                    <p className="text-muted-foreground">تحلیل دقیق نمرات و فعالیت‌های دانش‌آموزان تحت نظر شما</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold mb-2">گزارش عملکرد دانش‌آموزان</h1>
                <p className="text-muted-foreground">تحلیل دقیق نمرات و فعالیت‌های دانش‌آموزان تحت نظر شما</p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-100">میانگین کل نمرات</CardDescription>
                        <CardTitle className="text-4xl">
                            {stats.avgScore}%
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-emerald-100">
                            <TrendingUp className="h-4 w-4" />
                            عملکرد کلی گروه
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-blue-100">کل آزمون‌های تکمیل شده</CardDescription>
                        <CardTitle className="text-4xl">{stats.totalAttempts}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-blue-100">
                            <Clock className="h-4 w-4" />
                            تعداد کل مشارکت‌ها
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-amber-100">تعداد دانش‌آموزان</CardDescription>
                        <CardTitle className="text-4xl">{stats.totalStudents}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-amber-100">
                            <Users className="h-4 w-4" />
                            ظرفیت کلاس شما
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-purple-100">اشتراک‌های فعال</CardDescription>
                        <CardTitle className="text-4xl">
                            {subscriptions.filter(s => s.status === "ACTIVE").length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-purple-100">
                            <CreditCard className="h-4 w-4" />
                            دانش‌آموزان با اشتراک
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-emerald-500" />
                            پرداخت‌های اخیر
                        </CardTitle>
                        <CardDescription>تراکنش‌های زرین‌پال دانش‌آموزان</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {payments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <AlertCircle className="h-10 w-10 mb-3 opacity-20" />
                                <p className="text-sm">هنوز پرداختی ثبت نشده است</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {payments.slice(0, 5).map((payment) => (
                                    <div key={payment.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{payment.subscription.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{payment.subscription.plan.name}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-emerald-600">{payment.amount.toLocaleString('fa-IR')} تومان</p>
                                            <Badge variant={payment.status === "COMPLETED" ? "default" : "secondary"} className="text-xs">
                                                {payment.status === "COMPLETED" ? "پرداخت شده" : payment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-indigo-500" />
                            اشتراک‌های فعال
                        </CardTitle>
                        <CardDescription>وضعیت اشتراک دانش‌آموزان</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {subscriptions.filter(s => s.status === "ACTIVE").length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <AlertCircle className="h-10 w-10 mb-3 opacity-20" />
                                <p className="text-sm">اشتراک فعالی وجود ندارد</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {subscriptions.filter(s => s.status === "ACTIVE").slice(0, 5).map((sub) => (
                                    <div key={sub.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{sub.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{sub.plan.name}</p>
                                        </div>
                                        <div className="text-left">
                                            <Badge variant="default" className="bg-emerald-500 text-xs">
                                                فعال
                                            </Badge>
                                            {sub.endDate && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    تا {new Date(sub.endDate).toLocaleDateString("fa-IR")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                        آخرین نتایج آزمون‌ها
                    </CardTitle>
                    <CardDescription>جزئیات ۲۰ آزمون اخیر انجام شده توسط دانش‌آموزان</CardDescription>
                </CardHeader>
                <CardContent>
                    {attempts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">هنوز هیچ گزارشی ثبت نشده است</p>
                            <p className="text-sm">پس از شرکت دانش‌آموزان در آزمون‌ها، نتایج در اینجا نمایش داده می‌شود.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50">
                                        <TableHead className="text-right">دانش‌آموز</TableHead>
                                        <TableHead className="text-right">آزمون</TableHead>
                                        <TableHead className="text-center">نمره</TableHead>
                                        <TableHead className="text-center">تاریخ</TableHead>
                                        <TableHead className="text-center">زمان صرف شده</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attempts.slice(0, 20).map((attempt) => (
                                        <TableRow key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                            <TableCell className="font-medium">{attempt.user.name}</TableCell>
                                            <TableCell>{attempt.exam.title}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={attempt.score! >= 70 ? "bg-emerald-500" : "bg-amber-500"}>
                                                    {attempt.score}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center text-sm text-muted-foreground">
                                                {new Date(attempt.submittedAt).toLocaleDateString("fa-IR")}
                                            </TableCell>
                                            <TableCell className="text-center text-sm">
                                                {Math.floor((attempt.timeSpent || 0) / 60)} دقیقه
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
