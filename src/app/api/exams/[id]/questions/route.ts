import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { SelectionMode, CorrectAnswer } from "@/generated";

function parseExamFilters(description: string | null | undefined) {
  if (!description) return {};
  try {
    const lines = description.split("\n");
    const lastLine = lines[lines.length - 1];
    if (lastLine && lastLine.startsWith("{") && lastLine.endsWith("}")) {
      return JSON.parse(lastLine);
    }
  } catch {
    // ignore
  }
  return {};
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await db.exam.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { id: "asc" },
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
    });

    if (!exam || !exam.isActive) {
      return NextResponse.json({ error: "آزمون موجود نیست" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || exam.questionCount.toString());

    // If exam has persisted questions (linked via examId), return them directly — no regeneration
    if (exam.questions && exam.questions.length > 0) {
      const questions = exam.questions.slice(0, Math.min(count, exam.questions.length));
      return NextResponse.json(
        questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
        }))
      );
    }

    // Legacy exams without persisted questions: use filters, deterministic order only (no shuffle)
    let where: Record<string, unknown> = { isActive: true };
    const descLines = (exam.description || "").split("\n");
    const isCustomExam = descLines.some(
      (line) =>
        line.includes("اجزاء") || line.includes("جزء") || line.includes("سوره") || line.includes("شامل")
    );

    if (exam.selectionMode === SelectionMode.RANDOM && isCustomExam) {
      for (const line of descLines) {
        if (line.includes("اجزاء") || line.includes("جزء")) {
          const match = line.match(/اجزاء\s*(\d+)\s*تا\s*(\d+)/);
          if (match) {
            where.juz = { gte: parseInt(match[1]), lte: parseInt(match[2]) };
          }
        } else if (line.includes("سوره")) {
          const surahMatch = line.match(/سوره:\s*(.+)/);
          if (surahMatch) {
            const parts = surahMatch[1].split(",").map((s) => s.trim()).filter(Boolean);
            const surahIds = parts
              .map((v) => parseInt(v, 10))
              .filter((id) => !Number.isNaN(id) && id >= 1 && id <= 114);
            if (surahIds.length > 0) {
              const { SURAHS, normalizeText } = await import("@/lib/surahs");
              const selectedSurahs = SURAHS.filter((s) => surahIds.includes(s.id));
              const allNames = [...new Set([...selectedSurahs.map((s) => s.name), ...selectedSurahs.map((s) => normalizeText(s.name))])];
              if (allNames.length > 0) {
                if (allNames.length === 1) {
                  where.topic = allNames[0];
                } else {
                  where.OR = allNames.map((name) => ({ topic: name }));
                }
              }
            }
          }
        }
      }
    } else if (exam.selectionMode === SelectionMode.YEAR && exam.year) {
      where.year = exam.year;
    } else if (exam.selectionMode === SelectionMode.JUZ && exam.juz) {
      where.juz = exam.juz;
    }

    const allQuestions = await db.question.findMany({
      where: where as Parameters<typeof db.question.findMany>[0]["where"],
      orderBy: { id: "asc" },
      take: count,
      select: {
        id: true,
        questionText: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctAnswer: true,
      },
    });

    return NextResponse.json(allQuestions);
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    return NextResponse.json({ error: "خطا در دریافت سوالات" }, { status: 500 });
  }
}

