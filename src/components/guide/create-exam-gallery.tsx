"use client";

import { useMemo } from "react";
import { GalleryBase, GalleryItem } from "@/components/guide/gallery-base";

export function CreateExamGallery() {
  const steps = useMemo<GalleryItem[]>(
    () => [
      {
        src: "/images/guide/create-exam-1.png",
        title: "مرحله ۱: انتخاب محدوده محفوظات",
        description: "محدوده سوره‌ها، اجزاء یا هر دو را انتخاب کنید.",
        notes: ["برای شروع یکی از گزینه‌ها را انتخاب کنید."]
      },
      {
        src: "/images/guide/create-exam-2.png",
        title: "مرحله 2: انتخاب سوره به صورت پیوسته",
        description: "سوره‌ها را به صورت بازه پیوسته انتخاب کنید.",
        notes: [
          "سوره شروع و پایان را مشخص کنید.",
          "برای انتخاب‌های پشت‌سرهم مناسب است.",
        ]
      },
      {
        src: "/images/guide/create-exam-3.png",
        title: "مرحله ۳: انتخاب سوره به صورت چند انتخابی",
        description: "سوره‌ها را به صورت چند انتخابی انتخاب کنید.",
        notes: ["می‌توانید چند سوره دلخواه را جداگانه انتخاب کنید."]
      },
      {
        src: "/images/guide/create-exam-4.png",
        title: "مرحله ۴: انتخاب همزمان سوره و جزء",
        description: "سوره و جزء را همزمان انتخاب کنید.",
        notes: ["برای جزء هم بازه پیوسته و هم چند انتخابی وجود دارد."]
      },
      {
        src: "/images/guide/create-exam-5.png",
        title: "مرحله ۵: انتخاب سال محدوده آزمون",
        description: "سال سوالات را انتخاب کنید.",
        notes: ["می‌توانید یک سال مشخص یا بازه سال‌ها را تعیین کنید."]
      },
      {
        src: "/images/guide/create-exam-6.png",
        title: "مرحله ۶: سطح آزمون",
        description: "سطح آزمون را مشخص کنید.",
        notes: ["سطح را متناسب با هدف تمرین انتخاب کنید."]
      },
      {
        src: "/images/guide/create-exam-7.png",
        title: "مرحله ۷: موضوع آزمون",
        description: "نوع سوالات را تعیین کنید.",
        notes: ["مفاهیم، حفظ یا هر دو را می‌توانید انتخاب کنید."]
      },
      {
        src: "/images/guide/create-exam-8.png",
        title: "مرحله ۸: تنظیمات کلی آزمون",
        description: "تنظیمات کلی آزمون را وارد کنید.",
        notes: [
          "عنوان آزمون، تعداد سوالات و زمان را تعیین کنید.",
          "تعداد سوالات باید با انتخاب‌های شما همخوانی داشته باشد.",
          "تعداد سوالات مجاز زیر فیلد تعداد سوالات نمایش داده می‌شود.",
        ]
      },
      {
        src: "/images/guide/create-exam-9.png",
        title: "مرحله ۹: تایید نهایی",
        description: "اطلاعات را بررسی و تایید نهایی کنید.",
        notes: ["پس از تایید، آزمون ساخته و آماده شروع می‌شود."]
      },
    ],
    []
  );

  return <GalleryBase images={steps} />;
}
