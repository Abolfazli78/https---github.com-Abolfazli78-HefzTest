import { getServerSession } from "@/lib/session";
import { getAccessibleExams } from "@/lib/exam-access";
import { parseDescription } from "@/lib/exam-utils";
import { UserRole } from "@/generated";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, BookOpen, Clock, Users, Edit, Eye } from "lucide-react";
import Link from "next/link";

export default async function InstituteExamsPage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "INSTITUTE") return null;

  const exams = await getAccessibleExams(session.user.id, UserRole.INSTITUTE);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">آزمون‌های موسسه</h1>
          <p className="text-muted-foreground">مدیریت آزمون‌های ایجادشده توسط شما برای موسسه</p>
        </div>
        <Link href="/institute/exams/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="ml-2 h-4 w-4" />
            ایجاد آزمون جدید
          </Button>
        </Link>
      </div>

      {exams.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold">هنوز آزمونی ایجاد نکرده‌اید</h3>
            <p className="text-muted-foreground max-w-xs">اولین آزمون موسسه خود را ایجاد کنید.</p>
            <Link href="/institute/exams/new">
              <Button variant="outline" className="mt-2">ایجاد اولین آزمون</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam: any) => (
            <Card key={exam.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-600" />
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={exam.isActive ? "default" : "secondary"} className={exam.isActive ? "bg-indigo-50 text-indigo-700 border-indigo-100" : ""}>
                    {exam.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {exam.duration} دقیقه
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors line-clamp-1">{exam.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2 h-10">{parseDescription(exam.description)}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">ایجاد شده توسط:</span>
                  <span className="text-xs font-medium text-indigo-600">{exam.createdBy?.name || "ناشناس"}</span>
                </div>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    {exam._count.questions} سوال
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    {exam._count.examAttempts} شرکت‌کننده
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                  <Link href={`/institute/exams/${exam.id}/edit`}>
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Edit className="h-3 w-3" />
                      ویرایش
                    </Button>
                  </Link>
                  <Link href={`/institute/exams/${exam.id}`}>
                    <Button variant="ghost" size="sm" className="w-full gap-1 text-blue-600">
                      <Eye className="h-3 w-3" />
                      جزئیات
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
