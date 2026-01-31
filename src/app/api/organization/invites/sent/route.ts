import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session) {
            return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
        }

        const invites = await db.invitation.findMany({
            where: {
                senderId: session.user.id,
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(invites);
    } catch (error) {
        console.error("Error fetching sent invites:", error);
        return NextResponse.json({ error: "خطا در دریافت دعوت‌نامه‌ها" }, { status: 500 });
    }
}
