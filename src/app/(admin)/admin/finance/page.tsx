import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { headers } from "next/headers";
import FinanceDashboardAdvanced from "./FinanceDashboardAdvanced";

async function getSummary() {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const proto = process.env.NODE_ENV === "development" ? "http" : "https";
  const base = host ? `${proto}://${host}` : "";
  const cookie = hdrs.get("cookie") || "";
  const res = await fetch(`${base}/api/admin/finance/summary`, {
    cache: "no-store",
    headers: {
      cookie,
    },
  });
  if (!res.ok) throw new Error("failed");
  const data = await res.json();
  return { ...data, dailyRevenue: data.series ?? data.dailyRevenue };
}

export default async function AdminFinancePage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  const data = await getSummary();
  return <FinanceDashboardAdvanced initial={data} />;
}
