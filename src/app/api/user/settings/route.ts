import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, currentPassword, newPassword } = body as {
      name?: string;
      phone?: string;
      currentPassword?: string;
      newPassword?: string;
    };

    const updates: Record<string, any> = {};

    if (typeof name === "string" && name.trim()) {
      updates.name = name.trim();
    }

    if (typeof phone === "string" && phone.trim()) {
      const normalizedPhone = normalizePhone(String(phone));
      // ensure phone is unique
      const existing = await db.user.findUnique({ where: { phone: normalizedPhone } });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json(
          { error: "این شماره تماس قبلاً ثبت شده است" },
          { status: 400 }
        );
      }
      updates.phone = normalizedPhone;
    }

    if (newPassword) {
      // verify current password if provided; if not provided, allow only if user has no password
      const currentUser = await db.user.findUnique({ where: { id: session.user.id } });
      if (!currentUser) {
        return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
      }
      if (currentUser.password) {
        if (!currentPassword) {
          return NextResponse.json({ error: "رمز عبور فعلی الزامی است" }, { status: 400 });
        }
        const ok = await bcrypt.compare(String(currentPassword), currentUser.password);
        if (!ok) {
          return NextResponse.json({ error: "رمز عبور فعلی نادرست است" }, { status: 400 });
        }
      }
      const hashed = await bcrypt.hash(String(newPassword), 10);
      updates.password = hashed;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "تغییری اعمال نشد" });
    }

    await db.user.update({ where: { id: session.user.id }, data: updates });

    return NextResponse.json({ message: "تغییرات ذخیره شد" });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی تنظیمات" }, { status: 500 });
  }
}
