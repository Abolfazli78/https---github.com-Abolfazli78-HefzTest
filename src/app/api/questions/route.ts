import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { CorrectAnswer, Prisma } from "@/generated/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const juz = searchParams.get("juz");
    const topic = searchParams.get("topic");

    const where: Prisma.QuestionWhereInput = {};

    if (year) {
      where.year = parseInt(year);
    }

    if (juz) {
      where.juz = parseInt(juz);
    }

    if (topic) {
      where.topic = topic;
    }

    const questions = await db.question.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 1000,
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سوالات" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const {
      examId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
      year,
      juz,
      topic,
      difficultyLevel,
    } = body;

    if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return NextResponse.json(
        { error: "همه فیلدها الزامی است" },
        { status: 400 }
      );
    }

    const question = await db.question.create({
      data: {
        examId: examId || null,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer: correctAnswer as CorrectAnswer,
        explanation: explanation || null,
        year: year ? parseInt(year) : null,
        juz: juz ? parseInt(juz) : null,
        topic: topic || null,
        difficultyLevel: difficultyLevel || null,
        isActive: true,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد سوال" },
      { status: 500 }
    );
  }
}

