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

        const attempts = await db.examAttempt.findMany({
            where: {
                userId: { in: studentIds },
                status: "COMPLETED"
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                exam: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { submittedAt: "desc" },
            take: 50
        });

        return NextResponse.json(attempts);
    } catch (error) {
        console.error("Error fetching attempts:", error);
        return NextResponse.json({ error: "خطا در دریافت اطلاعات" }, { status: 500 });
    }
}
