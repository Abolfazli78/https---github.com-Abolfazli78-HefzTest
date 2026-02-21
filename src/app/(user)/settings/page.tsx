import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { AccountSettingsForm } from "@/components/settings/account-settings-form";

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">تنظیمات حساب کاربری</h1>
        <p className="text-muted-foreground">مدیریت اطلاعات شخصی و تنظیمات امنیتی</p>
      </div>
      <AccountSettingsForm
        initialName={user?.name || ""}
        initialEmail={user?.email || null}
        initialPhone={user?.phone || ""}
      />
    </div>
  );
}
