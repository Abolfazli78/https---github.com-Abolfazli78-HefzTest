import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Calendar, Mail, Phone, BookOpen, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default async function InstituteTeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession();
    if (!session || session.user.role !== "INSTITUTE") {
        redirect("/login");
    }

    const { id } = await params;

    // Get teacher details with their students and exam statistics
    const teacher = await db.user.findFirst({
        where: { 
            id,
            role: "TEACHER",
            instituteId: session.user.id,
        },
        include: {
            students: {
                include: {
                    _count: {
                        select: { examAttempts: true }
                    },
                    examAttempts: {
                        where: { status: "COMPLETED" },
                        orderBy: { submittedAt: "desc" },
                        take: 1,
                        select: { score: true, submittedAt: true }
                    }
                },
                orderBy: { name: "asc" }
            },
            createdExams: {
                include: {
                    _count: {
                        select: { examAttempts: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            },
            _count: {
                select: { 
                    students: true,
                    createdExams: true
                }
            }
        }
    });

    if (!teacher) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/institute/teachers">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="ml-2 h-4 w-4" />
                            بازگشت به لیست
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardContent className="text-center py-10">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">معلم یافت نشد</h2>
                        <p className="text-muted-foreground mb-4">
                            معلم مورد نظر وجود ندارد یا تحت مدیریت موسسه شما نیست.
                        </p>
                        <Link href="/institute/teachers">
                            <Button>
                                بازگشت به لیست معلمان
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Calculate teacher statistics
    const totalExamAttempts = teacher.createdExams.reduce((sum, exam) => sum + exam._count.examAttempts, 0);
    const activeStudents = teacher.students.filter(student => student.isActive).length;
    
    // Calculate student performance statistics
    const studentsWithScores = teacher.students.filter(student => student.examAttempts.length > 0);
    const averageStudentScore = studentsWithScores.length > 0
        ? studentsWithScores.reduce((sum, student) => sum + (student.examAttempts[0]?.score || 0), 0) / studentsWithScores.length
        : 0;

    const highPerformers = teacher.students.filter(student => 
        student.examAttempts.length > 0 && (student.examAttempts[0]?.score || 0) >= 80
    ).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/institute/teachers">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="ml-2 h-4 w-4" />
                        بازگشت به لیست
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{teacher.name}</h1>
                        <p className="text-muted-foreground">{teacher.email}</p>
                    </div>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    معلم
                </Badge>
            </div>

            {/* Teacher Info */}
            <Card>
                <CardHeader>
                    <CardTitle>اطلاعات تماس</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{teacher.email}</span>
                        </div>
                        {teacher.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span dir="ltr">{teacher.phone}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>عضو depuis {new Date(teacher.createdAt).toLocaleDateString('fa-IR')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant={teacher.isActive ? "outline" : "secondary"} className={teacher.isActive ? "text-emerald-600 border-emerald-200 bg-emerald-50" : ""}>
                                {teacher.isActive ? "فعال" : "غیرفعال"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            تعداد دانش‌آموزان
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacher._count.students}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {activeStudents} فعال • {teacher._count.students - activeStudents} غیرفعال
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            آزمون‌های ایجاد شده
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teacher._count.createdExams}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {totalExamAttempts} بار شرکت شده
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            میانگین نمره دانش‌آموزان
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageStudentScore.toFixed(1)}%</div>
                        <Progress value={averageStudentScore} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            دانش‌آموزان ممتاز
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{highPerformers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            نمره 80% و بالاتر
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Students List */}
            <Card>
                <CardHeader>
                    <CardTitle>لیست دانش‌آموزان ({teacher.students.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {teacher.students.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            این معلم هنوز دانش‌آموزی ندارد.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">نام دانش‌آموز</TableHead>
                                    <TableHead className="text-right">ایمیل</TableHead>
                                    <TableHead className="text-center">تعداد آزمون‌ها</TableHead>
                                    <TableHead className="text-center">آخرین نمره</TableHead>
                                    <TableHead className="text-center">وضعیت</TableHead>
                                    <TableHead className="text-left">عملیات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teacher.students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell dir="ltr">{student.email}</TableCell>
                                        <TableCell className="text-center">{student._count.examAttempts}</TableCell>
                                        <TableCell className="text-center">
                                            {student.examAttempts[0] ? (
                                                <Badge variant={student.examAttempts[0].score! >= 70 ? "default" : "destructive"} className="bg-emerald-50 text-emerald-700 border-emerald-100">
                                                    {student.examAttempts[0].score}%
                                                </Badge>
                                            ) : (
                                                <span className="text-slate-400 text-xs">بدون آزمون</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={student.isActive ? "outline" : "secondary"} className={student.isActive ? "text-emerald-600 border-emerald-200 bg-emerald-50" : ""}>
                                                {student.isActive ? "فعال" : "غیرفعال"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-left">
                                            <Link href={`/institute/students/${student.id}`}>
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    مشاهده عملکرد
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Recent Exams */}
            {teacher.createdExams.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>آزمون‌های اخیر ({teacher.createdExams.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {teacher.createdExams.slice(0, 5).map((exam) => (
                                <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{exam.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {exam.questionCount} سوال • {exam.duration} دقیقه • {exam._count.examAttempts} بار شرکت شده
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        {new Date(exam.createdAt).toLocaleDateString('fa-IR')}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                        {teacher.createdExams.length > 5 && (
                            <div className="text-center mt-4">
                                <Button variant="outline" size="sm">
                                    مشاهده همه آزمون‌ها
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
