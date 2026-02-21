import "server-only";
import { db } from "@/lib/db";
import DemoExam from "@/components/demo/DemoExam";

export const dynamic = "force-static";

export default async function DemoTakePage() {
  const questions = await db.question.findMany({
    where: {
      isActive: true,
      year: 1404,
      juz: { gte: 1, lte: 6 },
    },
    orderBy: { id: "asc" },
    take: 30,
    select: {
      id: true,
      questionText: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
    },
  });

  return <DemoExam questions={questions} />;
}