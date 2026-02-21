import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { CorrectAnswer } from "@prisma/client";
import { updateLeaderboard } from "@/lib/leaderboard";

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
      include: {
        exam: true,
      },
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

    // Save all answers
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    // Process submitted answers
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

      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    // Count unanswered questions
    unansweredCount = attempt.totalQuestions - Object.keys(answers).length;

    // Calculate score
    const score = correctCount;
    const timeSpent = Math.floor(
      (Date.now() - attempt.startedAt.getTime()) / 1000
    );

    // Update attempt
    await db.examAttempt.update({
      where: { id },
      data: {
        status: "COMPLETED",
        submittedAt: new Date(),
        timeSpent,
        score,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        unanswered: unansweredCount,
      },
    });

    // Update leaderboard
    await updateLeaderboard(session.user.id, attempt.examId, score);

    return NextResponse.json({
      message: "آزمون با موفقیت ارسال شد",
      score,
      totalQuestions: attempt.totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unanswered: unansweredCount,
    });
  } catch (error) {
    console.error("Error submitting attempt:", error);
    return NextResponse.json(
      { error: "خطا در ارسال آزمون" },
      { status: 500 }
    );
  }
}

