import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SelectionMode } from "@/generated";

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;

  const exam = await db.exam.findUnique({
    where: { id },
    include: {
      _count: {
        select: { questions: true, examAttempts: true },
      },
    },
  });

  if (!exam) {
    redirect("/admin/exams");
  }

  const getSelectionModeLabel = (mode: SelectionMode) => {
    switch (mode) {
      case "YEAR":
        return "بر اساس سال";
      case "JUZ":
        return "بر اساس جزء";
      case "RANDOM":
        return "تصادفی";
      default:
        return mode;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
          <p className="text-muted-foreground">جزئیات آزمون</p>
        </div>
        <Link href={`/admin/exams/${exam.id}/edit`}>
          <Button>ویرایش</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات کلی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">عنوان</p>
                <p className="font-semibold">{exam.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">مدت زمان</p>
                <p className="font-semibold">{exam.duration} دقیقه</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تعداد سوالات</p>
                <p className="font-semibold">{exam.questionCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نوع انتخاب</p>
                <p className="font-semibold">
                  {getSelectionModeLabel(exam.selectionMode)}
                  {exam.year && ` (${exam.year})`}
                  {exam.juz && ` (جزء ${exam.juz})`}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">سطح دسترسی</p>
                <Badge variant={exam.accessLevel === "FREE" ? "default" : "secondary"}>
                  {exam.accessLevel === "FREE" ? "رایگان" : "اشتراکی"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">وضعیت</p>
                <Badge variant={exam.isActive ? "default" : "secondary"}>
                  {exam.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
            </div>
            {exam.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">توضیحات</p>
                <p className="arabic-text">{exam.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آمار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">سوالات موجود</p>
                <p className="text-2xl font-bold">{exam._count.questions}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تعداد آزمون‌ها</p>
                <p className="text-2xl font-bold">{exam._count.examAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link href="/admin/exams">
            <Button variant="outline">بازگشت به لیست</Button>
          </Link>
          <Link href={`/admin/exams/${exam.id}/edit`}>
            <Button>ویرایش آزمون</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

