import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { checkAccess } from "@/lib/access";

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (!session || session.user.role !== "INSTITUTE") {
            return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
        }

        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json({ error: "شماره تلفن الزامی است" }, { status: 400 });
        }

        const teachersCount = await db.user.count({
            where: {
                instituteId: session.user.id,
                role: "TEACHER",
            },
        });

        const access = await checkAccess(session.user.id, "teacher_management", {
            key: "maxTeachersAllowed",
            used: teachersCount,
            requested: 1,
        });
        if (!access.allowed) {
            return NextResponse.json({ error: access.message }, { status: 403 });
        }

        const teacher = await db.user.findFirst({
            where: { 
                phone,
                role: "TEACHER"
            },
        });

        if (!teacher) {
            return NextResponse.json({ error: "کاربری با این شماره تلفن یافت نشد" }, { status: 404 });
        }

        if (teacher.role !== "TEACHER") {
            return NextResponse.json({ error: "فقط کاربران با نقش معلم قابل افزودن هستند" }, { status: 400 });
        }

        if (teacher.instituteId) {
            if (teacher.instituteId === session.user.id) {
                return NextResponse.json({ error: "این معلم قبلاً در موسسه شما بوده است" }, { status: 400 });
            }
            return NextResponse.json({ error: "این معلم در موسسه دیگری مشغول به کار است" }, { status: 400 });
        }

        await db.user.update({
            where: { id: teacher.id },
            data: { instituteId: session.user.id },
        });

        return NextResponse.json({ message: "معلم با موفقیت به موسسه اضافه شد" });
    } catch (error) {
        console.error("Error adding teacher:", error);
        return NextResponse.json({ error: "خطا در افزودن معلم" }, { status: 500 });
    }
}
