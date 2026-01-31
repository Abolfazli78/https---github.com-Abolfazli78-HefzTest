import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { UserRole } from "@/generated";

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (!session || (session.user.role !== "INSTITUTE" && session.user.role !== "TEACHER")) {
            return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
        }

        const { phone, email, role } = await request.json();

        const invitePhone = phone ?? email;

        if (!invitePhone || !role) {
            return NextResponse.json({ error: "شماره تلفن و نقش الزامی هستند" }, { status: 400 });
        }

        // Validate role hierarchy
        if (session.user.role === "TEACHER" && role !== "STUDENT") {
            return NextResponse.json({ error: "معلمان فقط می‌توانند دانش‌آموز دعوت کنند" }, { status: 400 });
        }

        if (session.user.role === "INSTITUTE" && role !== "TEACHER") {
            return NextResponse.json({ error: "مدیران موسسه فقط می‌توانند معلم دعوت کنند" }, { status: 400 });
        }

        // Check for existing pending invitation
        const existingInvite = await db.invitation.findFirst({
            where: {
                phone: invitePhone,
                senderId: session.user.id,
                status: "PENDING",
            },
        });

        if (existingInvite) {
            return NextResponse.json({ error: "دعوت‌نامه قبلاً برای این شماره تلفن ارسال شده است" }, { status: 400 });
        }

        const invitation = await db.invitation.create({
            data: {
                phone: invitePhone,
                role: role as UserRole,
                senderId: session.user.id,
                status: "PENDING",
            },
        });

        // If user exists, we could potentially link them now or wait for acceptance
        // For now, we wait for acceptance.

        return NextResponse.json({ message: "دعوت‌نامه با موفقیت ارسال شد", invitation });
    } catch (error) {
        console.error("Error sending invitation:", error);
        return NextResponse.json({ error: "خطا در ارسال دعوت‌نامه" }, { status: 500 });
    }
}
