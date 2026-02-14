import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "INSTITUTE") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const students = await db.user.findMany({
      where: {
        role: "STUDENT",
        isActive: true,
        OR: [
          { parentId: session.user.id },
          { teacher: { instituteId: session.user.id } },
        ],
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
    console.error("Error fetching institute students:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لیست دانش‌آموزان" },
      { status: 500 }
    );
  }
}
