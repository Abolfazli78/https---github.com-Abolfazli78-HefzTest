import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getUserSubscriptionInfo } from "@/lib/subscription-manager";

/** Simulator: load official exam questions ordered by "order". */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      const subscriptionInfo = await getUserSubscriptionInfo(session.user.id);
      if (!subscriptionInfo.examSimulatorEnabled) {
        return NextResponse.json(
          { error: "دسترسی به شبیه ساز آزمون در پلن شما فعال نیست." },
          { status: 403 }
        );
      }
    }

    const { id } = await params;
    const exam = await db.officialExam.findFirst({
      where: { id, isActive: true },
    });
    if (!exam) {
      return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
    }

    const rows = await db.officialExamQuestion.findMany({
      where: { officialExamId: id },
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
    });

    const questions = rows.map((r) => ({
      officialExamQuestionId: r.id,
      order: r.order,
      juz: r.juz,
      questionKind: r.questionKind,
      ...r.question,
    }));

    return NextResponse.json({ questions, durationMinutes: exam.durationMinutes });
  } catch (error) {
    console.error("Get official exam questions error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سوالات" },
      { status: 500 }
    );
  }
}
