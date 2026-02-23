import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const admin = await db.user.findFirst({
      where: { role: "ADMIN" },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        phoneVerifiedAt: true,
        createdAt: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "مدیر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error("Check admin error:", error);
    return NextResponse.json(
      { error: "خطا در بررسی مدیر" },
      { status: 500 }
    );
  }
}
