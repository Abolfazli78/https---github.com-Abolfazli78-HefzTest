import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitations = await db.invitation.findMany({
      where: { 
        receiverId: session.user.id,
        status: "PENDING"
      },
      include: { 
        sender: { 
          select: { 
            id: true, 
            name: true, 
            phone: true 
          } 
        } 
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Received invitations GET error:", error);
    return NextResponse.json({ error: "خطا در دریافت لیست دعوت‌ها" }, { status: 500 });
  }
}
