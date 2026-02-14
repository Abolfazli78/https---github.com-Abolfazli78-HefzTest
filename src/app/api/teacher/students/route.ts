import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const students = await db.user.findMany({
      where: {
        teacherId: session.user.id,
        role: "STUDENT",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching teacher students:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لیست دانش‌آموزان" },
      { status: 500 }
    );
  }
}
