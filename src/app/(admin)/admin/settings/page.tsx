import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">تنظیمات سیستم</h1>
        <p className="text-muted-foreground">مدیریت تنظیمات و پیکربندی سیستم</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات عمومی</CardTitle>
            <CardDescription>
              تنظیمات کلی سیستم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              این بخش در نسخه‌های بعدی پیاده‌سازی خواهد شد.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تنظیمات فونت</CardTitle>
            <CardDescription>
              مدیریت فونت‌های عربی و فارسی
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              فونت‌های فعلی: Amiri (عربی) و Vazirmatn (فارسی)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>اعلان‌ها</CardTitle>
            <CardDescription>
              تنظیمات اعلان‌ها و اطلاع‌رسانی
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              این بخش در نسخه‌های بعدی پیاده‌سازی خواهد شد.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

