import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { checkAccess } from "@/lib/access";

export async function POST(request: Request) {
    try {
        const session = await getServerSession();

        if (!session || session.user.role !== "TEACHER") {
            return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
        }

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "ایمیل الزامی است" }, { status: 400 });
        }

        const studentsCount = await db.user.count({
            where: {
                teacherId: session.user.id,
                role: "STUDENT",
            },
        });

        const access = await checkAccess(session.user.id, "student_management", {
            key: "maxStudentsAllowed",
            used: studentsCount,
            requested: 1,
        });
        if (!access.allowed) {
            return NextResponse.json(
                { error: access.message },
                { status: 403 }
            );
        }

        const student = await db.user.findUnique({
            where: { email },
        });

        if (!student) {
            return NextResponse.json({ error: "کاربری با این ایمیل یافت نشد" }, { status: 404 });
        }

        if (student.role !== "STUDENT") {
            return NextResponse.json({ error: "فقط کاربران با نقش دانش‌آموز قابل افزودن هستند" }, { status: 400 });
        }

        if (student.teacherId) {
            if (student.teacherId === session.user.id) {
                return NextResponse.json({ error: "این دانش‌آموز قبلاً در لیست شما بوده است" }, { status: 400 });
            }
            return NextResponse.json({ error: "این دانش‌آموز تحت نظر معلم دیگری است" }, { status: 400 });
        }

        await db.user.update({
            where: { id: student.id },
            data: { teacherId: session.user.id },
        });

        return NextResponse.json({ message: "دانش‌آموز با موفقیت اضافه شد" });
    } catch (error) {
        console.error("Error adding student:", error);
        return NextResponse.json({ error: "خطا در افزودن دانش‌آموز" }, { status: 500 });
    }
}
