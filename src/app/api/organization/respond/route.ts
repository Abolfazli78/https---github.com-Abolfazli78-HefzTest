import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (!session) {
            return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
        }

        const { invitationId, action } = await request.json();

        if (!invitationId || !["ACCEPT", "REJECT"].includes(action)) {
            return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
        }

        const invitation = await db.invitation.findUnique({
            where: { id: invitationId },
            include: { sender: true }
        });

        if (!invitation || invitation.phone !== session.user.phone || invitation.status !== "PENDING") {
            return NextResponse.json({ error: "دعوت‌نامه معتبر یافت نشد" }, { status: 404 });
        }

        if (action === "REJECT") {
            await db.invitation.update({
                where: { id: invitationId },
                data: { status: "REJECTED" }
            });
            return NextResponse.json({ message: "دعوت‌نامه رد شد" });
        }

        // ACCEPT logic
        await db.$transaction([
            db.invitation.update({
                where: { id: invitationId },
                data: {
                    status: "ACCEPTED",
                    receiverId: session.user.id
                }
            }),
            db.user.update({
                where: { id: session.user.id },
                data: {
                    parentId: invitation.senderId,
                    // Also update legacy fields for compatibility
                    teacherId: invitation.role === "STUDENT" ? invitation.senderId : undefined,
                    instituteId: invitation.role === "TEACHER" ? invitation.senderId : undefined,
                }
            })
        ]);

        return NextResponse.json({ message: "دعوت‌نامه با موفقیت پذیرفته شد" });
    } catch (error) {
        console.error("Error responding to invitation:", error);
        return NextResponse.json({ error: "خطا در پاسخ به دعوت‌نامه" }, { status: 500 });
    }
}
