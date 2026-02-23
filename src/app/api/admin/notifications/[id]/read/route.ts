import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { markNotificationAsRead } from "@/lib/notifications";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    await markNotificationAsRead(id, session.user.id);

    return NextResponse.json({ message: "اعلان خوانده‌شده علامت‌گذاری شد" });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return NextResponse.json({ error: "خطا در علامت‌گذاری اعلان" }, { status: 500 });
  }
}
