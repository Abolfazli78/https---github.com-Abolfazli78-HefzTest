import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getUserSubscriptionInfo } from "@/lib/subscription-manager";
import { buildQuestionFilters } from "@/lib/examFilters";

const JUZ_MIN = 1;
const JUZ_MAX = 30;
const QUESTIONS_PER_JUZ = 5;
const MIN_YEAR = 1385;
const MAX_YEAR = 1404;

function resolvePerJuzTargets(year: number | null): { memTarget: number; conceptTarget: number } {
  if (year != null && year >= 1402 && year <= 1404) {
    return { memTarget: 2, conceptTarget: 3 };
  }
  if (year != null && year >= 1385 && year <= 1401) {
    return { memTarget: 1, conceptTarget: 4 };
  }
  return { memTarget: 2, conceptTarget: 3 };
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

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

    let selected: PoolItem[] = [];

    if (gradeNum != null) {
      // SIMULATOR LOGIC (structured per-Juz)
      const byJuz = new Map<number, PoolItem[]>();
      for (const q of pool) {
        const j = q.juz ?? 1;
        if (!byJuz.has(j)) byJuz.set(j, []);
        byJuz.get(j)!.push(q);
      }

      const targets = resolvePerJuzTargets(yearFilter);
      for (let juz = finalJuzStart; juz <= finalJuzEnd; juz++) {
        const juzQuestions = byJuz.get(juz) ?? [];

        const mem: PoolItem[] = [];
        const concept: PoolItem[] = [];
        for (const q of juzQuestions) {
          if (q.questionKind === "MEMORIZATION") mem.push(q);
          else concept.push(q);
        }

        const picked: PoolItem[] = [];
        picked.push(...mem.slice(0, targets.memTarget));
        picked.push(...concept.slice(0, targets.conceptTarget));

        if (picked.length === 0) {
          continue;
        }

        selected.push(...picked);
      }
    } else {
      // CUSTOM EXAM LOGIC
      const bodyAny = body as Record<string, unknown>;

      const memorizationPercentRaw = bodyAny.memorizationPercent;
      const conceptsPercentRaw = bodyAny.conceptsPercent;
      const memorizationPercent =
        typeof memorizationPercentRaw === "number" ? memorizationPercentRaw :
        typeof memorizationPercentRaw === "string" ? Number(memorizationPercentRaw) :
        null;
      const conceptsPercent =
        typeof conceptsPercentRaw === "number" ? conceptsPercentRaw :
        typeof conceptsPercentRaw === "string" ? Number(conceptsPercentRaw) :
        null;

      const customFilterInput = {
        ...bodyAny,
        useJuz: true,
        juzStart: finalJuzStart,
        juzEnd: finalJuzEnd,
        year: yearFilter ?? (bodyAny.year as unknown),
      };

      const customWhere = buildQuestionFilters(customFilterInput as never);

      try {
        const { customSelected } = await db.$transaction(async (tx: typeof db) => {
          const totalAvailableInner = await tx.question.count({ where: customWhere });
          console.log("Custom total available:", totalAvailableInner);
          console.log("Requested:", total);

          if (totalAvailableInner < total) {
            return { customSelected: null as PoolItem[] | null };
          }

          const usePercentages = memorizationPercent != null && conceptsPercent != null;
          if (usePercentages) {
            if (!Number.isFinite(memorizationPercent) || !Number.isFinite(conceptsPercent)) {
              return { customSelected: [] as PoolItem[] };
            }

            if (memorizationPercent + conceptsPercent !== 100) {
              throw new Error("PERCENT_SUM_INVALID");
            }

            const memCount = Math.round((total * memorizationPercent) / 100);
            const conceptCount = total - memCount;

            const memWhere = { ...(customWhere as object), questionKind: "MEMORIZATION" } as never;
            const conceptWhere = { ...(customWhere as object), questionKind: "CONCEPTS" } as never;

            const memAvailable = await tx.question.count({ where: memWhere });
            const conceptAvailable = await tx.question.count({ where: conceptWhere });

            if (memAvailable < memCount || conceptAvailable < conceptCount) {
              throw new Error("PERCENT_NOT_ENOUGH");
            }

            const memPool = await tx.question.findMany({
              where: memWhere,
              select: { id: true, juz: true, questionKind: true },
            });
            const conceptPool = await tx.question.findMany({
              where: conceptWhere,
              select: { id: true, juz: true, questionKind: true },
            });

            shuffleInPlace(memPool);
            shuffleInPlace(conceptPool);

            const picked = [...memPool.slice(0, memCount), ...conceptPool.slice(0, conceptCount)];
            shuffleInPlace(picked);
            return { customSelected: picked };
          }

          const allPool = await tx.question.findMany({
            where: customWhere,
            select: { id: true, juz: true, questionKind: true },
          });

          shuffleInPlace(allPool);
          return { customSelected: allPool.slice(0, total) };
        });

        if (customSelected == null) {
          return NextResponse.json(
            { error: "تعداد سوالات موجود با فیلترهای انتخاب شده کافی نیست" },
            { status: 400 }
          );
        }

        selected = customSelected;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg === "PERCENT_SUM_INVALID") {
          return NextResponse.json(
            { error: "درصدهای حفظ و مفاهیم باید مجموعاً 100 باشند" },
            { status: 400 }
          );
        }
        if (msg === "PERCENT_NOT_ENOUGH") {
          return NextResponse.json(
            { error: "تعداد سوالات کافی برای تقسیم درصدی انتخاب شده وجود ندارد" },
            { status: 400 }
          );
        }
        throw e;
      }
    }

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
