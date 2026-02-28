"use client";

import { useMemo } from "react";
import { GalleryBase, GalleryItem } from "@/components/guide/gallery-base";

export function TeacherReportGallery() {
  const steps = useMemo<GalleryItem[]>(
    () => [
      {
        src: "/images/guide/reportt1.png",
        title: "مرحله ۱: ورود به گزارش عملکرد",
        description: "در پنل معلم، از منوی کناری گزینه «گزارش عملکرد» را انتخاب کنید.",
        notes: ["نمای کلی شاخص‌های عملکرد، اشتراک‌های فعال و پرداخت‌های اخیر نمایش داده می‌شود."],
      },
      {
        src: "/images/guide/repott2.png",
        title: "مرحله ۲: مشاهده جزئیات آزمون‌ها",
        description: "جدول آخرین نتایج آزمون‌های دانش‌آموز را بررسی کنید.",
        notes: ["نمره، تاریخ، زمان صرف‌شده و نوع آزمون قابل مشاهده است."],
      },
    ],
    []
  );

  return <GalleryBase images={steps} />;
}
