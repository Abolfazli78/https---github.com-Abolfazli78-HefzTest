import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "attempts";

    let data: Record<string, string | number | boolean | null>[] = [];
    let filename = "";

    if (type === "attempts") {
      const attempts = await db.examAttempt.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          exam: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
        take: 1000,
      });

      data = attempts.map((attempt) => ({
        "نام کاربر": attempt.user.name,
        "ایمیل": attempt.user.email,
        "عنوان آزمون": attempt.exam.title,
        "امتیاز": attempt.score || 0,
        "تعداد کل سوالات": attempt.totalQuestions,
        "پاسخ صحیح": attempt.correctAnswers,
        "پاسخ غلط": attempt.wrongAnswers,
        "بدون پاسخ": attempt.unanswered,
        "وضعیت": attempt.status === "COMPLETED" ? "تکمیل شده" : attempt.status === "IN_PROGRESS" ? "در حال انجام" : "منقضی شده",
        "تاریخ شروع": new Date(attempt.startedAt).toLocaleString("fa-IR"),
        "تاریخ ارسال": attempt.submittedAt
          ? new Date(attempt.submittedAt).toLocaleString("fa-IR")
          : "-",
        "زمان صرف شده (ثانیه)": attempt.timeSpent || 0,
      }));

      filename = "reports-attempts.xlsx";
    } else if (type === "users") {
      const users = await db.user.findMany({
        include: {
          _count: {
            select: {
              examAttempts: true,
              supportTickets: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      data = users.map((user) => ({
        "نام": user.name,
        "ایمیل": user.email,
        "نقش": user.role === "ADMIN" ? "مدیر" : "کاربر",
        "وضعیت": user.isActive ? "فعال" : "غیرفعال",
        "تعداد آزمون‌ها": user._count.examAttempts,
        "تعداد تیکت‌ها": user._count.supportTickets,
        "تاریخ ثبت‌نام": new Date(user.createdAt).toLocaleDateString("fa-IR"),
      }));

      filename = "reports-users.xlsx";
    } else if (type === "exams") {
      const exams = await db.exam.findMany({
        include: {
          _count: {
            select: {
              examAttempts: true,
              questions: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      data = exams.map((exam) => ({
        "عنوان": exam.title,
        "توضیحات": exam.description || "-",
        "مدت زمان (دقیقه)": exam.duration,
        "تعداد سوالات": exam.questionCount,
        "سطح دسترسی": exam.accessLevel === "FREE" ? "رایگان" : "اشتراکی",
        "وضعیت": exam.isActive ? "فعال" : "غیرفعال",
        "تعداد آزمون‌های انجام شده": exam._count.examAttempts,
        "تعداد سوالات موجود": exam._count.questions,
        "تاریخ ایجاد": new Date(exam.createdAt).toLocaleDateString("fa-IR"),
      }));

      filename = "reports-exams.xlsx";
    }

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "گزارش");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting report:", error);
    return NextResponse.json(
      { error: "خطا در تولید گزارش" },
      { status: 500 }
    );
  }
}

