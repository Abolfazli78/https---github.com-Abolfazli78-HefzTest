import { z } from "zod";
import { QuestionKind } from "@/generated/client";

export const CreateCustomExamSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  duration: z.number().positive().optional(),
  questionCount: z.number().int().min(1).max(200).default(20),
  passingScore: z.number().int().min(0).max(100).optional(),
  randomizeQuestions: z.boolean().default(true),
  showResults: z.boolean().optional(),
  allowRetake: z.boolean().optional(),
  juz: z.array(z.number().int().min(1).max(30)).optional(),
  juzStart: z.number().int().min(1).max(30).optional(),
  juzEnd: z.number().int().min(1).max(30).optional(),
  surah: z.array(z.number().int().min(1).max(114)).optional(),
  year: z.number().int().min(1400).max(1500).optional(),
  yearStart: z.number().int().min(1400).max(1500).optional(),
  yearEnd: z.number().int().min(1400).max(1500).optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  topic: z.enum(["memorization", "concepts"]).or(z.string()).optional(),
  isWholeQuran: z.boolean().default(false),
  excludePreviouslyUsed: z.boolean().default(false)
}).refine(
  (data) => {
    if (data.juzStart && data.juzEnd) {
      return data.juzStart <= data.juzEnd;
    }
    if (data.yearStart && data.yearEnd) {
      return data.yearStart <= data.yearEnd;
    }
    return true;
  },
  {
    message: "Start value must be less than or equal to end value",
    path: ["juzStart"]
  }
);

export type CreateCustomExamInput = z.infer<typeof CreateCustomExamSchema>;
