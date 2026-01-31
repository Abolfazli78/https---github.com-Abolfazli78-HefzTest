"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AccessLevel, SelectionMode } from "@/generated";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const examSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  description: z.string().optional(),
  duration: z.number().min(1, "مدت زمان باید حداقل ۱ دقیقه باشد"),
  questionCount: z.number().min(1, "تعداد سوالات باید حداقل ۱ سوال باشد"),
  accessLevel: z.nativeEnum(AccessLevel),
  selectionMode: z.nativeEnum(SelectionMode),
  year: z.number().optional(),
  juz: z.number().min(1).max(30).optional(),
  isActive: z.boolean(),
  endAt: z.string().optional(),
}).refine((data) => {
  if (data.selectionMode === "YEAR" && !data.year) {
    return false;
  }
  if (data.selectionMode === "JUZ" && !data.juz) {
    return false;
  }
  return true;
}, {
  message: "سال یا جزء بر اساس نوع انتخاب الزامی است",
  path: ["selectionMode"],
});

type ExamFormData = z.infer<typeof examSchema>;

interface ExamFormProps {
  exam?: {
    id: string;
    title: string;
    description?: string;
    duration: number;
    questionCount: number;
    accessLevel: AccessLevel;
    selectionMode: SelectionMode;
    year?: number;
    juz?: number;
    isActive: boolean;
    endAt?: Date | null;
  };
  redirectPath?: string;
}

export function ExamForm({ exam, redirectPath }: ExamFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const formatDateTimeLocal = (d?: Date | null) => {
    if (!d) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };
  const defaults: ExamFormData = exam ? {
    title: exam.title,
    description: exam.description ?? "",
    duration: exam.duration,
    questionCount: exam.questionCount,
    accessLevel: exam.accessLevel,
    selectionMode: exam.selectionMode,
    year: exam.year ?? undefined,
    juz: exam.juz ?? undefined,
    isActive: exam.isActive,
    endAt: formatDateTimeLocal(exam.endAt ? new Date(exam.endAt) : null),
  } : {
    title: "",
    description: "",
    duration: 60,
    questionCount: 50,
    accessLevel: AccessLevel.FREE,
    selectionMode: SelectionMode.RANDOM,
    isActive: true,
    endAt: "",
  };

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: defaults,
  });

  const selectionMode = form.watch("selectionMode");

  const onSubmit = async (data: ExamFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const url = exam ? `/api/exams/${exam.id}` : "/api/exams";
      const method = exam ? "PUT" : "POST";

      const payload: ExamFormData = { ...data };
      // Normalize endAt: convert "" to undefined, otherwise ISO string
      if (payload.endAt) {
        const dt = new Date(payload.endAt);
        if (!isNaN(dt.getTime())) {
          payload.endAt = dt.toISOString();
        }
      } else {
        payload.endAt = undefined;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "خطا در ذخیره آزمون");
        setIsLoading(false);
      } else {
        router.push(redirectPath || "/admin/exams");
        router.refresh();
      }
    } catch (_err) {
      setError("خطا در ذخیره آزمون");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{exam ? "ویرایش آزمون" : "اطلاعات آزمون"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان آزمون</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="مثال: آزمون حفظ قرآن - جزء اول" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات (اختیاری)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="توضیحات کوتاه درباره آزمون"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مدت زمان (دقیقه)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تعداد سوالات</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سطح دسترسی</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={AccessLevel.FREE}>رایگان</SelectItem>
                        <SelectItem value={AccessLevel.SUBSCRIPTION}>نیاز به اشتراک</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectionMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع انتخاب سوالات</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={SelectionMode.YEAR}>بر اساس سال</SelectItem>
                        <SelectItem value={SelectionMode.JUZ}>بر اساس جزء</SelectItem>
                        <SelectItem value={SelectionMode.RANDOM}>تصادفی از بانک</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>مهلت پایان آزمون (اختیاری)</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">تنظیم مهلت پایان فقط با اشتراک فعال امکان‌پذیر است.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectionMode === "YEAR" && (
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سال</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        placeholder="مثال: ۱۴۰۳"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectionMode === "JUZ" && (
              <FormField
                control={form.control}
                name="juz"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>جزء (۱-۳۰)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        placeholder="مثال: ۱"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "در حال ذخیره..." : exam ? "به‌روزرسانی" : "ایجاد"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                لغو
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

