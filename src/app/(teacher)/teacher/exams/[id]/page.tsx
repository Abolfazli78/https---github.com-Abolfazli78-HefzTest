import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Target, BookOpen, Users } from "lucide-react";
import Link from "next/link";

// Helper function to parse description and hide JSON settings
function parseDescription(description: string | null): string {
    if (!description) return "بدون توضیحات";
    
    // Check if description contains JSON settings
    const jsonMatch = description.match(/\{[^}]*"passingScore"[^}]*\}/);
    if (jsonMatch) {
        // Remove the JSON part and return only the actual description
        const cleanDescription = description.replace(/\{[^}]*"passingScore"[^}]*\}/g, '').trim();
        return cleanDescription || "بدون توضیحات";
    }
    
    return description;
}

// Helper function to extract custom settings from description
function extractCustomSettings(description: string | null) {
    if (!description) return null;
    
    try {
        const jsonMatch = description.match(/\{[^}]*"passingScore"[^}]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        // If JSON parsing fails, return null
        return null;
    }
    
    return null;
}

export default async function TeacherExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession();
    if (!session || session.user.role !== "TEACHER") {
        redirect("/login");
    }

    const { id } = await params;

    const exam = await db.exam.findFirst({
        where: { 
            id,
            createdById: session.user.id 
        },
        include: {
            questions: {
                orderBy: { createdAt: "asc" }
            },
            examAttempts: {
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { submittedAt: "desc" }
            },
            _count: {
                select: { examAttempts: true }
            }
        }
    });

    if (!exam) {
        redirect("/teacher/exams");
    }

    const customSettings = extractCustomSettings(exam.description);
    const cleanDescription = parseDescription(exam.description);

    const completedAttempts = exam.examAttempts.filter(attempt => attempt.status === "COMPLETED");
    const averageScore = completedAttempts.length > 0 
        ? completedAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / completedAttempts.length 
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/teacher/exams">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="ml-2 h-4 w-4" />
                        بازگشت به لیست
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{exam.title}</h1>
                        <p className="text-muted-foreground">{cleanDescription}</p>
                    </div>
                </div>
                <Badge variant={exam.isActive ? "outline" : "secondary"} className={exam.isActive ? "text-emerald-600 border-emerald-200 bg-emerald-50" : ""}>
                    {exam.isActive ? "فعال" : "غیرفعال"}
                </Badge>
            </div>

            {/* Exam Info */}
            <Card>
                <CardHeader>
                    <CardTitle>اطلاعات آزمون</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">مدت زمان</p>
                                <p className="font-medium">{exam.duration} دقیقه</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">تعداد سوالات</p>
                                <p className="font-medium">{exam.questionCount} سوال</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">تعداد شرکت‌کنندگان</p>
                                <p className="font-medium">{exam._count.examAttempts} نفر</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">میانگین نمره</p>
                                <p className="font-medium">{averageScore.toFixed(1)}%</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Custom Settings */}
                    {customSettings && (
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="text-lg font-medium mb-4">تنظیمات آزمون</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">نمره قبولی</p>
                                    <p className="font-medium">{customSettings.passingScore}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">ترتیب سوالات</p>
                                    <p className="font-medium">{customSettings.randomizeQuestions ? "تصادفی" : "ثابت"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">نمایش نتایج</p>
                                    <p className="font-medium">{customSettings.showResults ? "دارد" : "ندارد"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">اجازه مجدد</p>
                                    <p className="font-medium">{customSettings.allowRetake ? "دارد" : "ندارد"}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Questions */}
            <Card>
                <CardHeader>
                    <CardTitle>سوالات آزمون ({exam.questions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {exam.questions.slice(0, 5).map((question, index) => (
                            <div key={question.id} className="p-4 border rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{question.questionText}</p>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            جزء {question.juz} • {question.topic || "بدون موضوع"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {exam.questions.length > 5 && (
                            <div className="text-center text-muted-foreground">
                                و {exam.questions.length - 5} سوال دیگر...
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Exam Attempts */}
            <Card>
                <CardHeader>
                    <CardTitle>سوابق شرکت‌کنندگان ({exam._count.examAttempts})</CardTitle>
                </CardHeader>
                <CardContent>
                    {exam.examAttempts.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            هنوز کسی در این آزمون شرکت نکرده است.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {exam.examAttempts.slice(0, 10).map((attempt) => (
                                <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{attempt.user.name}</p>
                                        <p className="text-sm text-muted-foreground">{attempt.user.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {attempt.submittedAt 
                                                ? `تکمیل شده در ${new Date(attempt.submittedAt).toLocaleDateString('fa-IR')}`
                                                : `شروع شده در ${new Date(attempt.startedAt).toLocaleDateString('fa-IR')}`
                                            }
                                        </p>
                                    </div>
                                    <div className="text-left">
                                        {attempt.status === "COMPLETED" ? (
                                            <Badge variant={attempt.score! >= 70 ? "default" : "destructive"} className="bg-emerald-50 text-emerald-700 border-emerald-100">
                                                {attempt.score}%
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">
                                                در حال انجام
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {exam.examAttempts.length > 10 && (
                                <div className="text-center text-muted-foreground">
                                    و {exam.examAttempts.length - 10} نتیجه دیگر...
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <Link href={`/teacher/exams/${exam.id}/edit`}>
                            <Button>
                                ویرایش آزمون
                            </Button>
                        </Link>
                        <Button variant="outline">
                            مشاهده آمار
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
