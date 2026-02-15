import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CorrectAnswer } from "@prisma/client";
import { RenderText } from "@/components/RenderText";

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;

  const question = await db.question.findUnique({
    where: { id },
  });

  if (!question) {
    redirect("/admin/questions");
  }

  const getAnswerLabel = (answer: CorrectAnswer) => {
    const labels = {
      A: "الف",
      B: "ب",
      C: "ج",
      D: "د",
    };
    return labels[answer];
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">جزئیات سوال</h1>
          <p className="text-muted-foreground">مشاهده و مدیریت سوال</p>
        </div>
        <Link href={`/admin/questions/${question.id}/edit`}>
          <Button>ویرایش</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>متن سوال</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4"><RenderText text={question.questionText} /></p>

            <div className="space-y-3">
              <div className={`p-3 rounded-lg border ${question.correctAnswer === CorrectAnswer.A ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-muted"}`}>
                <span className="font-semibold">الف) </span>
                <RenderText text={question.optionA} />
                {question.correctAnswer === CorrectAnswer.A && (
                  <Badge className="mr-2" variant="default">صحیح</Badge>
                )}
              </div>
              <div className={`p-3 rounded-lg border ${question.correctAnswer === CorrectAnswer.B ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-muted"}`}>
                <span className="font-semibold">ب) </span>
                <RenderText text={question.optionB} />
                {question.correctAnswer === CorrectAnswer.B && (
                  <Badge className="mr-2" variant="default">صحیح</Badge>
                )}
              </div>
              <div className={`p-3 rounded-lg border ${question.correctAnswer === CorrectAnswer.C ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-muted"}`}>
                <span className="font-semibold">ج) </span>
                <RenderText text={question.optionC} />
                {question.correctAnswer === CorrectAnswer.C && (
                  <Badge className="mr-2" variant="default">صحیح</Badge>
                )}
              </div>
              <div className={`p-3 rounded-lg border ${question.correctAnswer === CorrectAnswer.D ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-muted"}`}>
                <span className="font-semibold">د) </span>
                <RenderText text={question.optionD} />
                {question.correctAnswer === CorrectAnswer.D && (
                  <Badge className="mr-2" variant="default">صحیح</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {question.explanation && (
          <Card>
            <CardHeader>
              <CardTitle>توضیح</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="arabic-text">{question.explanation}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>اطلاعات اضافی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">پاسخ صحیح</p>
                <Badge variant="default" className="mt-1">{getAnswerLabel(question.correctAnswer)}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">وضعیت</p>
                <Badge variant={question.isActive ? "default" : "secondary"} className="mt-1">
                  {question.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
              {question.year && (
                <div>
                  <p className="text-sm text-muted-foreground">سال</p>
                  <p className="font-semibold">{question.year}</p>
                </div>
              )}
              {question.juz && (
                <div>
                  <p className="text-sm text-muted-foreground">جزء</p>
                  <p className="font-semibold">جزء {question.juz}</p>
                </div>
              )}
              {question.topic && (
                <div>
                  <p className="text-sm text-muted-foreground">موضوع</p>
                  <p className="font-semibold">{question.topic}</p>
                </div>
              )}
              {question.difficultyLevel && (
                <div>
                  <p className="text-sm text-muted-foreground">سطح دشواری</p>
                  <p className="font-semibold">{question.difficultyLevel}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link href="/admin/questions">
            <Button variant="outline">بازگشت به لیست</Button>
          </Link>
          <Link href={`/admin/questions/${question.id}/edit`}>
            <Button>ویرایش سوال</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

