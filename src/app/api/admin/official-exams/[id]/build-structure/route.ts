import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { QuestionKind } from "@prisma/client";

const MEMORIZATION_PER_JUZ = 2;
const CONCEPTS_PER_JUZ = 3;

/**
 * Auto-fill official exam with questions:
 * For each juz in [juzStart, juzEnd]: 2 MEMORIZATION + 3 CONCEPTS, filtered by exam.year.
 * Order: HIFZ (MEMORIZATION) first, then CONCEPTS; order field increments.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await db.officialExam.findUnique({ where: { id } });
    if (!exam) {
      return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
    }

    const { year, juzStart, juzEnd } = exam;
    const start = Math.min(juzStart, juzEnd);
    const end = Math.max(juzStart, juzEnd);

    await db.officialExamQuestion.deleteMany({ where: { officialExamId: id } });

    const inserts: Array<{
      officialExamId: string;
      questionId: string;
      order: number;
      juz: number;
      questionKind: string;
    }> = [];
    let order = 0;

    for (let juz = start; juz <= end; juz++) {
      const mem = await db.question.findMany({
        where: {
          isActive: true,
          year,
          juz,
          questionKind: QuestionKind.MEMORIZATION,
        },
        select: { id: true },
        orderBy: { id: "asc" },
        take: MEMORIZATION_PER_JUZ,
      });
      if (mem.length < MEMORIZATION_PER_JUZ) {
        return NextResponse.json(
          { error: "سوال کافی برای این سال و بازه جزء وجود ندارد" },
          { status: 400 }
        );
      }
      for (const q of mem) {
        inserts.push({
          officialExamId: id,
          questionId: q.id,
          order: ++order,
          juz,
          questionKind: "MEMORIZATION",
        });
      }

      const concepts = await db.question.findMany({
        where: {
          isActive: true,
          year,
          juz,
          questionKind: QuestionKind.CONCEPTS,
        },
        select: { id: true },
        orderBy: { id: "asc" },
        take: CONCEPTS_PER_JUZ,
      });
      if (concepts.length < CONCEPTS_PER_JUZ) {
        return NextResponse.json(
          { error: "سوال کافی برای این سال و بازه جزء وجود ندارد" },
          { status: 400 }
        );
      }
      for (const q of concepts) {
        inserts.push({
          officialExamId: id,
          questionId: q.id,
          order: ++order,
          juz,
          questionKind: "CONCEPTS",
        });
      }
    }

    await db.officialExamQuestion.createMany({ data: inserts });

    const updated = await db.officialExam.findUnique({
      where: { id },
      include: { _count: { select: { questions: true } } },
    });

    return NextResponse.json({
      success: true,
      questionsAdded: inserts.length,
      exam: updated,
    });
  } catch (error) {
    console.error("Build official exam structure error:", error);
    return NextResponse.json(
      { error: "خطا در ساخت ساختار آزمون" },
      { status: 500 }
    );
  }
}
