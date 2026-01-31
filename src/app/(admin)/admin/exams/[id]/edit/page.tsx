import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ExamForm } from "@/components/admin/exam-form";

export default async function EditExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;
  const examData = await db.exam.findUnique({
    where: { id },
  });

  if (!examData) {
    redirect("/admin/exams");
  }

  // Transform null to undefined for the form
  const exam = {
    id: examData.id,
    title: examData.title,
    description: examData.description ?? undefined,
    duration: examData.duration,
    questionCount: examData.questionCount,
    accessLevel: examData.accessLevel,
    selectionMode: examData.selectionMode,
    year: examData.year ?? undefined,
    juz: examData.juz ?? undefined,
    isActive: examData.isActive,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ویرایش آزمون</h1>
        <p className="text-muted-foreground">ویرایش اطلاعات آزمون</p>
      </div>

      <ExamForm exam={exam} />
    </div>
  );
}

