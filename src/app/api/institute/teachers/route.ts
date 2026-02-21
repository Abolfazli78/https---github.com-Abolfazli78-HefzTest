import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "INSTITUTE") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const teachers = await db.user.findMany({
      where: {
        instituteId: session.user.id,
        role: "TEACHER",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching institute teachers:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لیست معلمان" },
      { status: 500 }
    );
  }
}
