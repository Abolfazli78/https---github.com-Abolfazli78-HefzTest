import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { getAccessibleExams } from "@/lib/exam-access";
import { parseDescription } from "@/lib/exam-utils";
import { UserRole } from "@prisma/client";
import type { Exam } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, ArrowLeft, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default async function UserExamsPage() {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    const exams = await getAccessibleExams(session.user.id, session.user.role as UserRole);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">آزمون‌های آنلاین</h1>
                    <p className="text-muted-foreground">لیست تمامی آزمون‌های فعال برای سنجش محفوظات شما</p>
                </div>
                <Link href="/exams/custom">
                    <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/20">
                        ساخت آزمون دلخواه
                    </Button>
                </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="جستجوی آزمون..."
                        className="pr-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    />
                </div>
                <Button variant="outline" className="h-12 px-6 gap-2 border-slate-200 dark:border-slate-800">
                    <Filter className="h-4 w-4" />
                    فیلترها
                </Button>
            </div>

            {exams.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold">آزمونی یافت نشد</h3>
                        <p className="text-muted-foreground max-w-xs">در حال حاضر آزمون فعالی در سیستم وجود ندارد. می‌توانید آزمون دلخواه خود را بسازید.</p>
                        <Link href="/exams/custom">
                            <Button variant="outline" className="mt-2">ساخت آزمون دلخواه</Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {exams.map((exam: any) => (
                        <Link key={exam.id} href={`/exams/${exam.id}`}>
                            <Card className="group hover:shadow-xl transition-all duration-300 border-slate-100 dark:border-slate-800 overflow-hidden h-full flex flex-col">
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={exam.accessLevel === "FREE" ? "secondary" : "default"} className={cn(
                                            exam.accessLevel === "FREE" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                        )}>
                                            {exam.accessLevel === "FREE" ? "رایگان" : "اشتراکی"}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {exam.duration} دقیقه
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{exam.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 mt-2">{parseDescription(exam.description)}</CardDescription>
                                </CardHeader>
                                <CardContent className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                                            <Award className="h-4 w-4 text-blue-500" />
                                            {exam.questionCount} سوال
                                        </div>
                                        <div className="flex items-center gap-1 text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            شروع آزمون
                                            <ArrowLeft className="h-4 w-4" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
