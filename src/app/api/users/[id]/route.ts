import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const user = await db.user.findUnique({
      where: { id },
      include: {
        examAttempts: {
          include: {
            exam: true,
          },
          orderBy: { startedAt: "desc" },
          take: 10,
        },
        _count: {
          select: { examAttempts: true, supportTickets: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "کاربر موجود نیست" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات کاربر" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const body: { isActive?: unknown; role?: unknown } = await request.json();
    const { isActive, role } = body;

    // Prepare update data - properly typed
    const updateData: Prisma.UserUpdateInput = {};
    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (
      typeof role === "string" &&
      (Object.values(UserRole) as string[]).includes(role)
    ) {
      updateData.role = role as (typeof UserRole)[keyof typeof UserRole];
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی کاربر" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;

    // Prevent admin from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "نمی‌توانید خودتان را حذف کنید" },
        { status: 400 }
      );
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "خطا در حذف کاربر" },
      { status: 500 }
    );
  }
}

