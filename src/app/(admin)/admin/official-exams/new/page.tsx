"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function NewOfficialExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    year: new Date().getFullYear(),
    degree: 1,
    juzStart: 1,
    juzEnd: 30,
    durationMinutes: 60,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/official-exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "خطا");
      }
      const exam = await res.json();
      toast.success("آزمون ایجاد شد. اکنون می‌توانید ساختار را پر کنید.");
      router.push(`/admin/official-exams/${exam.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا در ایجاد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/official-exams" className="text-muted-foreground hover:underline">
          ← بازگشت به لیست
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>ایجاد آزمون رسمی</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>عنوان</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="مثال: آزمون رسمی حفظ ۱۴۰۳"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>سال</Label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm((p) => ({ ...p, year: Number(e.target.value) }))}
                  min={1380}
                  max={1500}
                />
              </div>
              <div>
                <Label>مقطع (درجه)</Label>
                <Input
                  type="number"
                  value={form.degree}
                  onChange={(e) => setForm((p) => ({ ...p, degree: Number(e.target.value) }))}
                  min={1}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>جزء شروع</Label>
                <Input
                  type="number"
                  value={form.juzStart}
                  onChange={(e) => setForm((p) => ({ ...p, juzStart: Number(e.target.value) }))}
                  min={1}
                  max={30}
                />
              </div>
              <div>
                <Label>جزء پایان</Label>
                <Input
                  type="number"
                  value={form.juzEnd}
                  onChange={(e) => setForm((p) => ({ ...p, juzEnd: Number(e.target.value) }))}
                  min={1}
                  max={30}
                />
              </div>
            </div>
            <div>
              <Label>مدت زمان (دقیقه)</Label>
              <Input
                type="number"
                value={form.durationMinutes}
                onChange={(e) => setForm((p) => ({ ...p, durationMinutes: Number(e.target.value) }))}
                min={1}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              پس از ایجاد، در صفحه ویرایش با دکمه «ساخت ساختار» سوالات به‌صورت خودکار (۲ حفظ + ۳ مفاهیم به ازای هر جزء) از بانک سوال انتخاب می‌شوند.
            </p>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "در حال ایجاد..." : "ایجاد آزمون"}
              </Button>
              <Link href="/admin/official-exams">
                <Button type="button" variant="outline">
                  انصراف
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
