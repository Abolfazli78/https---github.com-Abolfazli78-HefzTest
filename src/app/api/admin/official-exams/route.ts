import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const exams = await db.officialExam.findMany({
      include: {
        _count: { select: { questions: true } },
      },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("Official exams list error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آزمون‌های رسمی" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      year,
      degree,
      juzStart,
      juzEnd,
      durationMinutes,
    } = body as {
      title: string;
      year: number;
      degree: number;
      juzStart: number;
      juzEnd: number;
      durationMinutes: number;
    };

    if (!title?.trim() || year == null || degree == null || juzStart == null || juzEnd == null || durationMinutes == null) {
      return NextResponse.json(
        { error: "عنوان، سال، مقطع، بازه جزء و مدت زمان الزامی است" },
        { status: 400 }
      );
    }

    const start = Math.min(juzStart, juzEnd);
    const end = Math.max(juzStart, juzEnd);
    const juzCount = end - start + 1;
    const questionsPerJuz = 2 + 3; // 2 MEMORIZATION + 3 CONCEPTS
    const totalQuestions = juzCount * questionsPerJuz;

    const exam = await db.officialExam.create({
      data: {
        title: title.trim(),
        year: Number(year),
        degree: Number(degree),
        juzStart: start,
        juzEnd: end,
        durationMinutes: Number(durationMinutes),
        totalQuestions,
        isActive: true,
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error("Create official exam error:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد آزمون رسمی" },
      { status: 500 }
    );
  }
}
