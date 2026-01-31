import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim();

    const subscriptions = await db.subscription.findMany({
      where: q
        ? {
            OR: [
              { user: { name: { contains: q, mode: "insensitive" } } },
              { user: { email: { contains: q, mode: "insensitive" } } },
              { plan: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        plan: { select: { id: true, name: true, price: true, targetRole: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching admin subscriptions:", error);
    return NextResponse.json({ error: "خطا در دریافت اشتراک‌ها" }, { status: 500 });
  }
}
