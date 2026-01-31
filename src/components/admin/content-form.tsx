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
import { ContentType } from "@/generated";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contentSchema = z.object({
  type: z.nativeEnum(ContentType),
  title: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().min(0),
  isActive: z.boolean(),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentFormProps {
  content?: {
    id: string;
    type: ContentType;
    title?: string;
    content?: string;
    imageUrl?: string;
    order: number;
    isActive: boolean;
  };
}

export function ContentForm({ content }: ContentFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: content || {
      type: ContentType.TEXT,
      title: "",
      content: "",
      imageUrl: "",
      order: 0,
      isActive: true,
    },
  });

  const contentType = form.watch("type");

  const onSubmit = async (data: ContentFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const url = content ? `/api/content/${content.id}` : "/api/content";
      const method = content ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "خطا در ذخیره محتوا");
        setIsLoading(false);
      } else {
        router.push("/admin/content");
        router.refresh();
      }
    } catch (_err) {
      setError("خطا در ذخیره محتوا");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content ? "ویرایش محتوا" : "اطلاعات محتوا"}</CardTitle>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع محتوا</FormLabel>
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
                      <SelectItem value={ContentType.SLIDER}>اسلایدر</SelectItem>
                      <SelectItem value={ContentType.BANNER}>بنر</SelectItem>
                      <SelectItem value={ContentType.TEXT}>متن</SelectItem>
                      <SelectItem value={ContentType.ANNOUNCEMENT}>اعلان</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان (اختیاری)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="عنوان محتوا" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>محتوا (اختیاری)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="متن محتوا"
                      rows={5}
                      className="arabic-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(contentType === ContentType.SLIDER || contentType === ContentType.BANNER) && (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آدرس تصویر</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ترتیب نمایش</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "در حال ذخیره..." : content ? "به‌روزرسانی" : "ایجاد"}
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

