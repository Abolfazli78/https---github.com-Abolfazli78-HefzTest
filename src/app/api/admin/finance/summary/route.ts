import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { PaymentStatus as PaymentStatusEnum } from "@/generated";
import type { PaymentStatus } from "@/generated";
import type { Prisma } from "@/generated/client";

type GroupBy = "day" | "month" | "user" | "role" | "plan";

function mapStatus(input?: string | null): PaymentStatus | undefined {
  if (!input) return undefined;
  const up = input.toUpperCase();
  if (up === "PAID") return PaymentStatusEnum.COMPLETED;
  if ((Object.values(PaymentStatusEnum) as string[]).includes(up)) {
    return up as PaymentStatus;
  }
  return undefined;
}

type SeriesPoint =
  | { date: string; value: number }
  | { month: string; value: number }
  | { userId: string; name: string; value: number }
  | { role: string; value: number }
  | { plan: string; value: number };

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const url = new URL(request.url);
    const fromStr = url.searchParams.get("from");
    const toStr = url.searchParams.get("to");
    const role = url.searchParams.get("role") as
      | "ADMIN"
      | "INSTITUTE"
      | "TEACHER"
      | "STUDENT"
      | null;
    const userId = url.searchParams.get("userId");
    const statusParam = url.searchParams.get("status");
    const status = mapStatus(statusParam);
    const groupBy = (url.searchParams.get("groupBy") as GroupBy | null) || null;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const from = fromStr ? new Date(fromStr) : undefined;
    const to = toStr ? new Date(toStr) : undefined;

    const whereBase: Prisma.PaymentWhereInput = {};
    if (typeof status !== "undefined") whereBase.status = status;
    if (from || to) whereBase.paidAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };

    if (role || userId) {
      whereBase.subscription = {
        is: {
          ...(userId ? { userId } : {}),
          ...(role ? { user: { is: { role } } } : {}),
        },
      };
    }

    // Totals by status (all, ignoring filters except date/role/user for dashboard context)
    const payments = await db.payment.groupBy({
      by: ["status"],
      where: whereBase,
      _sum: { amount: true },
      _count: { _all: true },
    });

    const totalRevenue = payments
      .filter((p) => p.status === "COMPLETED")
      .reduce((acc, p) => acc + (p._sum.amount || 0), 0);

    const mtd = await db.payment.aggregate({
      where: { ...(whereBase || {}), status: "COMPLETED", paidAt: { gte: from ?? startOfMonth, ...(to ? { lte: to } : {}) } },
      _sum: { amount: true },
      _count: { _all: true },
    });

    const lastMonth = await db.payment.aggregate({
      where: { ...(whereBase || {}), status: "COMPLETED", paidAt: { gte: startOfPrevMonth, lte: endOfPrevMonth } },
      _sum: { amount: true },
      _count: { _all: true },
    });

    // Revenue series based on groupBy (default: day, last 30 days if no date filter)
    const rangeWhere: Prisma.PaymentWhereInput = { ...whereBase, status: "COMPLETED" };
    if (!from && !to) {
      const since30 = new Date(now);
      since30.setDate(since30.getDate() - 30);
      rangeWhere.paidAt = { gte: since30 };
    }
    const seriesData = await db.payment.findMany({
      where: rangeWhere,
      select: {
        amount: true,
        paidAt: true,
        subscription: { select: { user: { select: { id: true, role: true, name: true } }, plan: { select: { id: true, name: true } } } },
      },
      orderBy: { paidAt: "asc" },
    });
    let series: SeriesPoint[] = [];
    if (!groupBy || groupBy === "day") {
      const m = new Map<string, number>();
      for (const p of seriesData) {
        const d = p.paidAt ? new Date(p.paidAt) : null;
        if (!d) continue;
        const key = d.toISOString().slice(0, 10);
        m.set(key, (m.get(key) || 0) + p.amount);
      }
      series = Array.from(m.entries()).map(([date, value]) => ({ date, value }));
    } else if (groupBy === "month") {
      const m = new Map<string, number>();
      for (const p of seriesData) {
        const d = p.paidAt ? new Date(p.paidAt) : null;
        if (!d) continue;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        m.set(key, (m.get(key) || 0) + p.amount);
      }
      series = Array.from(m.entries()).map(([month, value]) => ({ month, value }));
    } else if (groupBy === "user") {
      const m = new Map<string, { userId: string; name: string; value: number }>();
      for (const p of seriesData) {
        const u = p.subscription?.user;
        if (!u) continue;
        const key = u.id;
        m.set(key, { userId: u.id, name: u.name || u.id, value: (m.get(key)?.value || 0) + p.amount });
      }
      series = Array.from(m.values());
    } else if (groupBy === "role") {
      const m = new Map<string, number>();
      for (const p of seriesData) {
        const r = p.subscription?.user?.role || "UNKNOWN";
        m.set(r, (m.get(r) || 0) + p.amount);
      }
      series = Array.from(m.entries()).map(([role, value]) => ({ role, value }));
    } else if (groupBy === "plan") {
      const m = new Map<string, number>();
      for (const p of seriesData) {
        const name = p.subscription?.plan?.name || "Unknown";
        m.set(name, (m.get(name) || 0) + p.amount);
      }
      series = Array.from(m.entries()).map(([plan, value]) => ({ plan, value }));
    }

    // Top plans (filtered)
    const topPlans = await db.payment.findMany({
      where: { ...(whereBase || {}), status: "COMPLETED" },
      select: { amount: true, subscription: { select: { plan: { select: { id: true, name: true } } } } },
    });
    const planAgg = new Map<string, { name: string; revenue: number }>();
    for (const p of topPlans) {
      const name = p.subscription?.plan?.name || "Unknown";
      planAgg.set(name, { name, revenue: (planAgg.get(name)?.revenue || 0) + p.amount });
    }
    const topPlansArr = Array.from(planAgg.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Active subscribers and ARPU (unfiltered overview)
    const activeSubs = await db.subscription.count({ where: { status: "ACTIVE", OR: [{ endDate: null }, { endDate: { gt: new Date() } }] } });
    const arpu = activeSubs > 0 ? totalRevenue / activeSubs : 0;

    return NextResponse.json({
      totals: {
        revenueAllTime: totalRevenue,
        paymentsCount: payments.reduce((a, p) => a + p._count._all, 0),
        mtdRevenue: mtd._sum.amount || 0,
        mtdCount: mtd._count._all || 0,
        lastMonthRevenue: lastMonth._sum.amount || 0,
        lastMonthCount: lastMonth._count._all || 0,
      },
      byStatus: payments.map((p) => ({ status: p.status === "COMPLETED" ? "PAID" : p.status, revenue: p._sum.amount || 0, count: p._count._all })),
      series,
      topPlans: topPlansArr,
      activeSubscribers: activeSubs,
      arpu,
    });
  } catch (error) {
    console.error("Finance summary error:", error);
    return NextResponse.json({ error: "خطا در دریافت گزارش مالی" }, { status: 500 });
  }
}
