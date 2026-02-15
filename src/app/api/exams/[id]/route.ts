import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { canUserAccessExam } from "@/lib/exam-access";
import { db } from "@/lib/db";
import { AccessLevel, SelectionMode } from "@prisma/client";
import type { CorrectAnswer } from "@prisma/client";
import type { Prisma } from "@prisma/client";

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
      include: {
        _count: {
          select: { questions: true, examAttempts: true },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "آزمون موجود نیست" }, { status: 404 });
    }

    // Check if user has access to this exam
    const hasAccess = await canUserAccessExam(session.user.id, id);
    if (!hasAccess) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آزمون" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      duration,
      questionCount,
      accessLevel,
      selectionMode,
      year,
      juz,
      isActive,
      endAt,
    } = body;

    // permission: admin or owner
    const existing = await db.exam.findUnique({ where: { id }, select: { createdById: true } });
    if (!existing) {
      return NextResponse.json({ error: "آزمون موجود نیست" }, { status: 404 });
    }
    const isOwner = existing.createdById === session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 403 });
    }

    // validate optional endAt
    let endAtDate: Date | null | undefined = undefined;
    if (typeof endAt !== 'undefined') {
      if (endAt === null || endAt === "") {
        endAtDate = null;
      } else {
        const parsed = new Date(endAt);
        if (isNaN(parsed.getTime())) {
          return NextResponse.json({ error: "فرمت تاریخ پایان معتبر نیست" }, { status: 400 });
        }
        if (parsed <= new Date()) {
          return NextResponse.json({ error: "تاریخ پایان باید در آینده باشد" }, { status: 400 });
        }
        if (!isAdmin) {
          const activeSub = await db.subscription.findFirst({
            where: {
              userId: session.user.id,
              status: "ACTIVE",
              OR: [
                { endDate: null },
                { endDate: { gt: new Date() } },
              ],
            },
          });
          if (!activeSub) {
            return NextResponse.json({ error: "برای تعیین مهلت پایان آزمون، نیاز به اشتراک فعال دارید" }, { status: 402 });
          }
        }
        endAtDate = parsed;
      }
    }

    // Check if selection criteria changed (regenerate questions if needed)
    const currentExam = await db.exam.findUnique({
      where: { id },
      select: { selectionMode: true, year: true, juz: true, questionCount: true }
    });

    const criteriaChanged = 
      currentExam?.selectionMode !== selectionMode ||
      currentExam?.year !== (year ? parseInt(year) : null) ||
      currentExam?.juz !== (juz ? parseInt(juz) : null) ||
      currentExam?.questionCount !== (questionCount ? parseInt(questionCount) : undefined);

    type BankQuestion = {
      questionText: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: CorrectAnswer;
      explanation: string | null;
      year: number | null;
      juz: number | null;
      topic: string | null;
      difficultyLevel: string | null;
    };

    let selectedQuestions: BankQuestion[] = [];

    if (criteriaChanged) {
      // Generate new questions from question bank
      const whereClause: Prisma.QuestionWhereInput = { isActive: true };
      
      if (selectionMode === SelectionMode.YEAR && year) {
        whereClause.year = parseInt(year);
      } else if (selectionMode === SelectionMode.JUZ && juz) {
        whereClause.juz = parseInt(juz);
      }

      const questions = await db.question.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        select: {
          questionText: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          correctAnswer: true,
          explanation: true,
          year: true,
          juz: true,
          topic: true,
          difficultyLevel: true,
        },
      });

      if (questions.length === 0) {
        return NextResponse.json(
          { error: "هیچ سوالی در بانک سوالات با معیارهای مشخص شده یافت نشد" },
          { status: 400 }
        );
      }

      const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
      selectedQuestions = shuffledQuestions.slice(0, Math.min(questionCount ? parseInt(questionCount) : currentExam?.questionCount || 50, questions.length));

      if (selectedQuestions.length === 0) {
        return NextResponse.json(
          { error: "نمی‌توان سوالاتی را برای این آزمون انتخاب کرد" },
          { status: 400 }
        );
      }
    }

    const exam = await db.exam.update({
      where: { id },
      data: {
        title,
        description,
        duration: duration ? parseInt(duration) : undefined,
        questionCount: questionCount ? parseInt(questionCount) : undefined,
        accessLevel: accessLevel as AccessLevel,
        selectionMode: selectionMode as SelectionMode,
        year: year ? parseInt(year) : null,
        juz: juz ? parseInt(juz) : null,
        isActive,
        endAt: endAtDate,
        ...(criteriaChanged && {
          questions: {
            deleteMany: {}, // Remove existing questions
            create: selectedQuestions.map(q => ({
              questionText: q.questionText,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              year: q.year,
              juz: q.juz,
              topic: q.topic,
              difficultyLevel: q.difficultyLevel,
              isActive: true,
            }))
          }
        })
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Error updating exam:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی آزمون" },
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

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.exam.findUnique({ where: { id }, select: { createdById: true } });
    if (!existing) {
      return NextResponse.json({ error: "آزمون موجود نیست" }, { status: 404 });
    }
    const isOwner = existing.createdById === session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 403 });
    }

    await db.exam.delete({
      where: { id },
    });

    return NextResponse.json({ message: "آزمون با موفقیت حذف شد" });
  } catch (error) {
    console.error("Error deleting exam:", error);
    return NextResponse.json(
      { error: "خطا در حذف آزمون" },
      { status: 500 }
    );
  }
}

