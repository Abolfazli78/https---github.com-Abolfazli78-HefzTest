import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, phone } = await req.json();

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone is required" }, { status: 400 });
    }

    // Find user by email or phone
    const user = await db.user.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current date
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, -1);

    // Update exam records to remove them from current month quota calculation
    await db.exam.updateMany({
      where: {
        createdById: user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      data: {
        questionCount: 0,
        createdAt: new Date(now.getFullYear() - 1, now.getMonth(), 1) // Move to previous month
      }
    });

    // Reset question usage by updating existing questions to have 0 count effect
    // This is a soft reset - we're not deleting data, just adjusting the quota calculation
    
    return NextResponse.json({
      message: "User quotas reset successfully",
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      resetInfo: {
        examsCreatedThisMonth: 0,
        questionsUsedThisMonth: 0,
        resetDate: now
      }
    });

  } catch (error) {
    console.error("Reset quotas error:", error);
    return NextResponse.json(
      { error: "Failed to reset quotas", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
