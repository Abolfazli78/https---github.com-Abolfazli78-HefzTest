import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session || (session.user.role !== "TEACHER" && session.user.role !== "INSTITUTE")) {
            return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
        }

        // Get students linked via parentId
        const students = await db.user.findMany({
            where: { parentId: session.user.id },
            select: { id: true }
        });

        const studentIds = students.map(s => s.id);

        const subscriptions = await db.subscription.findMany({
            where: {
                userId: { in: studentIds }
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                plan: {
                    select: {
                        name: true,
                        price: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return NextResponse.json({ error: "خطا در دریافت اطلاعات اشتراک" }, { status: 500 });
    }
}
