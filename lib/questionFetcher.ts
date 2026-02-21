import { Prisma } from "@/generated/client";
import { db as prisma } from "@/lib/db";

export async function fetchQuestionsScalable(
  filters: Prisma.QuestionWhereInput,
  questionCount: number,
  randomizeQuestions: boolean
) {
  if (randomizeQuestions) {
    // Random Offset Strategy: Count -> Random Offset -> Skip + Take
    const totalCount = await prisma.question.count({ where: filters });
    
    if (totalCount === 0) {
      return [];
    }
    
    if (totalCount <= questionCount) {
      // If total is less than or equal to requested, fetch all
      return await prisma.question.findMany({
        where: filters,
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
          questionKind: true
        },
        orderBy: { createdAt: 'desc' }
      });
    }
    
    // Generate random offset ensuring it never becomes negative
    const maxOffset = Math.max(0, totalCount - questionCount);
    const randomOffset = Math.floor(Math.random() * (maxOffset + 1));
    
    return await prisma.question.findMany({
      where: filters,
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
        questionKind: true
      },
      orderBy: { createdAt: 'desc' },
      skip: randomOffset,
      take: questionCount
    });
  } else {
    // Deterministic ordering
    return await prisma.question.findMany({
      where: filters,
      take: questionCount,
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
        questionKind: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
