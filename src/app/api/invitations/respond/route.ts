import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    console.log("Simple respond API called");
    const session = await auth();
    if (!session?.user?.id) {
      console.log("No session");
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }
    
    const body = await request.json();
    console.log("Simple respond body:", body);
    const { invitationId, action } = body;

    if (!invitationId || !action || !["accept", "reject"].includes(action)) {
      console.log("Invalid data:", { invitationId, action });
      return NextResponse.json({ error: "عملیات نامعتبر است" }, { status: 400 });
    }

    // Find the invitation
    const invitation = await db.invitation.findUnique({
      where: { id: invitationId },
      include: { sender: true, receiver: true },
    });

    if (!invitation) {
      console.log("Invitation not found");
      return NextResponse.json({ error: "دعوت‌نامه یافت نشد" }, { status: 404 });
    }

    if (invitation.receiverId !== session.user.id) {
      console.log("Not authorized");
      return NextResponse.json({ error: "شما مجوز پاسخ به این دعوت‌نامه را ندارید" }, { status: 403 });
    }

    if (invitation.status !== "PENDING") {
      console.log("Already responded");
      return NextResponse.json({ error: "این دعوت‌نامه قبلاً پاسخ داده شده است" }, { status: 400 });
    }

    // Update invitation status
    const updatedInvitation = await db.invitation.update({
      where: { id: invitationId },
      data: {
        status: action === "accept" ? "ACCEPTED" : "REJECTED",
      },
    });

    // If accepted, update user relationships
    if (action === "accept") {
      await db.user.update({
        where: { id: session.user.id },
        data: {
          parentId: invitation.senderId,
          teacherId: invitation.role === "STUDENT" ? invitation.senderId : null,
          instituteId: invitation.role === "TEACHER" ? invitation.senderId : null,
        },
      });
    }

    // Create notification for the sender
    await createNotification({
      userId: invitation.senderId,
      title: action === "accept" ? "دعوت‌نامه پذیرفته شد" : "دعوت‌نامه رد شد",
      message: `${invitation.receiver?.name || "کاربر"} دعوت‌نامه شما را ${
        action === "accept" ? "پذیرفت" : "رد کرد"
      } و ${action === "accept" ? "به تیم شما پیوست" : "به تیم شما نپیوست"}.`,
      type: action === "accept" ? "SUCCESS" : "WARNING",
    });

    return NextResponse.json({
      message: `دعوت‌نامه با موفقیت ${action === "accept" ? "پذیرفته" : "رد"} شد`,
      invitation: updatedInvitation,
    });
  } catch (error) {
    console.error("Simple respond error:", error);
    return NextResponse.json({ error: "خطا در پاسخ به دعوت‌نامه" }, { status: 500 });
  }
}
