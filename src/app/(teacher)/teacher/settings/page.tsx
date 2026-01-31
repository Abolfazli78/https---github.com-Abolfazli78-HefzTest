import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Bell } from "lucide-react";

export default async function TeacherSettingsPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "TEACHER") {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">تنظیمات حساب معلم</h1>
        <p className="text-muted-foreground">مدیریت اطلاعات شخصی و تنظیمات امنیتی</p>
      </div>

      <div className="grid gap-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-500" />
              اطلاعات شخصی
            </CardTitle>
            <CardDescription>نام و ایمیل خود را در اینجا مشاهده کنید</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input id="name" defaultValue={user?.name || ""} className="h-12" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">آدرس ایمیل</Label>
              <Input id="email" defaultValue={user?.email || ""} disabled className="h-12 bg-muted/50" />
              <p className="text-xs text-muted-foreground">ایمیل قابل تغییر نیست</p>
            </div>
            <Button className="mt-4">ذخیره تغییرات</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              امنیت
            </CardTitle>
            <CardDescription>تغییر رمز عبور و تنظیمات امنیتی</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">رمز عبور فعلی</Label>
              <Input id="current-password" type="password" className="h-12" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">رمز عبور جدید</Label>
              <Input id="new-password" type="password" className="h-12" />
            </div>
            <Button variant="outline">تغییر رمز عبور</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              اطلاع‌رسانی‌ها
            </CardTitle>
            <CardDescription>نحوه دریافت پیام‌ها و اعلان‌های سیستم</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
              <div>
                <p className="font-medium">اعلان‌های ایمیلی</p>
                <p className="text-sm text-muted-foreground">دریافت گزارش‌ها در ایمیل</p>
              </div>
              <Button variant="outline" size="sm">فعال</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
