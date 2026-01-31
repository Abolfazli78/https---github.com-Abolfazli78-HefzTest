import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({} as Record<string, unknown>));
    const action = (body?.action as string | undefined) ?? "";

    if (action === "CANCEL") {
      const updated = await db.subscription.update({
        where: { id },
        data: {
          status: "CANCELLED",
          autoRenew: false,
          endDate: new Date(),
        },
      });
      return NextResponse.json(updated);
    }

    if (action === "EXTEND_DAYS") {
      const days = Number(body?.days);
      if (!Number.isFinite(days) || days <= 0) {
        return NextResponse.json({ error: "تعداد روز نامعتبر است" }, { status: 400 });
      }

      const existing = await db.subscription.findUnique({
        where: { id },
        select: { endDate: true },
      });

      if (!existing) {
        return NextResponse.json({ error: "اشتراک یافت نشد" }, { status: 404 });
      }

      const base = existing.endDate ?? new Date();
      const nextEndDate = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

      const updated = await db.subscription.update({
        where: { id },
        data: {
          endDate: nextEndDate,
        },
      });

      return NextResponse.json(updated);
    }

    if (action === "CHANGE_PLAN") {
      const planId = String(body?.planId || "");
      if (!planId) {
        return NextResponse.json({ error: "پلن الزامی است" }, { status: 400 });
      }

      const subscription = await db.subscription.findUnique({
        where: { id },
        include: { user: { select: { role: true } } },
      });
      if (!subscription) {
        return NextResponse.json({ error: "اشتراک یافت نشد" }, { status: 404 });
      }

      const plan = await db.subscriptionPlan.findUnique({
        where: { id: planId },
        select: { id: true, isActive: true, targetRole: true },
      });
      if (!plan || !plan.isActive) {
        return NextResponse.json({ error: "پلن معتبر نیست" }, { status: 400 });
      }

      if (subscription.user.role !== plan.targetRole) {
        return NextResponse.json(
          { error: "نقش کاربر با نقش هدف پلن همخوانی ندارد" },
          { status: 400 }
        );
      }

      const updated = await db.subscription.update({
        where: { id },
        data: {
          planId: plan.id,
        },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "عملیات نامعتبر" }, { status: 400 });
  } catch (error) {
    console.error("Error admin subscription action:", error);
    return NextResponse.json({ error: "خطا در مدیریت اشتراک" }, { status: 500 });
  }
}
