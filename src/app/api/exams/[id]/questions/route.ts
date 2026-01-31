import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { SelectionMode, CorrectAnswer } from "@/generated";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await db.exam.findUnique({
      where: { id },
    });

    if (!exam || !exam.isActive) {
      return NextResponse.json({ error: "آزمون موجود نیست" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || exam.questionCount.toString());

    let questions: Array<{
      id: string;
      questionText: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: CorrectAnswer;
    }> = [];

    switch (exam.selectionMode) {
      case SelectionMode.YEAR:
        questions = await db.question.findMany({
          where: {
            isActive: true,
            year: exam.year || undefined,
          },
          take: count,
        });
        break;

      case SelectionMode.JUZ:
        questions = await db.question.findMany({
          where: {
            isActive: true,
            juz: exam.juz || undefined,
          },
          take: count,
        });
        break;

      case SelectionMode.RANDOM:
        // Get random questions
        const allQuestions = await db.question.findMany({
          where: {
            isActive: true,
          },
        });

        // Shuffle and take count
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        questions = shuffled.slice(0, Math.min(count, shuffled.length));
        break;

      default:
        questions = [];
    }

    // Remove correct answer from response (for security)
    const questionsWithoutAnswers = questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer, // Keep for validation on server
    }));

    return NextResponse.json(questionsWithoutAnswers);
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سوالات" },
      { status: 500 }
    );
  }
}

