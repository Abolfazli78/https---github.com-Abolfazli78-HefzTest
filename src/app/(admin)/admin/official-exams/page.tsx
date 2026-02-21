"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  createdAt: string;
  _count?: { questions: number };
};

export default function OfficialExamsPage() {
  const [exams, setExams] = useState<OfficialExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/official-exams")
      .then((res) => res.ok ? res.json() : [])
      .then(setExams)
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/official-exams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (!res.ok) throw new Error(await res.json().then((r) => r.error));
      setExams((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isActive: !current } : e))
      );
      toast.success(current ? "آزمون غیرفعال شد" : "آزمون فعال شد");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">آزمون‌های رسمی (شبیه‌ساز)</h1>
          <p className="text-muted-foreground">مدیریت ساختار آزمون‌های رسمی بر اساس بانک سوال</p>
        </div>
        <Link href="/admin/official-exams/new">
          <Button>ایجاد آزمون رسمی</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست آزمون‌های رسمی</CardTitle>
          <CardDescription>
            مجموع: {exams.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground py-4">در حال بارگذاری...</p>
          ) : exams.length === 0 ? (
            <p className="text-muted-foreground py-4">آزمون رسمی ثبت نشده است.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">عنوان</th>
                    <th className="p-3">سال</th>
                    <th className="p-3">مقطع</th>
                    <th className="p-3">بازه جزء</th>
                    <th className="p-3">مدت (دقیقه)</th>
                    <th className="p-3">تعداد سوال</th>
                    <th className="p-3">وضعیت</th>
                    <th className="p-3">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id} className="border-b">
                      <td className="p-3 font-medium">{exam.title}</td>
                      <td className="p-3">{exam.year}</td>
                      <td className="p-3">{exam.degree}</td>
                      <td className="p-3">
                        جزء {exam.juzStart} تا {exam.juzEnd}
                      </td>
                      <td className="p-3">{exam.durationMinutes}</td>
                      <td className="p-3">
                        {exam._count?.questions ?? exam.totalQuestions}
                      </td>
                      <td className="p-3">
                        <Badge variant={exam.isActive ? "default" : "secondary"}>
                          {exam.isActive ? "فعال" : "غیرفعال"}
                        </Badge>
                      </td>
                      <td className="p-3 flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(exam.id, exam.isActive)}
                        >
                          {exam.isActive ? "غیرفعال" : "فعال"}
                        </Button>
                        <Link href={`/admin/official-exams/${exam.id}`}>
                          <Button variant="outline" size="sm">
                            ویرایش / ساختار
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
