import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Search, UserPlus, BarChart3, Mail } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function InstituteTeachersPage() {
    const session = await getServerSession();
    if (!session) return null;

    const teachers = await db.user.findMany({
        where: { instituteId: session.user.id },
        include: {
            _count: {
                select: { students: true, createdExams: true }
            }
        },
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">معلمان موسسه</h1>
                    <p className="text-muted-foreground">نظارت و مدیریت کادر آموزشی موسسه شما</p>
                </div>
                <Link href="/institute/teachers/add">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <UserPlus className="ml-2 h-4 w-4" />
                        افزودن معلم جدید
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle>لیست معلمان ({teachers.length})</CardTitle>
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
                                <TableHead className="text-right">نام معلم</TableHead>
                                <TableHead className="text-right">ایمیل</TableHead>
                                <TableHead className="text-center">تعداد دانش‌آموزان</TableHead>
                                <TableHead className="text-center">آزمون‌های طراحی شده</TableHead>
                                <TableHead className="text-center">وضعیت</TableHead>
                                <TableHead className="text-left">عملیات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        هنوز معلمی برای موسسه شما ثبت نشده است.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                teachers.map((teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                                                </div>
                                                {teacher.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500" dir="ltr">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {teacher.email}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-bold">{teacher._count.students}</TableCell>
                                        <TableCell className="text-center">{teacher._count.createdExams}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={teacher.isActive ? "outline" : "secondary"} className={teacher.isActive ? "text-indigo-600 border-indigo-200 bg-indigo-50" : ""}>
                                                {teacher.isActive ? "فعال" : "غیرفعال"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-left">
                                            <Link href={`/institute/teachers/${teacher.id}`}>
                                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                    <BarChart3 className="ml-2 h-4 w-4" />
                                                    ارزیابی عملکرد
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
