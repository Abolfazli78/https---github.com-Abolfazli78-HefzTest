import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { QuestionForm } from "@/components/admin/question-form";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;
  const questionData = await db.question.findUnique({
    where: { id },
  });

  if (!questionData) {
    redirect("/admin/questions");
  }

  // Transform null to undefined for the form
  const question = {
    id: questionData.id,
    questionText: questionData.questionText,
    optionA: questionData.optionA,
    optionB: questionData.optionB,
    optionC: questionData.optionC,
    optionD: questionData.optionD,
    correctAnswer: questionData.correctAnswer,
    explanation: questionData.explanation ?? undefined,
    year: questionData.year ?? undefined,
    juz: questionData.juz ?? undefined,
    topic: questionData.topic ?? undefined,
    difficultyLevel: questionData.difficultyLevel ?? undefined,
    isActive: questionData.isActive,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ویرایش سوال</h1>
        <p className="text-muted-foreground">ویرایش اطلاعات سوال</p>
      </div>

      <QuestionForm question={question} />
    </div>
  );
}

