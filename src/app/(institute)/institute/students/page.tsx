import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function InstituteStudentsPage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "INSTITUTE") {
    redirect("/login");
  }

  const students = await db.user.findMany({
    where: {
      role: "STUDENT",
      OR: [
        { instituteId: session.user.id },
        { parentId: session.user.id },
        { teacher: { instituteId: session.user.id } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      teacher: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">دانش‌آموزان موسسه</h1>
        <p className="text-muted-foreground">لیست کلیه دانش‌آموزان زیرمجموعه موسسه شما</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست دانش‌آموزان</CardTitle>
          <CardDescription>تعداد: {students.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">دانش‌آموزی یافت نشد</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">ایمیل</TableHead>
                  <TableHead className="text-right">معلم</TableHead>
                  <TableHead className="text-right">تاریخ عضویت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell dir="ltr">{s.email}</TableCell>
                    <TableCell>
                      {s.teacher ? (
                        <Badge variant="outline">{s.teacher.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(s.createdAt as unknown as string).toLocaleDateString("fa-IR")}
                    </TableCell>
                    <TableCell>
                      <Link href={`/institute/students/${s.id}`}>
                        <Button variant="outline" size="sm">
                          <BarChart2 className="ml-2 h-4 w-4" />
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
    </div>
  );
}
