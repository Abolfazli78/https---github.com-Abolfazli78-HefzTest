"use client";

import { useMemo } from "react";
import { GalleryBase, GalleryItem } from "@/components/guide/gallery-base";

export function TeacherAddStudentGallery() {
  const steps = useMemo<GalleryItem[]>(
    () => [
      {
        src: "/images/guide/teacher.png",
        title: "مرحله ۱: ورود به پنل معلم",
        description: "پس از ورود، وارد پنل معلم شوید.",
        notes: ["از منوی بالای سایت به پنل کاربری بروید.", "نقش معلم را انتخاب کنید."],
      },
      {
        src: "/images/guide/teacher2.png",
        title: "مرحله ۲: انتخاب مدیریت کلاس",
        description: "از منوی کناری، بخش «مدیریت کلاس» را باز کنید.",
        notes: ["در این بخش، دعوت‌نامه‌ها و اعضای کلاس مدیریت می‌شود."],
      },
      {
        src: "/images/guide/teacher3.png",
        title: "مرحله ۳: فرم دعوت عضو جدید",
        description: "فرم دعوت عضو جدید را در پنل مدیریت کلاس پیدا کنید.",
        notes: ["این فرم در سمت راست/بالا قرار دارد."],
      },
      {
        src: "/images/guide/teacher4.png",
        title: "مرحله ۴: وارد کردن شماره موبایل",
        description: "شماره موبایل قرآن‌آموز را به‌همراه کد کشور وارد کنید.",
        notes: ["مثال: 98+ 912xxxxxxx", "صفر ابتدایی شماره را وارد نکنید."],
      },
      {
        src: "/images/guide/teacher5.png",
        title: "مرحله ۵: ارسال دعوت‌نامه",
        description: "روی دکمه «ارسال دعوت‌نامه» کلیک کنید.",
        notes: ["در صورت موفقیت، پیام تایید نمایش داده می‌شود."],
      },
      {
        src: "/images/guide/teacher6.png",
        title: "مرحله ۶: مشاهده وضعیت دعوت",
        description: "وضعیت دعوت‌نامه در لیست «دعوت‌نامه‌های ارسال» نمایش داده می‌شود.",
        notes: ["وضعیت «در انتظار» به معنای ارسال موفق دعوت است."],
      },
      {
        src: "/images/guide/teacher7.png",
        title: "مرحله ۷: تکمیل عضویت",
        description: "پس از پذیرش دعوت توسط قرآن‌آموز، نام او در لیست دانش‌آموزان کلاس نمایش داده می‌شود.",
        notes: ["در صورت نیاز می‌توانید نقش یا وضعیت عضو را ویرایش کنید."],
      },
    ],
    []
  );

  return <GalleryBase images={steps} />;
}
