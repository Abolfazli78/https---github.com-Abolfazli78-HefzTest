import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { code, percent, expiresAt, usageLimit, isActive } = body as {
      code?: string;
      percent?: number;
      expiresAt?: string;
      usageLimit?: number;
      isActive?: boolean;
    };

    const discountCode = await db.discountCode.findUnique({ where: { id } });
    if (!discountCode) {
      return NextResponse.json({ error: "کد تخفیف یافت نشد" }, { status: 404 });
    }

    const updateData: Prisma.DiscountCodeUpdateInput = {};
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (percent !== undefined) updateData.percent = percent;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (code && code !== discountCode.code) {
      const existing = await db.discountCode.findUnique({ where: { code: code.toUpperCase() } });
      if (existing) {
        return NextResponse.json({ error: "این کد تخفیف قبلاً ثبت شده است" }, { status: 400 });
      }
    }

    const updated = await db.discountCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT discount code error:", error);
    return NextResponse.json({ error: "خطا در ویرایش کد تخفیف" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;

    const discountCode = await db.discountCode.findUnique({ where: { id } });
    if (!discountCode) {
      return NextResponse.json({ error: "کد تخفیف یافت نشد" }, { status: 404 });
    }

    await db.discountCode.delete({ where: { id } });

    return NextResponse.json({ message: "کد تخفیف حذف شد" });
  } catch (error) {
    console.error("DELETE discount code error:", error);
    return NextResponse.json({ error: "خطا در حذف کد تخفیف" }, { status: 500 });
  }
}
