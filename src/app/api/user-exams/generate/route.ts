import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getUserSubscriptionInfo } from "@/lib/subscription-manager";

const JUZ_MIN = 1;
const JUZ_MAX = 30;
const QUESTIONS_PER_JUZ = 5;
const MIN_YEAR = 1385;
const MAX_YEAR = 1404;

/** Derive juz range, question count and duration from grade + range (premium flow). */
function resolveFromGradeAndRange(
  grade: number,
  range: string | undefined
): { juzStart: number; juzEnd: number; totalQuestions: number; durationMinutes: number } {
  if (grade === 3) {
    return { juzStart: 1, juzEnd: 30, totalQuestions: 150, durationMinutes: 150 };
  }
  if (grade === 4) {
    if (range === "10-30") {
      return { juzStart: 11, juzEnd: 30, totalQuestions: 100, durationMinutes: 100 };
    }
    return { juzStart: 1, juzEnd: 20, totalQuestions: 100, durationMinutes: 100 };
  }
  if (grade === 5) {
    if (range === "second") {
      return { juzStart: 11, juzEnd: 20, totalQuestions: 50, durationMinutes: 50 };
    }
    if (range === "third") {
      return { juzStart: 21, juzEnd: 30, totalQuestions: 50, durationMinutes: 50 };
    }
    return { juzStart: 1, juzEnd: 10, totalQuestions: 50, durationMinutes: 50 };
  }
  return { juzStart: 1, juzEnd: 30, totalQuestions: 150, durationMinutes: 150 };
}

/**
 * POST /api/user-exams/generate
 * Create a user simulator exam by randomly selecting questions from the Question bank.
 * Requires examSimulatorEnabled on the user's subscription (or ADMIN).
 * Accepts either (grade, range, year) for premium flow or legacy (title, juzStart, juzEnd, ...).
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      try {
        const subscriptionInfo = await getUserSubscriptionInfo(session.user.id);
        if (!subscriptionInfo.examSimulatorEnabled) {
          return NextResponse.json(
            { error: "دسترسی به شبیه ساز آزمون در پلن شما فعال نیست." },
            { status: 403 }
          );
        }
      } catch (subErr) {
        console.error("[user-exams/generate] getUserSubscriptionInfo failed:", subErr);
        return NextResponse.json(
          { error: "خطا در بررسی اشتراک" },
          { status: 500 }
        );
      }
    }

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch (parseErr) {
      console.error("[user-exams/generate] JSON parse failed:", parseErr);
      return NextResponse.json(
        { error: "فرمت درخواست نامعتبر است." },
        { status: 400 }
      );
    }

    const {
      title: bodyTitle,
      grade,
      range,
      year: bodyYear,
      juzStart: bodyJuzStart,
      juzEnd: bodyJuzEnd,
      year: bodyYearLegacy,
      totalQuestions: bodyTotalQuestions,
      durationMinutes: bodyDurationMinutes,
    } = body as {
      title?: string;
      grade?: number;
      range?: string;
      year?: number | null;
      juzStart?: number;
      juzEnd?: number;
      totalQuestions?: number;
      durationMinutes?: number;
    };

    let trimmedTitle: string;
    let juzStartNorm: number;
    let juzEndNorm: number;
    let total: number;
    let duration: number;
    let yearFilter: number | null;

    const yearNum = bodyYear != null ? Number(bodyYear) : bodyYearLegacy != null ? Number(bodyYearLegacy) : null;
    if (yearNum != null && Number.isFinite(yearNum)) {
      yearFilter = Math.max(MIN_YEAR, Math.min(MAX_YEAR, Math.floor(yearNum)));
    } else {
      yearFilter = null;
    }

    const gradeNum = grade != null ? Number(grade) : null;
    const rangeStr = typeof range === "string" && range.trim() ? range.trim() : null;

    if (gradeNum != null && [3, 4, 5].includes(gradeNum)) {
      const resolved = resolveFromGradeAndRange(
        gradeNum,
        gradeNum === 3 ? undefined : rangeStr ?? (gradeNum === 4 ? "1-20" : "first")
      );
      juzStartNorm = resolved.juzStart;
      juzEndNorm = resolved.juzEnd;
      total = resolved.totalQuestions;
      duration = resolved.durationMinutes;
      const yearStr = yearFilter != null ? String(yearFilter) : "";
      trimmedTitle = typeof bodyTitle === "string" && bodyTitle.trim()
        ? bodyTitle.trim()
        : `شبیه‌ساز درجه ${gradeNum}${yearStr ? ` — سال ${yearStr}` : ""}`;
    } else {
      const trimmed = typeof bodyTitle === "string" ? bodyTitle.trim() : "";
      if (!trimmed) {
        return NextResponse.json(
          { error: "عنوان آزمون الزامی است." },
          { status: 400 }
        );
      }
      trimmedTitle = trimmed;
      const start = Math.max(JUZ_MIN, Math.min(JUZ_MAX, Number(bodyJuzStart) || JUZ_MIN));
      const end = Math.max(JUZ_MIN, Math.min(JUZ_MAX, Number(bodyJuzEnd) || JUZ_MAX));
      juzStartNorm = Math.min(start, end);
      juzEndNorm = Math.max(start, end);
      const totalLegacy = Number(bodyTotalQuestions) || 20;
      const durationLegacy = Number(bodyDurationMinutes) || 60;
      total = Math.min(150, Math.max(5, totalLegacy));
      duration = Math.min(180, Math.max(5, durationLegacy));
    }

    juzStartNorm = Number(juzStartNorm) || JUZ_MIN;
    juzEndNorm = Number(juzEndNorm) || JUZ_MAX;
    juzStartNorm = Math.max(JUZ_MIN, Math.min(JUZ_MAX, juzStartNorm));
    juzEndNorm = Math.max(JUZ_MIN, Math.min(JUZ_MAX, juzEndNorm));
    const finalJuzStart = Math.min(juzStartNorm, juzEndNorm);
    const finalJuzEnd = Math.max(juzStartNorm, juzEndNorm);

    const where: Parameters<typeof db.question.findMany>[0]["where"] = {
      isActive: true,
      juz: { gte: finalJuzStart, lte: finalJuzEnd },
    };
    if (yearFilter != null) {
      where.year = yearFilter;
    }

    console.error("[user-exams/generate] params:", {
      grade: gradeNum,
      range: rangeStr,
      yearFilter,
      finalJuzStart,
      finalJuzEnd,
      total,
      duration,
    });

    type PoolItem = { id: string; juz: number | null; questionKind: unknown };
    let pool: PoolItem[];
    try {
      pool = await db.question.findMany({
        where,
        select: { id: true, juz: true, questionKind: true },
        orderBy: [{ juz: "asc" }, { id: "asc" }],
      });
    } catch (dbErr) {
      console.error("[user-exams/generate] db.question.findMany failed:", dbErr);
      return NextResponse.json(
        { error: "خطا در دریافت سوالات از بانک." },
        { status: 500 }
      );
    }

    console.error("[user-exams/generate] pool.length:", pool.length, "required:", total);

    if (pool.length === 0) {
      return NextResponse.json(
        {
          error: yearFilter != null
            ? `برای سال ${yearFilter} و بازه جزء ${finalJuzStart} تا ${finalJuzEnd} هیچ سوالی در بانک وجود ندارد. سال یا بازه جزء را تغییر دهید.`
            : `برای بازه جزء ${finalJuzStart} تا ${finalJuzEnd} هیچ سوالی در بانک وجود ندارد. بازه جزء را تغییر دهید.`,
        },
        { status: 400 }
      );
    }

    const byJuz = new Map<number, PoolItem[]>();
    for (const q of pool) {
      const j = q.juz ?? 1;
      if (!byJuz.has(j)) byJuz.set(j, []);
      byJuz.get(j)!.push(q);
    }

    const selected: PoolItem[] = [];
    for (let juz = finalJuzStart; juz <= finalJuzEnd; juz++) {
      const juzQuestions = byJuz.get(juz) ?? [];
      if (juzQuestions.length < 5) {
        return NextResponse.json(
          {
            error: `برای جزء ${juz} حداقل ۵ سوال نیاز است. موجود: ${juzQuestions.length}.`,
          },
          { status: 400 }
        );
      }
      for (let i = 0; i < 5; i++) {
        selected.push(juzQuestions[i]);
      }
    }

    const memIndices = selected
      .map((q, i) => (q.questionKind === "MEMORIZATION" ? i : -1))
      .filter((i) => i >= 0);
    if (memIndices.length < 2) {
      return NextResponse.json(
        { error: "برای این بازه حداقل ۲ سوال حفظ (MEMORIZATION) در بانک لازم است." },
        { status: 400 }
      );
    }
    const firstTwo = [selected[memIndices[0]], selected[memIndices[1]]];
    const rest = selected.filter((_, i) => i !== memIndices[0] && i !== memIndices[1]);
    selected.length = 0;
    selected.push(...firstTwo, ...rest);

    const actualTotal = selected.length;

    const questionKindRaw = (kind: unknown): string =>
      kind != null && typeof kind === "string" ? kind : "CONCEPTS";

    let userExam;
    try {
      userExam = await db.userExam.create({
        data: {
          userId: session.user.id,
          title: trimmedTitle,
          juzStart: finalJuzStart,
          juzEnd: finalJuzEnd,
          year: yearFilter,
          durationMinutes: duration,
          totalQuestions: actualTotal,
          questions: {
            create: selected.map((q, i) => ({
              questionId: q.id,
              order: i + 1,
              juz: q.juz ?? 1,
              questionKind: questionKindRaw(q.questionKind),
            })),
          },
        },
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
                },
              },
            },
          },
        },
      });
    } catch (createErr) {
      console.error("[user-exams/generate] db.userExam.create failed:", createErr);
      return NextResponse.json(
        { error: "خطا در ذخیره آزمون." },
        { status: 500 }
      );
    }

    return NextResponse.json(userExam);
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[user-exams/generate] unexpected error:", err.message, err.stack);
    return NextResponse.json(
      { error: "خطا در ساخت آزمون" },
      { status: 500 }
    );
  }
}
