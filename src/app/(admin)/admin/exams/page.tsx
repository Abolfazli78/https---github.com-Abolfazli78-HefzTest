import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { getAccessibleExams } from "@/lib/exam-access";
import { UserRole } from "@prisma/client";
import { ExamsTable } from "@/components/admin/exams-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ExamsPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const examsData = await getAccessibleExams(session.user.id, UserRole.ADMIN);

  // Transform null to undefined for the component
  const exams = examsData.map((exam: any) => ({
    ...exam,
    description: exam.description ?? undefined,
    year: exam.year ?? undefined,
    juz: exam.juz ?? undefined,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">مدیریت آزمون‌ها</h1>
          <p className="text-muted-foreground">ایجاد و مدیریت آزمون‌ها</p>
        </div>
        <Link href="/admin/exams/new">
          <Button>ایجاد آزمون جدید</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست آزمون‌ها</CardTitle>
          <CardDescription>
            مجموع آزمون‌ها: {exams.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExamsTable exams={exams} />
        </CardContent>
      </Card>
    </div>
  );
}

