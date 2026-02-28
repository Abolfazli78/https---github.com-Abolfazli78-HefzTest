"use client";

import { useMemo } from "react";
import { GalleryBase, GalleryItem } from "@/components/guide/gallery-base";

export function SimulatorGallery() {
  const steps = useMemo<GalleryItem[]>(
    () => [
      {
        src: "/images/guide/Simulator1.png",
        title: "مرحله ۱: شروع شبیه‌ساز",
        description: "بر روی دکمه آزمون جدید کلیک کنید",
        notes: ["ایجاد آزمون جدید"],
      },
      {
        src: "/images/guide/Simulator2.png",
        title: "مرحله ۲: انتخاب درجه(حفظ کل ، حفظ 20 جزء، حفظ 10 جزء)",
        description: "در این مرحله، درجه آزمون را انتخاب کنید.",
        notes: ["انتخاب درجه "],
      },
      {
        src: "/images/guide/Simulator3.png",
        title: "مرحله ۳: انتخاب بازه",
        description: "بازه مورد نظر را انتخاب کنید",
        notes: ["انتخاب بازه"],
      },
      {
        src: "/images/guide/Simulator4.png",
        title: "مرحله ۴: سال مورد نظر",
        description: "سال مورد نظر را انتخاب کنید.",
        notes: ["انتخاب سال آزمون"],
      },
      {
        src: "/images/guide/Simulator5.png",
        title: "مرحله ۵: ساخت نهایی",
        description: "پیام موفقیت آمیز بودن ساخت آزمون .",
        notes: ["آزمون با موفقیت ساخته شد."],
      },
    ],
    []
  );

  return <GalleryBase images={steps} />;
}
