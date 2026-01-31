import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { ContentForm } from "@/components/admin/content-form";

export default async function NewContentPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">افزودن محتوای جدید</h1>
        <p className="text-muted-foreground">اطلاعات محتوا را وارد کنید</p>
      </div>

      <ContentForm />
    </div>
  );
}

