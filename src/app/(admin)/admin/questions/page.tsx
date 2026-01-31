import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { QuestionsTable } from "@/components/admin/questions-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function QuestionsPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const questionsData = await db.question.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // Limit for performance
  });

  // Transform null to undefined for the component
  const questions = questionsData.map((q) => ({
    id: q.id,
    questionText: q.questionText,
    correctAnswer: q.correctAnswer,
    year: q.year ?? undefined,
    juz: q.juz ?? undefined,
    topic: q.topic ?? undefined,
    difficultyLevel: q.difficultyLevel ?? undefined,
    isActive: q.isActive,
    createdAt: q.createdAt,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">مدیریت سوالات</h1>
          <p className="text-muted-foreground">مدیریت و واردات سوالات</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/questions/import">
            <Button variant="outline">واردات از فایل</Button>
          </Link>
          <Link href="/admin/questions/new">
            <Button>افزودن سوال جدید</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست سوالات</CardTitle>
          <CardDescription>
            مجموع سوالات: {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionsTable questions={questions} />
        </CardContent>
      </Card>
    </div>
  );
}

