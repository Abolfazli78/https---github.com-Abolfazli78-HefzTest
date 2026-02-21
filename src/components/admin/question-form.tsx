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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PrismaClient } from '@prisma/client';
import { Question, Exam } from '@prisma/client';
import { QuestionType } from '@prisma/client';

const questionSchema = z.object({
  questionText: z.string().min(1, "متن سوال الزامی است"),
  optionA: z.string().min(1, "گزینه الف الزامی است"),
  optionB: z.string().min(1, "گزینه ب الزامی است"),
  optionC: z.string().min(1, "گزینه ج الزامی است"),
  optionD: z.string().min(1, "گزینه د الزامی است"),
  correctAnswer: z.nativeEnum(CorrectAnswer),
  explanation: z.string().optional(),
  year: z.number().optional(),
  juz: z.number().min(1).max(30).optional(),
  topic: z.string().optional(),
  difficultyLevel: z.string().optional(),
  questionKind: z.nativeEnum(QuestionKind).optional(),
  isActive: z.boolean(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  question?: {
    id: string;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: CorrectAnswer;
    explanation?: string;
    year?: number;
    juz?: number;
    topic?: string;
    difficultyLevel?: string;
    questionKind?: QuestionKind;
    isActive: boolean;
  };
}

export function QuestionForm({ question }: QuestionFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: question || {
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: undefined,
      explanation: "",
      year: undefined,
      juz: undefined,
      topic: "",
      difficultyLevel: "Medium",
      questionKind: QuestionKind.CONCEPTS,
      isActive: true,
    },
  });

  const onSubmit = async (data: QuestionFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const url = question ? `/api/questions/${question.id}` : "/api/questions";
      const method = question ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "خطا در ذخیره سوال");
        setIsLoading(false);
      } else {
        router.push("/admin/questions");
        router.refresh();
      }
    } catch (_err) {
      setError("خطا در ذخیره سوال");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question ? "ویرایش سوال" : "اطلاعات سوال"}</CardTitle>
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
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>متن سوال</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="متن سوال را وارد کنید"
                      rows={4}
                      className="arabic-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="optionA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>گزینه الف</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="گزینه الف"
                        rows={2}
                        className="arabic-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>گزینه ب</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="گزینه ب"
                        rows={2}
                        className="arabic-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>گزینه ج</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="گزینه ج"
                        rows={2}
                        className="arabic-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="optionD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>گزینه د</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="گزینه د"
                        rows={2}
                        className="arabic-text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>پاسخ صحیح</FormLabel>
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
                      <SelectItem value={CorrectAnswer.A}>الف</SelectItem>
                      <SelectItem value={CorrectAnswer.B}>ب</SelectItem>
                      <SelectItem value={CorrectAnswer.C}>ج</SelectItem>
                      <SelectItem value={CorrectAnswer.D}>د</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیح (اختیاری)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="توضیح سوال"
                      rows={3}
                      className="arabic-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سال (اختیاری)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="مثال: ۱۴۰۳"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="juz"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>جزء (اختیاری)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="مثال: ۱"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>موضوع (اختیاری)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="موضوع سوال"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سطح دشواری (اختیاری)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="مثال: آسان، متوسط، سخت"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="questionKind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع سوال</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || QuestionKind.CONCEPTS}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={QuestionKind.MEMORIZATION}>حفظ</SelectItem>
                        <SelectItem value={QuestionKind.CONCEPTS}>مفاهیم</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "در حال ذخیره..." : question ? "به‌روزرسانی" : "ایجاد"}
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

