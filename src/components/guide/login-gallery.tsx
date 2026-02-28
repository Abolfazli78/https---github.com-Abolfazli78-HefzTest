"use client";

import { useMemo } from "react";
import { GalleryBase, GalleryItem } from "@/components/guide/gallery-base";

export function LoginGallery() {
  const steps = useMemo<GalleryItem[]>(
    () => [
      {
        src: "/images/guide/Login.png",
        title: "مرحله ۱: ورود به پنل کاربری",
        description: "اطلاعات حساب خود را وارد کنید و وارد پنل شوید.",
        notes: [
          "شماره همراه و رمز عبور را وارد کنید.",
          "همچنین میتوانید از طریق کد پیامکی وارد شوید.",
          "در صورت فراموشی رمز، روی «بازیابی رمز» بزنید.",
          "در صورت نداشتن حساب، از بخش ثبت‌نام حساب بسازید.",
        ],
      },
    ],
    []
  );

  return <GalleryBase images={steps} />;
}
