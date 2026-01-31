import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Search, UserPlus, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function TeacherStudentsPage() {
    const session = await getServerSession();
    if (!session) return null;

    const students = await db.user.findMany({
        where: { teacherId: session.user.id },
        include: {
            _count: {
                select: { examAttempts: true }
            },
            examAttempts: {
                orderBy: { submittedAt: "desc" },
                take: 1,
                select: { score: true, submittedAt: true }
            }
        },
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">دانش‌آموزان من</h1>
                    <p className="text-muted-foreground">مدیریت و مشاهده پیشرفت تحصیلی دانش‌آموزان اختصاصی شما</p>
                </div>
                <Link href="/teacher/students/add">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <UserPlus className="ml-2 h-4 w-4" />
                        افزودن دانش‌آموز جدید
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle>لیست دانش‌آموزان ({students.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="جستجوی نام یا ایمیل..." className="pr-10" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
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
                            {students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        هنوز دانش‌آموزی به شما اختصاص داده نشده است.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-slate-500" />
                                                </div>
                                                {student.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500" dir="ltr">{student.email}</TableCell>
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
                                            <Link href={`/teacher/students/${student.id}`}>
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <BarChart2 className="ml-2 h-4 w-4" />
                                                    مشاهده عملکرد
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
