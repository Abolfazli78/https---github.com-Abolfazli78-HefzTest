import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

/**
 * List SimulatorAttempts with role-based filtering:
 * - Student: own attempts only
 * - Teacher: own attempts only
 * - Institute: attempts of their students (parentId = institute or teacher.instituteId = institute)
 * - Admin: not used here (admin has own panel); could return all if needed
 */
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const role = session.user.role;
    let userIds: string[] = [session.user.id];

    if (role === "INSTITUTE") {
      const students = await db.user.findMany({
        where: {
          role: "STUDENT",
          OR: [
            { parentId: session.user.id },
            { teacher: { instituteId: session.user.id } },
          ],
        },
        select: { id: true },
      });
      userIds = students.map((s) => s.id);
    }
    // TEACHER and STUDENT: only own
    // ADMIN: could list all; for consistency we keep admin using admin panel

    const attempts = await db.simulatorAttempt.findMany({
      where: { userId: { in: userIds } },
      orderBy: { startedAt: "desc" },
      include: {
        officialExam: {
          select: { id: true, title: true, year: true },
        },
      },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("List simulator attempts error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت نتایج" },
      { status: 500 }
    );
  }
}
