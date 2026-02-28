"use client";

import { useMemo } from "react";
import { GalleryBase, GalleryItem } from "@/components/guide/gallery-base";

export function ResultsGallery() {
  const steps = useMemo<GalleryItem[]>(
    () => [
      {
        src: "/images/guide/result1.png",
        title: "مرحله ۱: تاریخچه آزمون‌ها",
        description: "از لیست آزمون‌ها، روی «مشاهده نتیجه» کلیک کنید.",
        notes: ["زمان و درصد هر آزمون قابل مشاهده است."],
      },
      {
        src: "/images/guide/result2.png",
        title: "مرحله ۲: صفحه نتیجه آزمون",
        description: "خلاصه عملکرد شامل تعداد صحیح/غلط و درصد نمایش داده می‌شود.",
        notes: ["می‌توانید فایل PDF کارنامه را دانلود کنید."],
      },
      {
        src: "/images/guide/result3.png",
        title: "مرحله ۳: جزئیات پاسخ‌ها",
        description: "لیست سوالات با وضعیت صحیح/غلط و توضیح نمایش داده می‌شود.",
        notes: ["برای مرور دقیق، هر سوال را بررسی کنید."],
      },
    ],
    []
  );

  return <GalleryBase images={steps} />;
}
