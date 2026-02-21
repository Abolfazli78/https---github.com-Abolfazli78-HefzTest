import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

/**
 * GET /api/user-exams/[id]/questions
 * Get questions for a user exam (only owner can load).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await db.userExam.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!exam) {
      return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
    }

    const rows = await db.userExamQuestion.findMany({
      where: { userExamId: id },
      orderBy: { order: "asc" },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            correctAnswer: true,
          },
        },
      },
    });

    const questions = rows.map((r) => ({
      userExamQuestionId: r.id,
      order: r.order,
      juz: r.juz,
      questionKind: r.questionKind,
      ...r.question,
    }));

    return NextResponse.json({
      questions,
      durationMinutes: exam.durationMinutes,
      title: exam.title,
    });
  } catch (error) {
    console.error("Get user exam questions error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سوالات" },
      { status: 500 }
    );
  }
}
