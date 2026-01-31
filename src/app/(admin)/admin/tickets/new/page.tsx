import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketCreateForm } from "@/components/admin/ticket-create-form";

export default async function NewTicketPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ایجاد تیکت جدید</h1>
        <p className="text-muted-foreground">ایجاد تیکت پشتیبانی جدید</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فرم ایجاد تیکت</CardTitle>
          <CardDescription>
            لطفاً اطلاعات تیکت جدید را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketCreateForm />
        </CardContent>
      </Card>
    </div>
  );
}
