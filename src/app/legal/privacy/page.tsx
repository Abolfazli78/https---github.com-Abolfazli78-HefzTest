import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/components/seo/breadcrumbs";
import { SeoPillarLayout } from "@/components/seo/pillar-layout";

export const metadata: Metadata = {
  title: "حریم خصوصی | حفظ تست",
  description: "سیاست حریم خصوصی حفظ تست: نحوه جمعآوری، نگهداری و استفاده از اطلاعات کاربران.",
  alternates: {
    canonical: "https://hefztest.ir/legal/privacy",
  },
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "خانه", item: "https://hefztest.ir/" },
    { name: "حریم خصوصی", item: "https://hefztest.ir/legal/privacy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SeoPillarLayout>
        <h1 className="text-3xl font-bold leading-relaxed">حریم خصوصی</h1>
        <p className="mt-4 leading-8 text-slate-700 dark:text-slate-300">
          این متن یک نسخه اولیه است. اطلاعات کاربران فقط برای ارائه خدمات (مثل ورود، مدیریت نقشها و گزارشها) استفاده میشود.
          از ذخیره یا نمایش عمومی اطلاعات حساس جلوگیری میکنیم و دسترسیها نقشمحور است.
        </p>
      </SeoPillarLayout>
    </>
  );
}
