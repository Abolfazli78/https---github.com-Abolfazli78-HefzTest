import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ExamForm } from "@/components/admin/exam-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteExamButton from "@/components/teacher/delete-exam-button";

export default async function InstituteEditExamPage(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session || session.user.role !== "INSTITUTE") {
    redirect("/login");
  }

  const { id } = await props.params;
  const exam = await db.exam.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      questionCount: true,
      accessLevel: true,
      selectionMode: true,
      year: true,
      juz: true,
      isActive: true,
      createdById: true,
      endAt: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          instituteId: true,
        }
      }
    },
  });

  if (!exam || exam.createdBy?.instituteId !== session.user.id) {
    redirect("/institute/exams");
  }

  const formExam = {
    id: exam.id,
    title: exam.title,
    description: exam.description ?? undefined,
    duration: exam.duration,
    questionCount: exam.questionCount,
    accessLevel: exam.accessLevel,
    selectionMode: exam.selectionMode,
    year: exam.year ?? undefined,
    juz: exam.juz ?? undefined,
    isActive: exam.isActive,
    endAt: exam.endAt,
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">ویرایش آزمون موسسه</h1>
          <p className="text-muted-foreground">اطلاعات آزمون را ویرایش کنید. برای حذف از دکمه زیر استفاده کنید.</p>
        </div>
        <DeleteExamButton examId={exam.id} redirectTo="/institute/exams" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فرم ویرایش</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamForm exam={formExam} redirectPath="/institute/exams" />
        </CardContent>
      </Card>
    </div>
  );
}
