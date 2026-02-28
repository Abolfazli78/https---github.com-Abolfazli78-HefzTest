"use client";

import { useMemo } from "react";
import { GalleryBase, GalleryItem } from "@/components/guide/gallery-base";

export function RegisterGallery() {
  const steps = useMemo<GalleryItem[]>(
    () => [
      {
        src: "/images/guide/register1.png",
        title: "مرحله ۱: وارد شدن در صفحه ثبت نام ",
        description: "وارد بخش ثبت‌نام شوید و اطلاعات خود را وارد کنید.",
        notes: ["از صفحه اصلی وارد بخش ثبت نام شوید."],
      },
      {
        src: "/images/guide/register2.png",
        title: "مرحله ۱: شروع ثبت‌نام",
        description: "وارد بخش ثبت‌نام شوید و اطلاعات خود را وارد کنید.",
        notes: [
          "نوع حساب خود را انتخاب کنید (کاربر عادی یا دانش آموز، معلم، مدیر موسسه)",
          "نام و نام خانوادگی خود را کامل وارد کنید",
          "در صورت تمایل ایمیل خود را وارد کنید",
          "شماره موبایل خود را بدون صفر وارد کنید.  مثال: 9121112233",
        ],
      },
      {
        src: "/images/guide/register3.png",
        title: "مرحله ۲: تکمیل اطلاعات و تایید",
        description: "اطلاعات خواسته‌شده را تکمیل و ثبت‌نام را تایید کنید.",
        notes: [
          "رمز قوی انتخاب کنید.",
          "شرایط استفاده را مطالعه کنید.",
          "کد تایید 4 رقمی پیامک شده وارد کنید",
          "در آخر بر روی دکمه ایجاد حساب کاربر کلیک کنید تا حساب کاربری ساخته شود.",
        ],
      },
    ],
    []
  );

  return <GalleryBase images={steps} />;
}
