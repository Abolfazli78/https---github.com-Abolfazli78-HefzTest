import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { checkAccess } from "@/lib/access";

type RecipientRole = "ADMIN" | "INSTITUTE" | "TEACHER" | "STUDENT";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      const access = await checkAccess(session.user.id, "ticket_support");
      if (!access.allowed) {
        return NextResponse.json({ error: access.message }, { status: 403 });
      }
    }

    let where: Prisma.SupportTicketWhereInput = {};

    // ADMIN sees all
    if (session.user.role === "ADMIN") {
      where = {};
    } else if (session.user.role === "INSTITUTE") {
      // Institute manager: own tickets OR tickets from members under this institute OR tickets scoped to this institute OR participant
      where = {
        OR: [
          { userId: session.user.id },
          { instituteId: session.user.id },
          { participants: { some: { userId: session.user.id } } },
          {
            user: {
              OR: [
                { instituteId: session.user.id },
                { parentId: session.user.id },
                { teacher: { instituteId: session.user.id } },
              ],
            },
          },
        ],
      };
    } else {
      // Others: own tickets OR participant OR direct recipient
      where = {
        OR: [
          { userId: session.user.id },
          { participants: { some: { userId: session.user.id } } },
          { recipientUserId: session.user.id },
          { recipientRole: session.user.role as RecipientRole },
        ],
      };
    }

    const tickets = await db.supportTicket.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        participants: {
          select: { userId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "خطا در دریافت تیکت‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      const access = await checkAccess(session.user.id, "ticket_support");
      if (!access.allowed) {
        return NextResponse.json({ error: access.message }, { status: 403 });
      }
    }

    const body = await request.json();
    const { subject, category, message, recipientRole, recipientUserId } = body as {
      subject: string;
      category?: string | null;
      message: string;
      recipientRole?: "ADMIN" | "INSTITUTE" | "TEACHER" | "STUDENT";
      recipientUserId?: string | null;
    };

    if (!subject || !message) {
      return NextResponse.json(
        { error: "موضوع و پیام الزامی است" },
        { status: 400 }
      );
    }

    // Determine institute scope for this ticket
    let instituteId: string | null = null;
    if (session.user.role === "INSTITUTE") {
      instituteId = session.user.id;
    } else {
      const me = await db.user.findUnique({ where: { id: session.user.id }, select: { instituteId: true, parentId: true, teacher: { select: { instituteId: true } } } });
      instituteId = me?.instituteId || me?.parentId || me?.teacher?.instituteId || null;
    }

    const ticket = await db.supportTicket.create({
      data: {
        userId: session.user.id,
        subject,
        category: category || null,
        status: "NEW",
        recipientRole: recipientRole || null,
        recipientUserId: recipientUserId || null,
        instituteId: instituteId || null,
        messages: {
          create: {
            message,
            isAdmin: session.user.role === "ADMIN",
          },
        },
        participants: {
          createMany: {
            data: [
              { userId: session.user.id },
              ...(recipientUserId ? [{ userId: recipientUserId }] : []),
            ],
            skipDuplicates: true,
          },
        },
      },
      include: {
        messages: true,
        participants: true,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد تیکت" },
      { status: 500 }
    );
  }
}

