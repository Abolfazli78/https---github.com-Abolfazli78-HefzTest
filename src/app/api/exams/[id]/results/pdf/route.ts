import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { generateExamReportPDF } from "@/lib/pdf-generator";

export const runtime = "nodejs";

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
    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get("attempt");

    if (!attemptId) {
      return NextResponse.json(
        { error: "شناسه آزمون الزامی است" },
        { status: 400 }
      );
    }

    const attempt = await db.examAttempt.findFirst({
      where: {
        id: attemptId,
        userId: session.user.id,
        examId: id,
        status: "COMPLETED",
      },
      include: {
        exam: true,
        user: true,
        examAnswers: {
          include: {
            question: true,
          },
          orderBy: {
            answeredAt: "asc",
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "آزمون یافت نشد" }, { status: 404 });
    }

    const pdfBytes = await generateExamReportPDF(attempt);
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

    return new NextResponse(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="exam-report-${attempt.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "خطا در تولید PDF" },
      { status: 500 }
    );
  }
}

