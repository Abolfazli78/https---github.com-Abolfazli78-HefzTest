import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getUserSubscriptionInfo } from "@/lib/subscription-manager";

/** Simulator: fetch active official exam (first active by year desc). */
export async function GET() {
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

    const exam = await db.officialExam.findFirst({
      where: { isActive: true },
      orderBy: { year: "desc" },
      select: {
        id: true,
        title: true,
        year: true,
        degree: true,
        juzStart: true,
        juzEnd: true,
        durationMinutes: true,
        totalQuestions: true,
      },
    });

    if (!exam) {
      return NextResponse.json({ exam: null });
    }

    return NextResponse.json({ exam });
  } catch (error) {
    console.error("Get active official exam error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آزمون" },
      { status: 500 }
    );
  }
}
