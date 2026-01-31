"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

type FinanceTotals = {
  revenueAllTime: number;
  paymentsCount: number;
  mtdRevenue: number;
  mtdCount: number;
  lastMonthRevenue: number;
  lastMonthCount: number;
};

type FinanceSeriesPoint =
  | { date: string; value: number }
  | { month: string; value: number }
  | { userId: string; name: string; value: number }
  | { role: string; value: number }
  | { plan: string; value: number };

type FinanceByStatusRow = { status: string; revenue: number; count: number };

type FinanceTopPlanRow = { name: string; revenue: number };

type FinanceDashboardData = {
  totals: FinanceTotals;
  byStatus: FinanceByStatusRow[];
  series: FinanceSeriesPoint[];
  topPlans: FinanceTopPlanRow[];
  activeSubscribers: number;
  arpu: number;
  dailyRevenue?: { date: string; value: number }[];
};

export default function FinanceDashboardClient({ data }: { data: FinanceDashboardData }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">گزارش مالی</h1>
        <p className="text-muted-foreground">نمای کلی فروش، درآمد و اشتراک‌ها</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>درآمد کل</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.totals?.revenueAllTime || 0).toLocaleString('fa-IR')} تومان</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>درآمد این ماه</CardTitle>
            <CardDescription>MTD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.totals?.mtdRevenue || 0).toLocaleString('fa-IR')} تومان</div>
            <div className="text-sm text-muted-foreground">تعداد تراکنش: {data.totals?.mtdCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ماه قبل</CardTitle>
            <CardDescription>Last month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.totals?.lastMonthRevenue || 0).toLocaleString('fa-IR')} تومان</div>
            <div className="text-sm text-muted-foreground">تعداد تراکنش: {data.totals?.lastMonthCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ARPU</CardTitle>
            <CardDescription>درآمد متوسط هر کاربر فعال</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((data.arpu || 0)).toLocaleString('fa-IR')} تومان</div>
            <div className="text-sm text-muted-foreground">مشترک فعال: {data.activeSubscribers || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>روند درآمد ۳۰ روز اخیر</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyRevenue || []} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v: number | string | undefined)=> `${Number(v || 0).toLocaleString("fa-IR")} تومان`} width={80} />
                <Tooltip formatter={(v: number | string | undefined)=> `${Number(v || 0).toLocaleString("fa-IR")} تومان`} labelFormatter={(l: unknown)=>`برچسب: ${String(l ?? "")}`} />
                <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>برترین پلن‌ها</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topPlans || []} layout="vertical" margin={{ left: 32, right: 16, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v: number | string | undefined)=> `${Number(v || 0).toLocaleString("fa-IR")} تومان`} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip formatter={(v: number | string | undefined)=> `${Number(v || 0).toLocaleString("fa-IR")} تومان`} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تجمیع وضعیت پرداخت‌ها</CardTitle>
          <CardDescription>بر اساس Status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {(data.byStatus || []).map((s) => (
              <div key={s.status} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <Badge>{s.status}</Badge>
                  <span className="text-sm text-muted-foreground">{s.count} تراکنش</span>
                </div>
                <div className="mt-2 text-xl font-bold">{Number(s.revenue||0).toLocaleString('fa-IR')} تومان</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
