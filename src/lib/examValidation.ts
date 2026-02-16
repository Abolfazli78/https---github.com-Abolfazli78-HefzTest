import { z } from "zod";
import { QuestionKind } from "@prisma/client";

export const CreateCustomExamSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  duration: z.number().positive().optional(),
  questionCount: z.number().int().min(1).max(200),
  passingScore: z.number().int().min(0).max(100).optional(),
  randomizeQuestions: z.boolean().default(true),
  showResults: z.boolean().optional(),
  allowRetake: z.boolean().optional(),
  useSurah: z.boolean().optional().default(true),
  useJuz: z.boolean().optional().default(true),
  // Juz: range (juzStart, juzEnd) OR multiple (juz array)
  juz: z.array(z.number().int().min(1).max(30)).optional(),
  juzStart: z.number().int().min(1).max(30).optional(),
  juzEnd: z.number().int().min(1).max(30).optional(),
  // Surah: range (surahStart, surahEnd) OR multiple (surah array)
  surah: z.array(z.number().int().min(1).max(114)).optional(),
  surahStart: z.number().int().min(1).max(114).optional(),
  surahEnd: z.number().int().min(1).max(114).optional(),
  year: z.number().int().min(1380).max(1500).optional(),
  yearStart: z.number().int().min(1380).max(1500).optional(),
  yearEnd: z.number().int().min(1380).max(1500).optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  topic: z
    .union([
      z.literal("ALL"),
      z.enum(["memorization", "concepts"]),
      z.array(z.enum(["memorization", "concepts"])).min(1),
    ])
    .optional(),
  isWholeQuran: z.boolean().default(false),
  excludePreviouslyUsed: z.boolean().default(false)
})
  .refine(
    (data) => {
      if (data.juzStart != null && data.juzEnd != null) {
        return data.juzStart <= data.juzEnd;
      }
      return true;
    },
    { message: "جزء شروع نمی‌تواند بزرگتر از جزء پایان باشد", path: ["juzStart"] }
  )
  .refine(
    (data) => {
      if (data.surahStart != null && data.surahEnd != null) {
        return data.surahStart <= data.surahEnd;
      }
      return true;
    },
    { message: "سوره شروع نمی‌تواند بزرگتر از سوره پایان باشد", path: ["surahStart"] }
  )
  .refine(
    (data) => {
      if (data.yearStart && data.yearEnd) {
        return data.yearStart <= data.yearEnd;
      }
      return true;
    },
    { message: "سال شروع نمی‌تواند بزرگتر از سال پایان باشد", path: ["yearStart"] }
  )
  .refine(
    (data) => {
      const useSurah = data.useSurah !== false;
      const useJuz = data.useJuz !== false;
      return useSurah || useJuz;
    },
    { message: "حداقل یکی از سوره یا جزء باید انتخاب شود", path: ["useSurah"] }
  )
  .refine(
    (data) => {
      const useSurah = data.useSurah !== false;
      const useJuz = data.useJuz !== false;
      const hasJuz =
        (data.juzStart != null && data.juzEnd != null) ||
        (Array.isArray(data.juz) && data.juz.length > 0);
      const hasSurah =
        (data.surahStart != null && data.surahEnd != null) ||
        (Array.isArray(data.surah) && data.surah.length > 0);
      if (useSurah && !useJuz) return hasSurah;
      if (useJuz && !useSurah) return hasJuz;
      if (useSurah && useJuz) return hasSurah || hasJuz;
      return true;
    },
    { message: "حداقل یکی از سوره یا جزء باید انتخاب شود", path: ["surah"] }
  );

export type CreateCustomExamInput = z.infer<typeof CreateCustomExamSchema>;
