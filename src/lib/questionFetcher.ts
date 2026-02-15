import { Prisma } from "@/generated/client";
import { db as prisma } from "@/lib/db";

type QuestionRow = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: Prisma.QuestionGetPayload<object>["correctAnswer"];
  explanation: string | null;
  year: number | null;
  juz: number | null;
  topic: string | null;
  difficultyLevel: string | null;
  questionKind: Prisma.QuestionGetPayload<object>["questionKind"];
};

function pickRandomOne<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Extracts base filters (isActive, year, difficulty, questionKind) excluding Surah/Juz.
 * Base filters are everything except the Surah OR Juz condition.
 */
function extractBaseFilters(filters: Prisma.QuestionWhereInput): Prisma.QuestionWhereInput {
  const base: Prisma.QuestionWhereInput[] = [];
  
  if ("AND" in filters && Array.isArray(filters.AND)) {
    for (const condition of filters.AND) {
      if (!condition) continue;
      
      // Skip Surah/Juz OR condition
      if ("OR" in condition && Array.isArray(condition.OR)) {
        continue;
      }
      
      // Skip individual Surah/Juz conditions (they're in OR)
      if ("surahId" in condition) continue;
      if ("juz" in condition) continue;
      
      // Include everything else
      base.push(condition);
    }
  } else {
    if ("surahId" in filters) return { isActive: true };
    if ("juz" in filters) return { isActive: true };
    if ("OR" in filters) return { isActive: true };

    const baseFilter: Prisma.QuestionWhereInput = {};
    if ("isActive" in filters) baseFilter.isActive = filters.isActive;
    if ("year" in filters) baseFilter.year = filters.year;
    if ("difficultyLevel" in filters) baseFilter.difficultyLevel = filters.difficultyLevel;
    if ("questionKind" in filters) baseFilter.questionKind = filters.questionKind;
    if ("topic" in filters && typeof filters.topic === "string") baseFilter.topic = filters.topic;
    return Object.keys(baseFilter).length > 0 ? baseFilter : { isActive: true };
  }
  
  return base.length === 0 ? { isActive: true } : base.length === 1 ? base[0]! : { AND: base };
}

/**
 * Fetches questions with balanced coverage: at least 1 from each selected Surah and Juz.
 * Queries each category independently from DB to guarantee coverage.
 * No fallback outside filters. No duplicates. Randomization only during creation.
 */
export async function fetchQuestionsBalanced(
  filters: Prisma.QuestionWhereInput,
  selectedSurahIds: number[],
  selectedJuzNumbers: number[],
  questionCount: number,
  randomizeQuestions: boolean,
  tx?: Prisma.TransactionClient
): Promise<QuestionRow[]> {
  const db = tx ?? prisma;
  const baseFilters = extractBaseFilters(filters);
  const usedIds = new Set<string>();
  const finalQuestions: QuestionRow[] = [];

  // Step 1: For each selected Surah, query DB directly (by surahId only)
  for (const surahId of selectedSurahIds) {
    const surahQuestions = await db.question.findMany({
      where: {
        AND: [baseFilters, { surahId }],
      },
      select: {
        id: true,
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
        questionKind: true,
      },
    });

    const available = surahQuestions.filter((q) => !usedIds.has(q.id));
    const picked = pickRandomOne(available);
    if (picked) {
      finalQuestions.push(picked);
      usedIds.add(picked.id);
    }
  }

  // Step 2: For each selected Juz, query DB directly
  for (const juzNum of selectedJuzNumbers) {
    const juzQuestions = await db.question.findMany({
      where: {
        AND: [
          baseFilters,
          { juz: juzNum },
        ],
      },
      select: {
        id: true,
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
        questionKind: true,
      },
    });

    const available = juzQuestions.filter((q) => !usedIds.has(q.id));
    const picked = pickRandomOne(available);
    if (picked) {
      finalQuestions.push(picked);
      usedIds.add(picked.id);
    }
  }

  const minRequired = finalQuestions.length;
  const remainingCount = questionCount - minRequired;

  // Step 5: If requested count < minimum categories
  if (remainingCount < 0) {
    throw new Error(
      `You selected ${minRequired} categories but requested only ${questionCount} questions. Minimum required is ${minRequired}.`
    );
  }

  // Step 3: Build main pool using original filters (Surah OR Juz), exclude usedIds
  const mainPool = await db.question.findMany({
    where: {
      AND: [
        filters,
        { id: { notIn: Array.from(usedIds) } },
      ],
    },
    select: {
      id: true,
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
      questionKind: true,
    },
  });

  // Step 6: Fill remaining from main pool
  const shuffledRemaining = randomizeQuestions ? shuffle(mainPool) : mainPool;
  const toTake = Math.min(remainingCount, shuffledRemaining.length);
  const extra = shuffledRemaining.slice(0, toTake);
  extra.forEach((q) => {
    finalQuestions.push(q);
    usedIds.add(q.id);
  });

  // Step 7: If not enough total
  if (finalQuestions.length < questionCount) {
    throw new Error(
      `Only ${finalQuestions.length} questions found in your selected range, but you requested ${questionCount}.`
    );
  }

  const result = finalQuestions.slice(0, questionCount);
  return randomizeQuestions ? shuffle(result) : result;
}

/**
 * Extracts selected Surah IDs and Juz numbers from CreateCustomExamInput.
 * When useSurah/useJuz are false, returns empty arrays for that category.
 */
export function extractSelectedCategories(input: {
  useSurah?: boolean;
  useJuz?: boolean;
  surahStart?: number | null;
  surahEnd?: number | null;
  surah?: number[] | null;
  juzStart?: number | null;
  juzEnd?: number | null;
  juz?: number[] | null;
}): { surahIds: number[]; juzNumbers: number[] } {
  const useSurah = input.useSurah !== false;
  const useJuz = input.useJuz !== false;

  const surahIds: number[] = [];
  if (useSurah) {
    if (input.surahStart != null && input.surahEnd != null) {
      const from = Math.min(input.surahStart, input.surahEnd);
      const to = Math.max(input.surahStart, input.surahEnd);
      for (let i = from; i <= to; i++) surahIds.push(i);
    } else if (Array.isArray(input.surah) && input.surah.length > 0) {
      surahIds.push(
        ...input.surah
          .map((s) => Number(s))
          .filter((s) => Number.isInteger(s) && s >= 1 && s <= 114)
      );
    }
  }

  const juzNumbers: number[] = [];
  if (useJuz) {
    if (input.juzStart != null && input.juzEnd != null) {
      const start = Math.min(input.juzStart, input.juzEnd);
      const end = Math.max(input.juzStart, input.juzEnd);
      for (let j = start; j <= end; j++) juzNumbers.push(j);
    } else if (Array.isArray(input.juz) && input.juz.length > 0) {
      juzNumbers.push(
        ...input.juz
          .map((j) => Number(j))
          .filter((j) => Number.isInteger(j) && j >= 1 && j <= 30)
      );
    }
  }

  return {
    surahIds: [...new Set(surahIds)].sort((a, b) => a - b),
    juzNumbers: [...new Set(juzNumbers)].sort((a, b) => a - b),
  };
}
