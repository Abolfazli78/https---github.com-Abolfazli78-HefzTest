import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await db.officialExam.findUnique({
      where: { id },
      include: {
        questions: {
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
                year: true,
                juz: true,
                questionKind: true,
              },
            },
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Get official exam error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آزمون" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await db.officialExam.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.year !== undefined) data.year = Number(body.year);
    if (body.degree !== undefined) data.degree = Number(body.degree);
    if (body.juzStart !== undefined) data.juzStart = Number(body.juzStart);
    if (body.juzEnd !== undefined) data.juzEnd = Number(body.juzEnd);
    if (body.durationMinutes !== undefined) data.durationMinutes = Number(body.durationMinutes);
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

    const exam = await db.officialExam.update({
      where: { id },
      data: data as Parameters<typeof db.officialExam.update>[0]["data"],
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Update official exam error:", error);
    return NextResponse.json(
      { error: "خطا در بروزرسانی آزمون" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    await db.officialExam.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete official exam error:", error);
    return NextResponse.json(
      { error: "خطا در حذف آزمون" },
      { status: 500 }
    );
  }
}
