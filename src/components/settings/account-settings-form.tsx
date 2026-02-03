"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PhoneInputSimple } from "@/components/ui/phone-input-simple";

type Props = {
  initialName: string;
  initialEmail?: string | null;
  initialPhone: string;
};

export function AccountSettingsForm({ initialName, initialEmail, initialPhone }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName || "");
  const [phone, setPhone] = useState(initialPhone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const onSaveProfile = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ذخیره اطلاعات");
      } else {
        setInfo(data.message || "ذخیره شد");
        router.refresh();
      }
    } catch {
      setError("خطا در ذخیره اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در تغییر رمز عبور");
      } else {
        setInfo(data.message || "رمز عبور بروزرسانی شد");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch {
      setError("خطا در تغییر رمز عبور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 max-w-4xl">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {info && (
        <Alert>
          <AlertDescription>{info}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات شخصی</CardTitle>
          <CardDescription>نام و شماره تماس خود را تغییر دهید</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" />
          </div>
          <div className="grid gap-2">
            <Label>شماره موبایل</Label>
            <PhoneInputSimple value={phone} onChange={setPhone} />
          </div>
          <div className="grid gap-2">
            <Label>آدرس ایمیل</Label>
            <Input value={initialEmail || ""} disabled className="h-12 bg-muted/50" />
          </div>
          <Button onClick={onSaveProfile} disabled={loading}>ذخیره تغییرات</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>امنیت</CardTitle>
          <CardDescription>تغییر رمز عبور</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">رمز عبور فعلی</Label>
            <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="h-12" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">رمز عبور جدید</Label>
            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-12" />
          </div>
          <Button variant="outline" onClick={onChangePassword} disabled={loading}>تغییر رمز عبور</Button>
        </CardContent>
      </Card>
    </div>
  );
}
