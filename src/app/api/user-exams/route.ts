import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

/**
 * GET /api/user-exams
 * List current user's simulator exams (created by them).
 */
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const exams = await db.userExam.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { questions: true } },
      },
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("List user exams error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لیست آزمون‌ها" },
      { status: 500 }
    );
  }
}
