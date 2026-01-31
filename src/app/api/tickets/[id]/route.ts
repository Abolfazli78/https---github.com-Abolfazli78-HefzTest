import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const ticket = await db.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "تیکت موجود نیست" }, { status: 404 });
    }

    // Check if user owns the ticket or is admin or institute manager of ticket owner
    if (ticket.userId !== session.user.id && session.user.role !== "ADMIN") {
      if (session.user.role === "INSTITUTE") {
        const ticketOwner = await db.user.findUnique({
          where: { id: ticket.userId },
          select: {
            id: true,
            instituteId: true,
            parentId: true,
            teacher: { select: { instituteId: true } },
          },
        });
        const isOrgMember = !!ticketOwner && (
          ticketOwner.instituteId === session.user.id ||
          ticketOwner.parentId === session.user.id ||
          ticketOwner.teacher?.instituteId === session.user.id
        );
        if (!isOrgMember) {
          return NextResponse.json({ error: "غیرمجاز" }, { status: 403 });
        }
      } else {
        return NextResponse.json({ error: "غیرمجاز" }, { status: 403 });
      }
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "خطا در دریافت تیکت" },
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
    const body = await request.json();
    const { subject, category, status } = body as { subject?: string; category?: string | null; status?: "NEW" | "IN_PROGRESS" | "CLOSED" };

    const ticket = await db.supportTicket.update({
      where: { id },
      data: {
        subject,
        category: typeof category === 'undefined' ? undefined : category,
        status,
      },
      include: { messages: true, user: { select: { name: true, email: true } } },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی تیکت" },
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
    await db.supportTicket.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "خطا در حذف تیکت" },
      { status: 500 }
    );
  }
}
