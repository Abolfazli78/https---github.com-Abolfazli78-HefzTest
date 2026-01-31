import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Target, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession();
    if (!session || session.user.role !== "TEACHER") {
        redirect("/login");
    }

    const { id } = await params;

    // Get student details with exam attempts
    const student = await db.user.findFirst({
        where: { 
            id,
            teacherId: session.user.id 
        },
        include: {
            examAttempts: {
                include: {
                    exam: {
                        select: {
                            id: true,
                            title: true,
                            duration: true,
                            questionCount: true,
                            createdAt: true,
                        }
                    }
                },
                orderBy: { submittedAt: "desc" }
            },
            _count: {
                select: { examAttempts: true }
            }
        }
    });

    if (!student) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/teacher/students">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="ml-2 h-4 w-4" />
                            بازگشت به لیست
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardContent className="text-center py-10">
                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">دانش‌آموز یافت نشد</h2>
                        <p className="text-muted-foreground mb-4">
                            دانش‌آموز مورد نظر وجود ندارد یا به شما اختصاص داده نشده است.
                        </p>
                        <Link href="/teacher/students">
                            <Button>
                                بازگشت به لیست دانش‌آموزان
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Calculate statistics
    const completedAttempts = student.examAttempts.filter(attempt => attempt.status === "COMPLETED");
    const averageScore = completedAttempts.length > 0 
        ? completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length 
        : 0;

    const bestScore = completedAttempts.length > 0 
        ? Math.max(...completedAttempts.map(attempt => attempt.score || 0))
        : 0;

    const totalTimeSpent = completedAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
    const averageTimeSpent = completedAttempts.length > 0 ? totalTimeSpent / completedAttempts.length : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/teacher/students">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="ml-2 h-4 w-4" />
                        بازگشت به لیست
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{student.name}</h1>
                        <p className="text-muted-foreground">{student.email}</p>
                    </div>
                </div>
                <Badge variant={student.isActive ? "outline" : "secondary"} className={student.isActive ? "text-emerald-600 border-emerald-200 bg-emerald-50" : ""}>
                    {student.isActive ? "فعال" : "غیرفعال"}
                </Badge>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            میانگین نمره
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
                        <Progress value={averageScore} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            بهترین نمره
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bestScore}%</div>
                        <p className="text-xs text-muted-foreground mt-1">بالاترین نمره کسب شده</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            تعداد آزمون‌ها
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{student._count.examAttempts}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {completedAttempts.length} تکمیل شده
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            میانگین زمان
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.floor(averageTimeSpent / 60)}:{(averageTimeSpent % 60).toString().padStart(2, '0')}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">دقیقه:ثانیه</p>
                    </CardContent>
                </Card>
            </div>

            {/* Exam Attempts Table */}
            <Card>
                <CardHeader>
                    <CardTitle>سوابق آزمون‌ها</CardTitle>
                </CardHeader>
                <CardContent>
                    {student.examAttempts.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            دانش‌آموز هنوز در هیچ آزمونی شرکت نکرده است.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {student.examAttempts.map((attempt) => (
                                <div key={attempt.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{attempt.exam.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {attempt.exam.questionCount} سوال • {attempt.exam.duration} دقیقه
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {attempt.submittedAt 
                                                    ? `تکمیل شده در ${new Date(attempt.submittedAt).toLocaleDateString('fa-IR')}`
                                                    : `شروع شده در ${new Date(attempt.startedAt).toLocaleDateString('fa-IR')}`
                                                }
                                            </p>
                                        </div>
                                        <div className="text-left">
                                            {attempt.status === "COMPLETED" ? (
                                                <div>
                                                    <Badge variant={attempt.score! >= 70 ? "default" : "destructive"} className="bg-emerald-50 text-emerald-700 border-emerald-100 mb-2">
                                                        {attempt.score}%
                                                    </Badge>
                                                    <div className="text-sm text-muted-foreground">
                                                        {attempt.correctAnswers} صحیح • {attempt.wrongAnswers} غلط • {attempt.unanswered} بی‌جواب
                                                    </div>
                                                    {attempt.timeSpent && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            زمان: {Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Badge variant="secondary">
                                                    در حال انجام
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
