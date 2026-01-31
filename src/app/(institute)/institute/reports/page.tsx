import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, GraduationCap, School, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function InstituteReportsPage() {
    const session = await getServerSession();
    if (!session) return null;

    const teachers = await db.user.findMany({
        where: { instituteId: session.user.id },
        include: {
            _count: {
                select: { students: true }
            }
        }
    });

    const teacherIds = teachers.map(t => t.id);

    // Get all students belonging to these teachers
    const students = await db.user.findMany({
        where: { teacherId: { in: teacherIds } },
        select: { id: true }
    });

    const studentIds = students.map(s => s.id);

    const stats = await db.examAttempt.aggregate({
        where: {
            userId: { in: studentIds },
            status: "COMPLETED"
        },
        _avg: { score: true },
        _count: { id: true }
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">گزارش‌های مدیریتی موسسه</h1>
                <p className="text-muted-foreground">نظارت بر عملکرد کلی معلمان و دانش‌آموزان موسسه</p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card className="bg-white dark:bg-slate-900 border-0 shadow-md">
                    <CardHeader className="pb-2">
                        <CardDescription>تعداد معلمان</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-indigo-500" />
                            {teachers.length}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-0 shadow-md">
                    <CardHeader className="pb-2">
                        <CardDescription>کل دانش‌آموزان</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <Users className="h-6 w-6 text-blue-500" />
                            {studentIds.length}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-0 shadow-md">
                    <CardHeader className="pb-2">
                        <CardDescription>میانگین نمرات</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-emerald-500" />
                            {stats._avg.score ? Math.round(stats._avg.score) : 0}%
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-0 shadow-md">
                    <CardHeader className="pb-2">
                        <CardDescription>کل آزمون‌ها</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-amber-500" />
                            {stats._count.id}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <School className="h-5 w-5 text-indigo-500" />
                        عملکرد معلمان موسسه
                    </CardTitle>
                    <CardDescription>مقایسه فعالیت و نتایج دانش‌آموزان هر معلم</CardDescription>
                </CardHeader>
                <CardContent>
                    {teachers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">هنوز معلمی ثبت نشده است</p>
                            <p className="text-sm">برای مشاهده گزارش‌ها، ابتدا معلمان را به موسسه اضافه کنید.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-right">نام معلم</TableHead>
                                    <TableHead className="text-center">تعداد دانش‌آموزان</TableHead>
                                    <TableHead className="text-center">وضعیت فعالیت</TableHead>
                                    <TableHead className="text-left">آخرین فعالیت</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.map((teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="font-medium">{teacher.name}</TableCell>
                                        <TableCell className="text-center">{teacher._count.students}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="text-indigo-600 border-indigo-100 bg-indigo-50">
                                                {teacher.isActive ? "فعال" : "غیرفعال"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-left text-sm text-muted-foreground">
                                            {new Date(teacher.updatedAt).toLocaleDateString("fa-IR")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
