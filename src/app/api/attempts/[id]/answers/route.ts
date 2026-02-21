import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { CorrectAnswer } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { answers } = body;

    // Verify attempt belongs to user
    const attempt = await db.examAttempt.findUnique({
      where: { id },
    });

    if (!attempt || attempt.userId !== session.user.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    if (attempt.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "آزمون فعال نیست" },
        { status: 400 }
      );
    }

    // Save/update answers
    for (const [questionId, selectedAnswer] of Object.entries(answers)) {
      const question = await db.question.findUnique({
        where: { id: questionId },
      });

      if (!question) continue;

      const isCorrect = question.correctAnswer === selectedAnswer;

      const existingAnswer = await db.examAnswer.findFirst({
        where: {
          attemptId: id,
          questionId,
        },
      });

      if (existingAnswer) {
        await db.examAnswer.update({
          where: { id: existingAnswer.id },
          data: {
            selectedAnswer: selectedAnswer as CorrectAnswer,
            isCorrect,
          },
        });
      } else {
        await db.examAnswer.create({
          data: {
            attemptId: id,
            questionId,
            selectedAnswer: selectedAnswer as CorrectAnswer,
            isCorrect,
          },
        });
      }
    }

    return NextResponse.json({ message: "پاسخ‌ها ذخیره شد" });
  } catch (error) {
    console.error("Error saving answers:", error);
    return NextResponse.json(
      { error: "خطا در ذخیره پاسخ‌ها" },
      { status: 500 }
    );
  }
}

