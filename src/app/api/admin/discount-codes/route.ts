import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createDiscountNotification } from "@/lib/notifications";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const discountCodes = await db.discountCode.findMany({
      include: {
        creator: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(discountCodes);
  } catch (error) {
    console.error("GET discount codes error:", error);
    return NextResponse.json({ error: "خطا در دریافت کدهای تخفیف" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const { code, percent, expiresAt, usageLimit } = body as {
      code?: string;
      percent?: number;
      expiresAt?: string;
      usageLimit?: number;
    };

    if (!code || !percent || percent < 0 || percent > 100) {
      return NextResponse.json({ error: "کد و درصد تخفیف معتبر نیست" }, { status: 400 });
    }

    const existing = await db.discountCode.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ error: "این کد تخفیف قبلاً ثبت شده است" }, { status: 400 });
    }

    const discountCode = await db.discountCode.create({
      data: {
        code: code.toUpperCase(),
        percent,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit: usageLimit || null,
        createdBy: session.user.id,
      },
    });

    // Send notification to all users about new discount code
    await createDiscountNotification(discountCode.code, discountCode.percent);

    return NextResponse.json(discountCode);
  } catch (error) {
    console.error("POST discount code error:", error);
    return NextResponse.json({ error: "خطا در ایجاد کد تخفیف" }, { status: 500 });
  }
}
