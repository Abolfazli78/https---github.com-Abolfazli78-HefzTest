import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getUserSubscriptionInfo } from "@/lib/subscription-manager";

/** Simulator: submit attempt and save to SimulatorAttempt. */
export async function POST(
  req: NextRequest,
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

    const { id: officialExamId } = await params;
    const exam = await db.officialExam.findFirst({
      where: { id: officialExamId, isActive: true },
    });
    if (!exam) {
      return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
    }

    const body = await req.json();
    const { correctAnswers, totalQuestions } = body as {
      correctAnswers: number;
      totalQuestions: number;
    };

    const score =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    const attempt = await db.simulatorAttempt.create({
      data: {
        userId: session.user.id,
        officialExamId,
        score,
        totalQuestions: totalQuestions ?? exam.totalQuestions,
        correctAnswers: correctAnswers ?? 0,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score,
      correctAnswers,
      totalQuestions,
    });
  } catch (error) {
    console.error("Submit simulator attempt error:", error);
    return NextResponse.json(
      { error: "خطا در ثبت نتیجه" },
      { status: 500 }
    );
  }
}
