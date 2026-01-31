"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

const discountCodeSchema = z.object({
  code: z.string().min(3, "کد حداقل ۳ کاراکتر"),
  percent: z.number().min(0).max(100, "درصد بین ۰ تا ۱۰۰"),
  expiresAt: z.string().optional(),
  usageLimit: z.number().min(1).optional(),
  isActive: z.boolean(),
});

type DiscountCodeForm = z.infer<typeof discountCodeSchema>;

interface DiscountCode {
  id: string;
  code: string;
  percent: number;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  creator: { id: string; name: string };
}

export default function DiscountCodesPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<DiscountCodeForm>({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const fetchCodes = async () => {
    try {
      const res = await fetch("/api/admin/discount-codes");
      if (res.ok) setCodes(await res.json());
    } catch (error) {
      console.error("Error fetching discount codes:", error);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const onSubmit = async (data: DiscountCodeForm) => {
    setIsLoading(true);
    try {
      // Convert empty usageLimit to null
      const submitData = {
        ...data,
        usageLimit: data.usageLimit && data.usageLimit > 0 ? data.usageLimit : null,
      };

      const url = editingCode
        ? `/api/admin/discount-codes/${editingCode.id}`
        : "/api/admin/discount-codes";
      const method = editingCode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        toast.success(editingCode ? "کد تخفیف ویرایش شد" : "کد تخفیف ایجاد شد");
        setDialogOpen(false);
        reset();
        setEditingCode(null);
        fetchCodes();
      } else {
        const err = await res.json();
        toast.error(err.error || "خطا در ذخیره کد تخفیف");
      }
    } catch (error) {
      toast.error("خطا در ارتباط");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (code: DiscountCode) => {
    setEditingCode(code);
    setValue("code", code.code);
    setValue("percent", code.percent);
    setValue("expiresAt", code.expiresAt ? new Date(code.expiresAt).toISOString().slice(0, 10) : "");
    setValue("usageLimit", code.usageLimit || 0);
    setValue("isActive", code.isActive);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("مطمئنید که می‌خواهید این کد تخفیف را حذف کنید؟")) return;
    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("کد تخفیف حذف شد");
        fetchCodes();
      } else {
        const err = await res.json();
        toast.error(err.error || "خطا در حذف");
      }
    } catch (error) {
      toast.error("خطا در ارتباط");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("کد کپی شد");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">مدیریت کدهای تخفیف</h1>
          <p className="text-muted-foreground mt-1">ایجاد، ویرایش و حذف کدهای تخفیف</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCode(null); reset(); }}>
              <Plus className="h-4 w-4 ml-2" />
              کد تخفیف جدید
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCode ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}</DialogTitle>
              <DialogDescription>
                اطلاعات کد تخفیف را وارد کنید
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">کد تخفیف</Label>
                <Input
                  id="code"
                  placeholder="TEST10"
                  {...register("code")}
                  className="uppercase"
                  dir="ltr"
                />
                {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="percent">درصد تخفیف (%)</Label>
                <Input
                  id="percent"
                  type="number"
                  placeholder="10"
                  {...register("percent", { valueAsNumber: true })}
                  dir="ltr"
                />
                {errors.percent && <p className="text-sm text-red-500">{errors.percent.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">تاریخ انقضا (اختیاری)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  {...register("expiresAt")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">محدودیت استفاده (اختیاری)</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  placeholder="100"
                  {...register("usageLimit", { valueAsNumber: true })}
                  dir="ltr"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="isActive">فعال</Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "در حال ذخیره..." : editingCode ? "ویرایش" : "ایجاد"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>کدهای تخفیف</CardTitle>
          <CardDescription>لیست تمام کدهای تخفیف</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>کد</TableHead>
                <TableHead>درصد</TableHead>
                <TableHead>انقضا</TableHead>
                <TableHead>استفاده</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>ایجاد کننده</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    کد تخفیفی وجود ندارد
                  </TableCell>
                </TableRow>
              ) : (
                codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono" dir="ltr">
                      <div className="flex items-center gap-2">
                        {code.code}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(code.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{code.percent}%</TableCell>
                    <TableCell>
                      {code.expiresAt
                        ? new Date(code.expiresAt).toLocaleDateString("fa-IR")
                        : "بدون انقضا"}
                    </TableCell>
                    <TableCell>
                      {code.usedCount}
                      {code.usageLimit && ` / ${code.usageLimit}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={code.isActive ? "default" : "secondary"}>
                        {code.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                    </TableCell>
                    <TableCell>{code.creator.name}</TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-1">
                        <Button size="icon" variant="outline" onClick={() => handleEdit(code)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => handleDelete(code.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
