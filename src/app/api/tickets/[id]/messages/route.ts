import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { checkAccess } from "@/lib/access";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    if (session.user.role === "STUDENT") {
      return NextResponse.json(
        { error: "این قابلیت در پلن فعلی شما موجود نیست" },
        { status: 403 }
      );
    }

    if (session.user.role !== "ADMIN") {
      const access = await checkAccess(session.user.id, "ticket_support");
      if (!access.allowed) {
        return NextResponse.json({ error: access.message }, { status: 403 });
      }
    }

    const { id } = await params;
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "پیام الزامی است" },
        { status: 400 }
      );
    }

    // Verify ticket exists and user has access
    const ticket = await db.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: "تیکت موجود نیست" }, { status: 404 });
    }

    // Check if user owns the ticket, or is admin, or is institute manager of the ticket's owner
    if (ticket.userId !== session.user.id && session.user.role !== "ADMIN") {
      // If institute, verify ownership of the ticket's user
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

    // Check if ticket is closed
    if (ticket.status === "CLOSED") {
      return NextResponse.json(
        { error: "تیکت بسته شده است" },
        { status: 400 }
      );
    }

    // Update ticket status if admin is replying
    if (session.user.role === "ADMIN" && ticket.status === "NEW") {
      await db.supportTicket.update({
        where: { id },
        data: { status: "IN_PROGRESS" },
      });
    }

    // Create message
    const ticketMessage = await db.ticketMessage.create({
      data: {
        ticketId: id,
        userId: session.user.id,
        message,
        isAdmin: session.user.role === "ADMIN",
      },
    });

    return NextResponse.json(ticketMessage, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "خطا در ارسال پیام" },
      { status: 500 }
    );
  }
}

