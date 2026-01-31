"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

export type UserRole = "ADMIN" | "INSTITUTE" | "TEACHER" | "STUDENT";
export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";
export type GroupBy = "day" | "month" | "user" | "role" | "plan";
export type DatePreset = "today" | "this_month" | "this_year" | "custom";
export type TransactionType = "INCOME" | "EXPENSE";

export interface Totals {
  revenueAllTime: number;
  mtdRevenue: number;
  mtdCount: number;
  lastMonthRevenue: number;
  lastMonthCount: number;
}

export interface SeriesItem {
  date?: string;
  month?: string;
  name?: string;
  role?: UserRole;
  plan?: string;
  value: number;
}

export interface StatusAggregation {
  status: PaymentStatus;
  revenue: number;
  count: number;
}

export interface TopPlan {
  name: string;
  revenue: number;
}

export interface TransactionRow {
  id: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  userId?: string;
  userName?: string;
  plan?: string;
  type?: TransactionType;
}

export interface DashboardState {
  totals: Totals;
  series: SeriesItem[];
  byStatus: StatusAggregation[];
  topPlans: TopPlan[];
  transactions?: TransactionRow[];
  activeSubscribers?: number;
  arpu?: number;
}

interface FinanceDashboardAdvancedProps {
  initial: DashboardState;
}

const nf = new Intl.NumberFormat("fa-IR");
const chartFont = "Vazirmatn, IRANSans, sans-serif";
const money = (v: number | undefined) => `${nf.format(Math.max(0, Math.round(v ?? 0)))} تومان`;

type TooltipValue = number | string | undefined;
const CurrencyTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value?: TooltipValue; color?: string; name?: string }[]; label?: string | number }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border border-slate-200/70 bg-white/90 p-3 text-right text-sm shadow-lg backdrop-blur-md"
      style={{ fontFamily: chartFont }}
    >
      <div className="text-xs text-slate-500">برچسب: {String(label ?? "-")}</div>
      {payload.map((item, index) => (
        <div key={`${item.name ?? "value"}-${index}`} className="mt-2 flex items-center justify-end gap-2 text-slate-900">
          <span className="text-xs text-slate-500">{item.name ?? "مقدار"}</span>
          <span className="text-sm font-semibold">{money(Number(item.value) || 0)}</span>
          <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color ?? "#4f46e5" }} />
        </div>
      ))}
    </div>
  );
};

const toDate = (d: Date) => d.toISOString().slice(0, 10);
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return toDate(d);
};
const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return toDate(d);
};
const startOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return toDate(d);
};
const startOfYear = () => {
  const d = new Date();
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return toDate(d);
};

const xKeyFor = (groupBy: GroupBy): keyof SeriesItem => {
  if (groupBy === "month") return "month";
  if (groupBy === "user") return "name";
  if (groupBy === "role") return "role";
  if (groupBy === "plan") return "plan";
  return "date";
};

export default function FinanceDashboardAdvanced({ initial }: FinanceDashboardAdvancedProps) {
  const [datePreset, setDatePreset] = useState<DatePreset>("this_month");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [status, setStatus] = useState<PaymentStatus | undefined>(undefined);
  const [type, setType] = useState<TransactionType | undefined>(undefined);
  const [userName, setUserName] = useState<string>("");
  const [groupBy, setGroupBy] = useState<GroupBy>("day");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [state, setState] = useState<DashboardState>(initial);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setState(initial);
  }, [initial]);

  const dateRange = useMemo(() => {
    if (datePreset === "today") return { from: startOfToday(), to: endOfToday() };
    if (datePreset === "this_month") return { from: startOfMonth(), to: endOfToday() };
    if (datePreset === "this_year") return { from: startOfYear(), to: endOfToday() };
    return { from, to };
  }, [datePreset, from, to]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (dateRange.from) params.set("from", dateRange.from);
    if (dateRange.to) params.set("to", dateRange.to);
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    if (userName.trim()) params.set("userName", userName.trim());
    if (groupBy) params.set("groupBy", groupBy);
    return params.toString();
  }, [dateRange, role, status, userName, groupBy]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`/api/admin/finance/summary?${queryString}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as DashboardState;
      setState({
        totals: json.totals,
        series: Array.isArray(json.series) ? json.series : [],
        byStatus: Array.isArray(json.byStatus) ? json.byStatus : [],
        topPlans: Array.isArray(json.topPlans) ? json.topPlans : [],
        transactions: Array.isArray(json.transactions) ? json.transactions : [],
        activeSubscribers: json.activeSubscribers ?? 0,
        arpu: json.arpu ?? 0,
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.");
      }
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  const onExport = useCallback(() => {
    const url = `/api/admin/finance/export${queryString ? `?${queryString}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [queryString]);

  const transactions = state.transactions ?? [];
  const filteredTransactions = useMemo(() => {
    if (!type) return transactions;
    return transactions.filter((t) => t.type === type);
  }, [transactions, type]);

  const totalRevenue = state.totals?.revenueAllTime ?? 0;
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const activeSubscribers = state.activeSubscribers ?? 0;
  const arpu = typeof state.arpu === "number" ? state.arpu : (state.totals?.mtdRevenue ?? 0) / Math.max(1, activeSubscribers);

  const xKey = xKeyFor(groupBy);
  const series = state.series ?? [];
  const hasSeries = series.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">گزارش مالی</h1>
        <p className="text-muted-foreground">نمای کلی فروش، درآمد و اشتراک‌ها</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فیلترها</CardTitle>
          <CardDescription>بازه زمانی، نقش/کاربر، وضعیت پرداخت، نوع تراکنش و گروه‌بندی</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-7">
            <div>
              <label className="text-sm mb-1 block">بازه زمانی</label>
              <Select value={datePreset} onValueChange={(v: DatePreset) => setDatePreset(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">امروز</SelectItem>
                  <SelectItem value="this_month">این ماه</SelectItem>
                  <SelectItem value="this_year">امسال</SelectItem>
                  <SelectItem value="custom">سفارشی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-1 block">از تاریخ</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} disabled={datePreset !== "custom"} />
            </div>
            <div>
              <label className="text-sm mb-1 block">تا تاریخ</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} disabled={datePreset !== "custom"} />
            </div>
            <div>
              <label className="text-sm mb-1 block">نقش</label>
              <div className="flex gap-2">
                <Select value={role ?? undefined} onValueChange={(v: UserRole) => setRole(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ادمین</SelectItem>
                    <SelectItem value="INSTITUTE">مدیر موسسه</SelectItem>
                    <SelectItem value="TEACHER">معلم</SelectItem>
                    <SelectItem value="STUDENT">دانش‌آموز</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setRole(undefined)}>همه</Button>
              </div>
            </div>
            <div>
              <label className="text-sm mb-1 block">نام کاربر</label>
              <Input placeholder="نام کاربر" value={userName} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm mb-1 block">وضعیت</label>
              <div className="flex gap-2">
                <Select value={status ?? undefined} onValueChange={(v: PaymentStatus) => setStatus(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAID">PAID</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="FAILED">FAILED</SelectItem>
                    <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setStatus(undefined)}>همه</Button>
              </div>
            </div>
            <div>
              <label className="text-sm mb-1 block">نوع تراکنش</label>
              <div className="flex gap-2">
                <Select value={type ?? undefined} onValueChange={(v: TransactionType) => setType(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="همه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">درآمد</SelectItem>
                    <SelectItem value="EXPENSE">هزینه</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setType(undefined)}>همه</Button>
              </div>
            </div>
            <div>
              <label className="text-sm mb-1 block">گروه‌بندی</label>
              <Select value={groupBy} onValueChange={(v: GroupBy) => setGroupBy(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">روز</SelectItem>
                  <SelectItem value="month">ماه</SelectItem>
                  <SelectItem value="user">کاربر</SelectItem>
                  <SelectItem value="role">نقش</SelectItem>
                  <SelectItem value="plan">پلن</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={refetch} disabled={loading}>{loading ? "در حال اعمال..." : "اعمال فیلتر"}</Button>
            <Button variant="outline" onClick={onExport} disabled={loading}>خروجی CSV</Button>
          </div>
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>درآمد کل</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(totalRevenue)}</div>
            <div className="text-sm text-muted-foreground">MTD: {money(state.totals?.mtdRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>هزینه‌ها</CardTitle>
            <CardDescription>بر اساس تراکنش‌های هزینه</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(totalExpenses)}</div>
            <div className="text-sm text-muted-foreground">آخرین ماه: {money(state.totals?.lastMonthRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>سود خالص</CardTitle>
            <CardDescription>درآمد - هزینه</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(netProfit)}</div>
            <div className="text-sm text-muted-foreground">تعداد تراکنش MTD: {nf.format(state.totals?.mtdCount ?? 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ARPU</CardTitle>
            <CardDescription>درآمد متوسط هر کاربر فعال</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(arpu)}</div>
            <div className="text-sm text-muted-foreground">مشترک فعال: {nf.format(activeSubscribers)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>روند درآمد</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {hasSeries ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ left: 12, right: 8, top: 12, bottom: 8 }}>
                  <defs>
                    <linearGradient id="revenueLine" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                  <XAxis
                    dataKey={xKey as string}
                    tick={{ fontSize: 12, fontFamily: chartFont, fill: "#334155" }}
                    tickFormatter={(v: unknown) => String(v ?? "")}
                    interval={0}
                  />
                  <YAxis
                    width={96}
                    tick={{ fontSize: 12, fontFamily: chartFont, fill: "#334155" }}
                    tickFormatter={(v: number | string | undefined) => money(Number(v) || 0)}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#revenueLine)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name="درآمد"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">داده‌ای برای نمایش وجود ندارد</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>برترین پلن‌ها</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {state.topPlans?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={state.topPlans} layout="vertical" margin={{ left: 40, right: 16, top: 12, bottom: 8 }}>
                  <defs>
                    <linearGradient id="planBar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.1)" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fontFamily: chartFont, fill: "#334155" }}
                    tickFormatter={(v: number | string | undefined) => money(Number(v) || 0)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={180}
                    tick={{ fontSize: 12, fontFamily: chartFont, fill: "#334155" }}
                    tickLine={false}
                    axisLine={false}
                    textAnchor="end"
                    dx={-10}
                  />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Bar dataKey="revenue" fill="url(#planBar)" radius={[0, 6, 6, 0]} name="درآمد" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">داده‌ای برای نمایش وجود ندارد</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تجمیع وضعیت پرداخت‌ها</CardTitle>
          <CardDescription>بر اساس وضعیت</CardDescription>
        </CardHeader>
        <CardContent>
          {state.byStatus?.length ? (
            <div className="grid md:grid-cols-3 gap-4">
              {state.byStatus.map((s) => (
                <div key={s.status} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <Badge>{s.status}</Badge>
                    <span className="text-sm text-muted-foreground">{nf.format(s.count)} تراکنش</span>
                  </div>
                  <div className="mt-2 text-xl font-bold">{money(s.revenue)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">داده‌ای برای نمایش وجود ندارد</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تراکنش‌ها</CardTitle>
          <CardDescription>لیست تراکنش‌های مالی (در صورت موجود بودن در پاسخ)</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-right">
                    <th className="py-2">تاریخ</th>
                    <th className="py-2">کاربر</th>
                    <th className="py-2">پلن</th>
                    <th className="py-2">نوع</th>
                    <th className="py-2">وضعیت</th>
                    <th className="py-2">مبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="border-b">
                      <td className="py-2">{t.date}</td>
                      <td className="py-2">{t.userName || t.userId || "-"}</td>
                      <td className="py-2">{t.plan || "-"}</td>
                      <td className="py-2">{t.type === "EXPENSE" ? "هزینه" : t.type === "INCOME" ? "درآمد" : "-"}</td>
                      <td className="py-2">{t.status}</td>
                      <td className="py-2">{money(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-muted-foreground">تراکنشی برای نمایش وجود ندارد</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
