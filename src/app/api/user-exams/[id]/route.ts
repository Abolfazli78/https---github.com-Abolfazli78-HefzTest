import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

/**
 * GET /api/user-exams/[id]
 * Get one user exam (only owner).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await db.userExam.findFirst({
      where: { id, userId: session.user.id },
      include: { _count: { select: { questions: true } } },
    });

    if (!exam) {
      return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Get user exam error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آزمون" },
      { status: 500 }
    );
  }
}
