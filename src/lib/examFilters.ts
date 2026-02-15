import { Prisma, QuestionKind } from "@/generated/client";
import { CreateCustomExamInput } from "@/lib/examValidation";

/**
 * Build question filters.
 * When useSurah/useJuz are set, only the active filters are applied; they are combined with AND.
 * Other filters (year, difficulty, questionKind) use AND.
 * Surah filtering uses surahId only (no string matching).
 */
export function buildQuestionFilters(
  input: CreateCustomExamInput,
  _userId?: string
): Prisma.QuestionWhereInput {
  const conditions: Prisma.QuestionWhereInput[] = [{ isActive: true }];

  const useSurah = input.useSurah !== false;
  const useJuz = input.useJuz !== false;

  // ---- SURAH CONDITION (only when useSurah and we have surah selection) ----
  if (useSurah) {
    let surahCondition: Prisma.QuestionWhereInput | null = null;
    if (input.surahStart != null && input.surahEnd != null) {
      const from = Math.min(input.surahStart, input.surahEnd);
      const to = Math.max(input.surahStart, input.surahEnd);
      surahCondition = { surahId: { gte: from, lte: to } };
    } else if (Array.isArray(input.surah) && input.surah.length > 0) {
      const surahIds = input.surah
        .map((s) => Number(s))
        .filter((s) => Number.isInteger(s) && s >= 1 && s <= 114);
      if (surahIds.length > 0) {
        surahCondition = { surahId: { in: surahIds } };
      }
    }
    if (surahCondition) conditions.push(surahCondition);
  }

  // ---- JUZ CONDITION (only when useJuz and we have juz selection) ----
  if (useJuz) {
    let juzCondition: Prisma.QuestionWhereInput | null = null;
    if (input.juzStart != null && input.juzEnd != null) {
      const start = Math.min(input.juzStart, input.juzEnd);
      const end = Math.max(input.juzStart, input.juzEnd);
      juzCondition = { juz: { gte: start, lte: end } };
    } else if (Array.isArray(input.juz) && input.juz.length > 0) {
      juzCondition = { juz: { in: input.juz.map((j) => Number(j)) } };
    } else if (input.juz != null && typeof input.juz === "number") {
      juzCondition = { juz: input.juz };
    }
    if (juzCondition) conditions.push(juzCondition);
  }

  // ---- OTHER FILTERS (year, difficulty, question type) ----
  if (input.yearStart != null && input.yearEnd != null) {
    conditions.push({
      year: { gte: Number(input.yearStart), lte: Number(input.yearEnd) },
    });
  } else if (input.year != null) {
    conditions.push({ year: Number(input.year) });
  }

  if (input.difficulty != null && (input.difficulty as string) !== "ALL") {
    conditions.push({ difficultyLevel: input.difficulty });
  }

  if (input.topic != null && (input.topic as string) !== "ALL") {
    if (input.topic === "memorization") {
      conditions.push({ questionKind: QuestionKind.MEMORIZATION });
    } else if (input.topic === "concepts") {
      conditions.push({ questionKind: QuestionKind.CONCEPTS });
    } else {
      conditions.push({ topic: input.topic });
    }
  }

  const where = conditions.length === 1 ? conditions[0]! : { AND: conditions };
  console.log("Where clause:", JSON.stringify(where, null, 2));
  return where;
}
