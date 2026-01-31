import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log("API route called");
    const session = await auth();
    if (!session?.user?.id) {
      console.log("No session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    console.log("Invitation ID:", id);
    
    const body = await request.json();
    console.log("Request body:", body);
    const { action } = body as { action?: "accept" | "reject" };

    if (!action || !["accept", "reject"].includes(action)) {
      console.log("Invalid action:", action);
      return NextResponse.json({ error: "عملیات نامعتبر است" }, { status: 400 });
    }

    // Find the invitation
    const invitation = await db.invitation.findUnique({
      where: { id },
      include: { sender: true, receiver: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "دعوت‌نامه یافت نشد" }, { status: 404 });
    }

    if (invitation.receiverId !== session.user.id) {
      return NextResponse.json({ error: "شما مجوز پاسخ به این دعوت‌نامه را ندارید" }, { status: 403 });
    }

    if (invitation.status !== "PENDING") {
      return NextResponse.json({ error: "این دعوت‌نامه قبلاً پاسخ داده شده است" }, { status: 400 });
    }

    // Update invitation status
    const updatedInvitation = await db.invitation.update({
      where: { id },
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
    console.error("Invitation response error:", error);
    return NextResponse.json({ error: "خطا در پاسخ به دعوت‌نامه" }, { status: 500 });
  }
}
