import { Prisma, QuestionKind } from "@/generated/client";
import { CreateCustomExamInput } from "./examValidation";
import { SURAHS } from "@/lib/surahs";

/** Generate with/without ال prefix variants for DB topic matching */
function generateSurahVariants(name: string): string[] {
  const trimmed = name.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("ال")) {
    return [trimmed, trimmed.substring(2)];
  }
  return [trimmed, "ال" + trimmed];
}

export function buildQuestionFilters(input: CreateCustomExamInput, _userId?: string): Prisma.QuestionWhereInput {
  const andConditions: Prisma.QuestionWhereInput[] = [];

  // Juz filtering
  if (!input.isWholeQuran) {
    if (input.juzStart && input.juzEnd) {
      andConditions.push({
        juz: {
          gte: input.juzStart,
          lte: input.juzEnd
        }
      });
    } else if (input.juz && input.juz.length > 0) {
      andConditions.push({
        juz: { in: input.juz }
      });
    }
  }

  // Surah filtering (topic field)
  if (input.surah && input.surah.length > 0) {
    const surahIds = input.surah.map((s) => Number(s)).filter((s) => s >= 1 && s <= 114);
    const selectedSurahNames = SURAHS.filter((s) => surahIds.includes(s.id))
      .map((s) => s.name)
      .map((s) => s.trim())
      .filter(Boolean);
    const uniqueNames = [...new Set(selectedSurahNames.flatMap(generateSurahVariants))];
    if (uniqueNames.length > 0) {
      andConditions.push({ topic: { in: uniqueNames } });
    }
  }

  // Year filtering
  if (input.yearStart && input.yearEnd) {
    andConditions.push({
      year: {
        gte: input.yearStart,
        lte: input.yearEnd
      }
    });
  } else if (input.year) {
    andConditions.push({
      year: input.year
    });
  }

  // Difficulty filtering
  if (input.difficulty) {
    andConditions.push({
      difficultyLevel: input.difficulty
    });
  }

  // Question kind filtering
  if (input.topic && input.topic !== "ALL") {
    if (input.topic === "memorization") {
      andConditions.push({
        questionKind: QuestionKind.MEMORIZATION
      });
    } else if (input.topic === "concepts") {
      andConditions.push({
        questionKind: QuestionKind.CONCEPTS
      });
    } else {
      andConditions.push({
        topic: input.topic
      });
    }
  }

  const filters: Prisma.QuestionWhereInput = {
    isActive: true
  };

  // Add AND conditions only if they exist
  if (andConditions.length > 0) {
    filters.AND = andConditions;
  }

  return filters;
}
