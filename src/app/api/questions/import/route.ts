import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ParsedQuestion } from "@/types";
import { CorrectAnswer } from "@/generated";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const { questions } = body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "سوالی برای واردات وجود ندارد" },
        { status: 400 }
      );
    }

    // Validate questions
    const validQuestions = questions.filter((q: ParsedQuestion) => {
      return (
        q.questionText &&
        q.optionA &&
        q.optionB &&
        q.optionC &&
        q.optionD &&
        q.correctAnswer
      );
    });

    if (validQuestions.length === 0) {
      return NextResponse.json(
        { error: "سوال معتبری برای واردات وجود ندارد" },
        { status: 400 }
      );
    }

    // Create questions in database
    const createdQuestions = await db.question.createMany({
      data: validQuestions.map((q: ParsedQuestion) => ({
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer as CorrectAnswer,
        explanation: q.explanation || null,
        year: q.year || null,
        juz: q.juz || null,
        topic: q.topic || null,
        difficultyLevel: q.difficultyLevel || null,
        isActive: true,
      })),
    });

    return NextResponse.json({
      message: `${createdQuestions.count} سوال با موفقیت وارد شد`,
      count: createdQuestions.count,
    });
  } catch (error) {
    console.error("Error importing questions:", error);
    return NextResponse.json(
      { error: "خطا در واردات سوالات" },
      { status: 500 }
    );
  }
}

