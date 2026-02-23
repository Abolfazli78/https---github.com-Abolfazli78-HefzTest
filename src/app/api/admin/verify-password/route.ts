import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    const admin = await db.user.findFirst({
      where: { role: "ADMIN" },
      select: {
        id: true,
        phone: true,
        password: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "مدیر یافت نشد" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    return NextResponse.json({
      adminId: admin.id,
      phone: admin.phone,
      passwordProvided: password,
      isValid,
      passwordHash: admin.password.substring(0, 20) + "...", // First 20 chars
    });
  } catch (error) {
    console.error("Verify password error:", error);
    return NextResponse.json(
      { error: "خطا در بررسی رمز عبور" },
      { status: 500 }
    );
  }
}
