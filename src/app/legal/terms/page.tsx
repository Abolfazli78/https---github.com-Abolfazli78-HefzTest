import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";

export const metadata: Metadata = {
  title: "قوانین و شرایط | حفظ تست",
  description: "قوانین و شرایط استفاده از خدمات حفظ تست برای کاربران، معلمان و موسسات.",
  alternates: {
    canonical: "https://hefztest.ir/legal/terms",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "قوانین و شرایط", item: "https://hefztest.ir/legal/terms" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <h1 className="text-3xl font-bold leading-relaxed">قوانین و شرایط</h1>
        <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
          این متن یک نسخه اولیه است. با استفاده از سامانه، شما میپذیرید که اطلاعات حساب را صحیح وارد کنید، از دسترسیهای خود محافظت کنید
          و از خدمات در چارچوب قوانین استفاده کنید. بخشهای تکمیلی (پرداخت، اشتراک، پشتیبانی) قابل افزودن است.
        </p>
      </SeoPillarLayout>
    </>
  );
}
