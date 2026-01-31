import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session) {
            return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
        }

        const invitations = await db.invitation.findMany({
            where: {
                phone: session.user.phone,
                status: "PENDING",
            },
            include: {
                sender: {
                    select: {
                        name: true,
                        role: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(invitations);
    } catch (error) {
        console.error("Error fetching invitations:", error);
        return NextResponse.json({ error: "خطا در دریافت دعوت‌نامه‌ها" }, { status: 500 });
    }
}
