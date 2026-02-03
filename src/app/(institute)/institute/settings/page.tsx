import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { AccountSettingsForm } from "@/components/settings/account-settings-form";

export default async function InstituteSettingsPage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "INSTITUTE") {
    redirect("/login");
  }
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">تنظیمات موسسه</h1>
        <p className="text-muted-foreground">مدیریت اطلاعات حساب و تنظیمات امنیتی</p>
      </div>
      <AccountSettingsForm
        initialName={user?.name || ""}
        initialEmail={user?.email || null}
        initialPhone={user?.phone || ""}
      />
    </div>
  );
}
