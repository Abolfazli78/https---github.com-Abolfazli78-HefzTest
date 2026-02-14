import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { CorrectAnswer } from "@/generated";

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
    const question = await db.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json({ error: "سوال موجود نیست" }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سوال" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
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
      questionKind,
      isActive,
    } = body;

    const question = await db.question.update({
      where: { id },
      data: {
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
        questionKind: questionKind ?? "CONCEPTS",
        isActive,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی سوال" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    await db.question.delete({
      where: { id },
    });

    return NextResponse.json({ message: "سوال با موفقیت حذف شد" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "خطا در حذف سوال" },
      { status: 500 }
    );
  }
}

