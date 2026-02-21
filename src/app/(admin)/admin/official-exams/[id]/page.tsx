"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type OfficialExam = {
  id: string;
  title: string;
  year: number;
  degree: number;
  juzStart: number;
  juzEnd: number;
  durationMinutes: number;
  totalQuestions: number;
  isActive: boolean;
  questions?: Array<{
    id: string;
    order: number;
    juz: number;
    questionKind: string;
    question: { id: string; questionText: string };
  }>;
};

export default function OfficialExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [exam, setExam] = useState<OfficialExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<OfficialExam>>({});

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/official-exams/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setExam(data);
        if (data) setEditForm({ title: data.title, year: data.year, degree: data.degree, juzStart: data.juzStart, juzEnd: data.juzEnd, durationMinutes: data.durationMinutes, isActive: data.isActive });
      })
      .catch(() => setExam(null))
      .finally(() => setLoading(false));
  }, [id]);

  const buildStructure = async () => {
    setBuilding(true);
    try {
      const res = await fetch(`/api/admin/official-exams/${id}/build-structure`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      toast.success(`${data.questionsAdded} سوال به آزمون اضافه شد.`);
      const getRes = await fetch(`/api/admin/official-exams/${id}`);
      if (getRes.ok) setExam(await getRes.json());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا");
    } finally {
      setBuilding(false);
    }
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/official-exams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error((await res.json()).error || "خطا");
      setExam(await res.json());
      toast.success("ذخیره شد");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !exam) {
    return (
      <div className="container mx-auto py-8 px-4">
        {!exam && !loading && <p>آزمون یافت نشد.</p>}
        {loading && <p>در حال بارگذاری...</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/admin/official-exams" className="text-muted-foreground hover:underline">
          ← بازگشت به لیست
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ویرایش آزمون رسمی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>عنوان</Label>
            <Input
              value={editForm.title ?? ""}
              onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>سال</Label>
              <Input
                type="number"
                value={editForm.year ?? ""}
                onChange={(e) => setEditForm((p) => ({ ...p, year: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>مقطع</Label>
              <Input
                type="number"
                value={editForm.degree ?? ""}
                onChange={(e) => setEditForm((p) => ({ ...p, degree: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>جزء شروع / پایان</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={editForm.juzStart ?? ""}
                  onChange={(e) => setEditForm((p) => ({ ...p, juzStart: Number(e.target.value) }))}
                  min={1}
                  max={30}
                />
                <Input
                  type="number"
                  value={editForm.juzEnd ?? ""}
                  onChange={(e) => setEditForm((p) => ({ ...p, juzEnd: Number(e.target.value) }))}
                  min={1}
                  max={30}
                />
              </div>
            </div>
            <div>
              <Label>مدت (دقیقه)</Label>
              <Input
                type="number"
                value={editForm.durationMinutes ?? ""}
                onChange={(e) => setEditForm((p) => ({ ...p, durationMinutes: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={editForm.isActive ?? false}
              onChange={(e) => setEditForm((p) => ({ ...p, isActive: e.target.checked }))}
            />
            <Label htmlFor="isActive">فعال</Label>
          </div>
          <Button onClick={saveEdit} disabled={saving}>
            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ساختار سوالات</CardTitle>
          <CardDescription>
            سوالات از بانک سوال (فیلتر سال و جزء) انتخاب می‌شوند: ۲ سوال حفظ + ۳ سوال مفاهیم به ازای هر جزء.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={buildStructure}
            disabled={building}
          >
            {building ? "در حال ساخت..." : "ساخت / بروزرسانی ساختار"}
          </Button>
          {exam.questions && exam.questions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                تعداد سوالات: {exam.questions.length}
              </p>
              <div className="max-h-60 overflow-y-auto border rounded p-2 space-y-1">
                {exam.questions.map((q) => (
                  <div key={q.id} className="flex gap-2 text-sm">
                    <Badge variant="outline">{q.order}</Badge>
                    <span>جزء {q.juz}</span>
                    <span>{q.questionKind === "MEMORIZATION" ? "حفظ" : "مفاهیم"}</span>
                    <span className="truncate text-muted-foreground">{q.question?.questionText?.slice(0, 50)}...</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
