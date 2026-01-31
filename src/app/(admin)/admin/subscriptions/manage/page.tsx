"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, User, XCircle, CalendarPlus, RefreshCw } from "lucide-react";

type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";

type PlanRow = {
  id: string;
  name: string;
  price: number;
  duration: number;
  targetRole: string;
  isActive: boolean;
};

type SubscriptionRow = {
  id: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  user: { id: string; name: string | null; email: string | null; role: string };
  plan: { id: string; name: string; price: number; targetRole: string };
  createdAt: string;
};

const statusLabel: Record<SubscriptionStatus, string> = {
  ACTIVE: "فعال",
  EXPIRED: "منقضی",
  CANCELLED: "لغو",
  PENDING: "در انتظار",
};

export default function AdminManageSubscriptionsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<SubscriptionStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState<SubscriptionRow[]>([]);

  const [extendOpen, setExtendOpen] = useState(false);
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SubscriptionRow | null>(null);
  const [extendDays, setExtendDays] = useState("30");
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const load = async (query: string) => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/subscriptions", window.location.origin);
      if (query.trim()) url.searchParams.set("q", query.trim());
      const res = await fetch(url.toString());
      if (!res.ok) {
        const err: { error?: string } = await res.json().catch(() => ({}));
        toast.error(err.error || "خطا در دریافت اشتراک‌ها");
        return;
      }
      const data = await res.json();
      setRows(data);
    } catch (e) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const openExtend = (row: SubscriptionRow) => {
    setSelectedRow(row);
    setExtendDays("30");
    setExtendOpen(true);
  };

  const openChangePlan = async (row: SubscriptionRow) => {
    setSelectedRow(row);
    setSelectedPlanId("");
    setPlans([]);
    setChangePlanOpen(true);

    try {
      const res = await fetch(`/api/subscriptions/plans?targetRole=${encodeURIComponent(row.user.role)}`);
      if (!res.ok) {
        const err: { error?: string } = await res.json().catch(() => ({}));
        toast.error(err.error || "خطا در دریافت پلن‌ها");
        return;
      }
      const data = await res.json();
      setPlans(data);
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  const doExtend = async () => {
    if (!selectedRow) return;
    const days = Number(extendDays);
    if (!Number.isFinite(days) || days <= 0) {
      toast.error("تعداد روز نامعتبر است");
      return;
    }

    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/admin/subscriptions/${selectedRow.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EXTEND_DAYS", days }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "خطا در تمدید");
        return;
      }
      toast.success("تمدید انجام شد");
      setExtendOpen(false);
      void load(q);
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsActionLoading(false);
    }
  };

  const doChangePlan = async () => {
    if (!selectedRow) return;
    if (!selectedPlanId) {
      toast.error("پلن را انتخاب کنید");
      return;
    }

    const picked = plans.find((p) => p.id === selectedPlanId);
    if (!picked) {
      toast.error("پلن معتبر نیست");
      return;
    }

    if (picked.targetRole !== selectedRow.user.role) {
      toast.error("نقش پلن با نقش کاربر همخوانی ندارد");
      return;
    }

    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/admin/subscriptions/${selectedRow.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CHANGE_PLAN", planId: selectedPlanId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "خطا در تغییر پلن");
        return;
      }
      toast.success("پلن تغییر کرد");
      setChangePlanOpen(false);
      void load(q);
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const filtered = useMemo(() => {
    if (status === "ALL") return rows;
    return rows.filter((r) => r.status === status);
  }, [rows, status]);

  const cancelSubscription = async (id: string) => {
    if (!confirm("اشتراک لغو شود؟")) return;
    try {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "خطا در لغو اشتراک");
        return;
      }
      toast.success("اشتراک لغو شد");
      void load(q);
    } catch {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/subscriptions">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 ml-2" />
              بازگشت
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">مدیریت حرفه‌ای اشتراک‌ها</h1>
            <p className="text-muted-foreground">جستجو، فیلتر و مدیریت اشتراک کاربران</p>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">فیلترها</CardTitle>
          <CardDescription>نام/ایمیل کاربر یا نام پلن را جستجو کنید</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو..."
            className="md:max-w-md"
          />
          <Button variant="outline" onClick={() => void load(q)}>
            جستجو
          </Button>
          <div className="md:mr-auto" />
          <Select value={status} onValueChange={(v) => setStatus(v as SubscriptionStatus | "ALL")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">همه</SelectItem>
              <SelectItem value="ACTIVE">فعال</SelectItem>
              <SelectItem value="PENDING">در انتظار</SelectItem>
              <SelectItem value="EXPIRED">منقضی</SelectItem>
              <SelectItem value="CANCELLED">لغو</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>اشتراک‌ها</CardTitle>
          <CardDescription>برای مدیریت کاربر روی نام/ایمیل کلیک کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={extendOpen} onOpenChange={setExtendOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تمدید اشتراک</DialogTitle>
                <DialogDescription>
                  تعداد روز تمدید را مشخص کنید.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">کاربر</div>
                <div className="font-medium">{selectedRow?.user.name || "(بدون نام)"}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">روز</div>
                <Input value={extendDays} onChange={(e) => setExtendDays(e.target.value)} dir="ltr" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setExtendOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={() => void doExtend()} disabled={isActionLoading}>
                  {isActionLoading ? "در حال انجام..." : "تمدید"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={changePlanOpen} onOpenChange={setChangePlanOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تغییر پلن اشتراک</DialogTitle>
                <DialogDescription>
                  فقط پلن‌های هم‌نقش با کاربر قابل انتخاب هستند.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">کاربر</div>
                <div className="font-medium">{selectedRow?.user.name || "(بدون نام)"}</div>
                <div className="text-xs text-muted-foreground" dir="ltr">{selectedRow?.user.email || "-"}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">پلن</div>
                <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب پلن" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans
                      .filter((p) => p.isActive)
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} - {p.price.toLocaleString("fa-IR")} تومان
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setChangePlanOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={() => void doChangePlan()} disabled={isActionLoading}>
                  {isActionLoading ? "در حال انجام..." : "تغییر پلن"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">در حال بارگذاری...</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">موردی یافت نشد</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>کاربر</TableHead>
                  <TableHead>نقش</TableHead>
                  <TableHead>پلن</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>شروع</TableHead>
                  <TableHead>پایان</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Link
                        href={`/admin/users/${row.user.id}`}
                        className="font-medium hover:underline"
                      >
                        {row.user.name || "(بدون نام)"}
                      </Link>
                      <div className="text-xs text-muted-foreground" dir="ltr">
                        {row.user.email || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{row.plan.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {row.plan.price.toLocaleString("fa-IR")} تومان · {row.plan.targetRole}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.status === "ACTIVE" ? "default" : "secondary"}>
                        {statusLabel[row.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(row.startDate).toLocaleDateString("fa-IR")}</TableCell>
                    <TableCell>
                      {row.endDate ? new Date(row.endDate).toLocaleDateString("fa-IR") : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/users/${row.user.id}`}>
                          <Button variant="outline" size="sm">
                            <User className="h-4 w-4 ml-1" />
                            جزئیات
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openChangePlan(row)}
                        >
                          <RefreshCw className="h-4 w-4 ml-1" />
                          تغییر پلن
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openExtend(row)}
                        >
                          <CalendarPlus className="h-4 w-4 ml-1" />
                          تمدید
                        </Button>
                        {row.status === "ACTIVE" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => void cancelSubscription(row.id)}
                          >
                            <XCircle className="h-4 w-4 ml-1" />
                            لغو
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
