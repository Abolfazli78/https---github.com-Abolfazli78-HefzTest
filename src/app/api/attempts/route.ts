import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const { examId, questionCount } = body;

    if (!examId || !questionCount) {
      return NextResponse.json(
        { error: "شناسه آزمون و تعداد سوالات الزامی است" },
        { status: 400 }
      );
    }

    // Check if user has an active attempt
    const activeAttempt = await db.examAttempt.findFirst({
      where: {
        userId: session.user.id,
        examId,
        status: "IN_PROGRESS",
      },
    });

    if (activeAttempt) {
      return NextResponse.json(activeAttempt);
    }

    // Get exam to get duration and endAt
    const exam = await db.exam.findUnique({
      where: { id: examId },
      select: { duration: true, endAt: true },
    });

    if (!exam) {
      return NextResponse.json({ error: "آزمون موجود نیست" }, { status: 404 });
    }

    // If exam has expired endAt, block
    if (exam.endAt && new Date() > new Date(exam.endAt)) {
      return NextResponse.json({ error: "مهلت شرکت در این آزمون به پایان رسیده است" }, { status: 403 });
    }

    // Create new attempt
    const attempt = await db.examAttempt.create({
      data: {
        userId: session.user.id,
        examId,
        totalQuestions: questionCount,
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      id: attempt.id,
      duration: exam.duration,
    });
  } catch (error) {
    console.error("Error creating attempt:", error);
    return NextResponse.json(
      { error: "خطا در شروع آزمون" },
      { status: 500 }
    );
  }
}

