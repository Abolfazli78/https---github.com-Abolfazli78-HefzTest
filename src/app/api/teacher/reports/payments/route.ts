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

        const payments = await db.payment.findMany({
            where: {
                subscription: {
                    userId: { in: studentIds }
                }
            },
            include: {
                subscription: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        },
                        plan: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 20
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json({ error: "خطا در دریافت اطلاعات پرداخت" }, { status: 500 });
    }
}
