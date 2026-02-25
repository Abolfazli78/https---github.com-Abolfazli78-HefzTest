 import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "تماس با ما | حفظ تست",
  description: "راه‌های تماس با تیم حفظ تست: ارسال پیام، پشتیبانی و ارتباط با ما برای پیشنهادها و سوالات.",
  alternates: {
    canonical: "https://hefztest.ir/contact",
  },
};

export default function Page() {
  return <ContactClient />;
}
